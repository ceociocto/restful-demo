import { ValidationResult } from '../types';

export class TaxCalculationService {
  // Calculate tax
  static calculateTax(amount: number, totalPension: number): ValidationResult {
    const taxFreeAllowance = totalPension * 0.25; // 25% tax-free allowance
    let taxableAmount = 0;
    let taxPayable = 0;

    if (amount > taxFreeAllowance) {
      taxableAmount = amount - taxFreeAllowance;
      // Calculate tax using basic rate 20%
      taxPayable = taxableAmount * 0.20;
    }

    const calculations = {
      taxFreeAmount: Math.min(amount, taxFreeAllowance),
      taxableAmount: taxableAmount,
      taxPayable: taxPayable,
      effectiveTaxRate: taxPayable / amount
    };

    // Generate warning messages
    const warnings = [];
    if (amount > taxFreeAllowance) {
      warnings.push({
        type: "warning" as const,
        content: "This amount exceeds your tax-free cash limit, so you'll be taxed on some of it.",
        style: "card" as const
      });
    }

    return {
      valid: true,
      calculations,
      warnings
    };
  }

  // Calculate remaining balance
  static calculateRemainingBalance(
    totalPension: number,
    withdrawalAmount: number,
    taxPayable: number
  ): number {
    const totalDeduction = withdrawalAmount + taxPayable;
    return totalPension - totalDeduction;
  }

  // Validate withdrawal amount
  static validateWithdrawalAmount(
    amount: number,
    totalPension: number,
    minLimit: number,
    maxLimit: number
  ): ValidationResult {
    const errors = [];

    if (amount < minLimit) {
      errors.push({
        field: "withdrawalAmount",
        message: `Minimum withdrawal amount is £${minLimit}`,
        type: "error" as const
      });
    }

    if (amount > maxLimit) {
      errors.push({
        field: "withdrawalAmount",
        message: `Maximum withdrawal amount is £${maxLimit}`,
        type: "error" as const
      });
    }

    if (amount > totalPension) {
      errors.push({
        field: "withdrawalAmount",
        message: "Withdrawal amount cannot exceed your total pension",
        type: "error" as const
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
} 