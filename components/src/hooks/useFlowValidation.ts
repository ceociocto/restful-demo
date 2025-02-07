import { useState } from 'react';
import { FormData, ValidationResult, ValidatorFn } from '@/types';

export const useFlowValidation = (validators?: Record<string, ValidatorFn>) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    valid: true
  });

  const validate = async (data: FormData, currentStep: string): Promise<ValidationResult> => {
    const errors: Record<string, string> = {};
    const warnings: Array<{ field: string; message: string }> = [];

    // Tax calculation step validation
    if (currentStep === 'tax-calculation') {
      if (data.withdrawalType === 'part') {
        if (!data.withdrawalAmount) {
          errors.withdrawalAmount = 'Please enter withdrawal amount';
        } else if (data.withdrawalAmount <= 0) {
          errors.withdrawalAmount = 'Withdrawal amount must be greater than 0';
        } else if (validators?.maxAmount) {
          const maxAmountResult = await validators.maxAmount(data.withdrawalAmount);
          if (typeof maxAmountResult === 'string') {
            errors.withdrawalAmount = maxAmountResult;
          }
        }

        // Check tax warnings
        if (data.withdrawalAmount && data.withdrawalAmount > 25000) {
          warnings.push({
            field: 'withdrawalAmount',
            message: 'This amount may be subject to additional tax'
          });
        }
      }
    }

    // Investment choice step validation
    if (currentStep === 'investment-choice' && !data.investmentChoice) {
      errors.investmentChoice = 'Please select an investment option';
    }

    const result: ValidationResult = {
      valid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };

    setValidationResult(result);
    return result;
  };

  return {
    validate,
    validationResult
  };
}; 