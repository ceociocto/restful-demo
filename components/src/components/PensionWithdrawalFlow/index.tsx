import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { FlowProps, FlowRef, FlowState, FormData, ValidationResult } from '@/types';
import TaxCalculationStep from './steps/TaxCalculationStep';
import InvestmentChoiceStep from './steps/InvestmentChoiceStep';
import ReviewStep from './steps/ReviewStep';
import { useFlowValidation } from '@/hooks/useFlowValidation';
import { useFlowNavigation } from '@/hooks/useFlowNavigation';

const defaultTheme = createTheme();

export const PensionWithdrawalFlow = forwardRef<FlowRef, FlowProps>((props, ref) => {
  const { config, onComplete, onCancel, onError, onStateChange } = props;
  
  // 状态管理
  const [currentStep, setCurrentStep] = useState<string>('tax-calculation');
  const [formData, setFormData] = useState<FormData>({
    withdrawalType: 'part'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 验证钩子
  const { validate, validationResult } = useFlowValidation(props.validators);

  // 导航钩子
  const { canGoNext, canGoPrevious, goToNextStep, goToPreviousStep } = 
    useFlowNavigation(['tax-calculation', 'investment-choice', 'review'], currentStep);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    start: () => setCurrentStep('tax-calculation'),
    reset: () => {
      setFormData({ withdrawalType: 'part' });
      setCurrentStep('tax-calculation');
    },
    goToStep: (stepId: string) => setCurrentStep(stepId),
    getCurrentStep: () => currentStep,
    getStepData: () => formData,
    validate: () => validate(formData, currentStep)
  }));

  // 处理数据更新
  const handleDataChange = (data: Partial<FormData>) => {
    const newData = { ...formData, ...data };
    setFormData(newData);
    
    // 通知父组件状态变化
    const newState: FlowState = {
      currentStep,
      data: newData,
      validation: validationResult,
      isSubmitting
    };
    onStateChange?.(newState);
  };

  // 处理步骤提交
  const handleStepSubmit = async () => {
    const validation = await validate(formData, currentStep);
    if (validation.valid) {
      if (currentStep === 'review') {
        await handleFinalSubmit();
      } else {
        goToNextStep();
      }
    }
  };

  // 处理最终提交
  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${config.apiBase}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          flowId: 'pension-withdrawal',
          allStepsData: formData
        })
      });
      
      const result = await response.json();
      if (result.success) {
        onComplete?.(result);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      onError?.({
        code: 'SUBMIT_ERROR',
        message: '提交失败',
        details: error
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 渲染当前步骤
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'tax-calculation':
        return (
          <TaxCalculationStep
            data={formData}
            onChange={handleDataChange}
            onSubmit={handleStepSubmit}
            validation={validationResult}
            totalPension={config.totalPension}
          />
        );
      case 'investment-choice':
        return (
          <InvestmentChoiceStep
            data={formData}
            onChange={handleDataChange}
            onSubmit={handleStepSubmit}
            validation={validationResult}
          />
        );
      case 'review':
        return (
          <ReviewStep
            data={formData}
            onSubmit={handleStepSubmit}
            isSubmitting={isSubmitting}
            validation={validationResult}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={createTheme(defaultTheme, config.theme || {})}>
      <CssBaseline />
      <div className="pension-flow">
        {renderCurrentStep()}
      </div>
    </ThemeProvider>
  );
});

PensionWithdrawalFlow.displayName = 'PensionWithdrawalFlow'; 