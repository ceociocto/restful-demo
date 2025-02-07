import { ComponentType } from 'react';
import { Theme } from '@mui/material';

// 流程配置类型
export interface FlowConfig {
  apiBase: string;
  totalPension: number;
  theme?: Partial<Theme>;
}

// 流程属性类型
export interface FlowProps {
  config: FlowConfig;
  onComplete?: (result: SubmitResult) => void;
  onCancel?: () => void;
  onError?: (error: FlowError) => void;
  onStateChange?: (state: FlowState) => void;
  components?: {
    Button?: ComponentType<any>;
    Card?: ComponentType<any>;
  };
  validators?: Record<string, ValidatorFn>;
}

// 流程引用类型
export interface FlowRef {
  start: () => void;
  reset: () => void;
  goToStep: (stepId: string) => void;
  getCurrentStep: () => string;
  getStepData: (stepId: string) => any;
  validate: () => Promise<ValidationResult>;
}

// 表单数据类型
export interface FormData {
  withdrawalType: 'all' | 'part';
  withdrawalAmount?: number;
  withdrawalOption?: 'tax-free-only' | 'tax-free-plus-taxable';
  investmentChoice?: string;
}

// 提交结果类型
export interface SubmitResult {
  success: boolean;
  reference?: string;
  summary?: {
    totalWithdrawal: number;
    taxFreeAmount: number;
    taxableAmount: number;
    taxPayable: number;
    finalAmount: number;
  };
}

// 流程错误类型
export interface FlowError {
  code: string;
  message: string;
  details?: any;
}

// 流程状态类型
export interface FlowState {
  currentStep: string;
  data: FormData;
  validation: ValidationResult;
  isSubmitting: boolean;
}

// 验证结果类型
export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string>;
  warnings?: Array<{
    field: string;
    message: string;
  }>;
}

// 验证器函数类型
export type ValidatorFn = (value: any, context?: any) => boolean | string | Promise<boolean | string>;

// 步骤配置类型
export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  validation?: Array<{
    field: string;
    rules: Array<{
      type: string;
      message: string;
      params?: any;
    }>;
  }>;
}

// 消息类型
export interface Message {
  type: 'info' | 'warning' | 'error' | 'success';
  content: string;
  field?: string;
} 