import { PageLayout } from '../types';

// 模拟表单配置
export const mockFormConfig: PageLayout = {
  type: "main-content",
  title: "Understand taxes on your withdrawal",
  description: "We'll help you understand the tax implications of your withdrawal",
  backButton: true,
  sections: [
    {
      type: "section",
      title: "Withdrawal amount",
      rows: [
        {
          type: "row",
          leftColumn: {
            type: "label",
            text: "How much of your pension pot do you want to withdraw?"
          },
          rightColumn: {
            type: "radio-group",
            name: "withdrawalType",
            options: [
              { value: "all", label: "All of it" },
              { value: "part", label: "Part of it" }
            ]
          }
        },
        {
          type: "row",
          leftColumn: {
            type: "label",
            text: "Amount needed after tax"
          },
          rightColumn: {
            type: "amount-input",
            name: "withdrawalAmount",
            prefix: "£",
            value: 35000,
            max: 100000,
            description: "The most you can withdraw is £100,000. You can take upto £25,000 of this tax free."
          }
        },
        {
          type: "row",
          alignment: "top",
          leftColumn: {
            type: "label",
            text: "Review withdrawal options and tax implications"
          },
          rightColumn: {
            type: "option-card",
            title: "Withdraw all my tax-free cash plus some taxable savings",
            description: "Use up your whole £25,000 tax-free cash allowance and take an additional £10,000 as taxable income.",
            selected: true
          }
        },
        {
          type: "row",
          leftColumn: {
            type: "label",
            text: "Let's work out what you'll get after tax"
          },
          rightColumn: {
            type: "summary-row",
            label: "Amount we'll transfer to your bank account",
            value: 35000.00
          }
        },
        {
          type: "row",
          leftColumn: {
            type: "label",
            text: ""
          },
          rightColumn: {
            type: "summary-row",
            label: "Max tax free allowed",
            value: 25000.00,
            description: "25% of your total pension pot"
          }
        },
        {
          type: "row",
          leftColumn: {
            type: "label",
            text: ""
          },
          rightColumn: {
            type: "summary-row",
            label: "Taxable portion",
            value: 10000.00
          }
        },
        {
          type: "row",
          leftColumn: {
            type: "label",
            text: ""
          },
          rightColumn: {
            type: "summary-row",
            label: "Amount of tax you'll pay",
            value: 2952.67
          }
        },
        {
          type: "row",
          leftColumn: {
            type: "label",
            text: ""
          },
          rightColumn: {
            type: "summary-row",
            label: "Total amount to be deducted from your pension pot",
            value: 37952.67
          }
        },
        {
          type: "row",
          leftColumn: {
            type: "label",
            text: ""
          },
          rightColumn: {
            type: "summary-row",
            label: "Amount remaining in your pension drawdown after withdrawal",
            value: 62047.33
          }
        },
        {
          type: "row",
          alignment: "top",
          leftColumn: {
            type: "label",
            text: "Need some help?"
          },
          rightColumn: {
            type: "help",
            title: "Need some help?",
            content: "If there's something you want to ask us, just give us a call",
            contactInfo: {
              phone: "XXXX",
              hours: "9am to 5pm, Monday to Friday"
            },
            style: "card"
          }
        }
      ]
    }
  ],
  actions: {
    next: true,
    cancel: true
  }
};

// 模拟账户信息
export const mockAccountInfo = {
  totalPension: 100000.00,
  taxFreeAllowance: 25000.00,
  withdrawalLimits: {
    min: 1000,
    max: 100000
  },
  accountStatus: "active"
};

// 模拟税率信息
export const mockTaxRates = {
  basicRate: 0.20,
  higherRate: 0.40,
  personalAllowance: 12570
};

// 模拟验证结果
export const mockValidationResult = {
  valid: true,
  calculations: {
    taxFreeAmount: 25000.00,
    taxableAmount: 10000.00,
    taxPayable: 2952.67,
    effectiveTaxRate: 0.20
  },
  warnings: [
    {
      type: "warning" as const,
      content: "This amount exceeds your tax-free cash limit, so you'll be taxed on some of it.",
      style: "card" as const
    }
  ]
};

// 模拟提交结果
export const mockSubmitResult = {
  success: true,
  reference: "PW-2024-001",
  summary: {
    totalWithdrawal: 35000.00,
    taxFreeAmount: 25000.00,
    taxableAmount: 10000.00,
    taxPayable: 2952.67,
    finalAmount: 32047.33
  }
}; 