// Base form element interface
export interface BaseFormElement {
  type: string;
  id?: string;
  className?: string;
  style?: Record<string, string>;
  messages?: Message[];
  visible?: boolean;
  disabled?: boolean;
}

// Label element
export interface Label extends BaseFormElement {
  type: "label";
  text: string;
}

// Radio group
export interface RadioGroup extends BaseFormElement {
  type: "radio-group";
  name: string;
  options: Array<{
    value: string;
    label: string;
    messages?: Message[];
  }>;
  layout?: "horizontal" | "vertical";
}

// Amount input
export interface AmountInput extends BaseFormElement {
  type: "amount-input";
  name: string;
  prefix?: string;
  value?: number;
  max?: number;
  description?: string;
}

// Option card
export interface OptionCard extends BaseFormElement {
  type: "option-card";
  title: string;
  description: string;
  selected?: boolean;
  icon?: string;
}

// Message type
export interface Message {
  type: "info" | "warning" | "error" | "success";
  content: string;
  icon?: string;
  style?: "card" | "inline" | "banner";
}

// Page layout
export interface PageLayout {
  type: "main-content";
  title: string;
  description?: string;
  backButton?: boolean;
  sections: Section[];
  actions: {
    next?: boolean;
    cancel?: boolean;
  };
}

// Form section
export interface Section {
  type: "section";
  title?: string;
  description?: string;
  rows: ContentRow[];
}

// Content row
export interface ContentRow {
  type: "row";
  leftColumn: FormElement;
  rightColumn?: RightColumnContent;
  alignment?: "top" | "center" | "bottom";
}

// Right column content type
export type RightColumnContent = FormElement | HelpContent | string | number;

// Help content
export interface HelpContent {
  type: "help";
  title: string;
  content: string;
  contactInfo?: {
    phone: string;
    hours: string;
  };
  style?: "card" | "inline";
}

// Summary row
export interface SummaryRow {
  type: "summary-row";
  label: string;
  value: string | number;
  description?: string;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  warnings?: Message[];
  calculations?: Record<string, any>;
}

// Validation error
export interface ValidationError {
  field: string;
  message: string;
  type: "error" | "warning";
}

// Submit result
export interface SubmitResult {
  success: boolean;
  reference: string;
  summary: {
    totalWithdrawal: number;
    taxFreeAmount: number;
    taxableAmount: number;
    taxPayable: number;
    finalAmount: number;
  };
}

// Data provider
export interface DataProvider {
  id: string;
  dependencies?: string[];
  refreshTriggers?: string[];
  fetch: (context: any) => Promise<any>;
}

// Form element type
export type FormElement = 
  | BaseFormElement 
  | Label 
  | RadioGroup 
  | AmountInput 
  | OptionCard 
  | SummaryRow; 