import { Request, Response } from 'express';
import { mockFormConfig, mockAccountInfo } from '../config/mockData';
import { TaxCalculationService } from '../services/taxCalculationService';

export class FormController {
  // Get form configuration
  static async getFormConfig(req: Request, res: Response) {
    const { formId } = req.params;
    
    try {
      // Get form from configuration
      res.json({
        id: formId,
        layout: mockFormConfig
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to get form configuration"
      });
    }
  }

  // Get form metadata
  static async getFormMetadata(req: Request, res: Response) {
    const { formId } = req.params;
    
    try {
      res.json({
        id: formId,
        layout: {
          type: "main-content",
          title: mockFormConfig.title,
          sections: [
            {
              id: "withdrawal-amount",
              title: "Withdrawal amount",
              dataProvider: "account-info"
            }
          ]
        }
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to get form metadata"
      });
    }
  }

  // Get data provider data
  static async getDataProviders(req: Request, res: Response) {
    try {
      const { providers } = req.query;
      const providerList = (providers as string || '').split(',');
      
      const data: Record<string, any> = {};
      
      if (providerList.includes('account-info')) {
        data['account-info'] = mockAccountInfo;
      }
      
      res.json(data);
    } catch (error) {
      res.status(500).json({
        error: "Failed to get data provider data"
      });
    }
  }

  // Validate form data
  static async validateFormSection(req: Request, res: Response) {
    const { formId, sectionId } = req.params;
    const { data } = req.body;
    
    try {
      // Validate withdrawal amount
      const validationResult = TaxCalculationService.validateWithdrawalAmount(
        data.withdrawalAmount,
        mockAccountInfo.totalPension,
        mockAccountInfo.withdrawalLimits.min,
        mockAccountInfo.withdrawalLimits.max
      );

      if (!validationResult.valid) {
        return res.json(validationResult);
      }

      // Calculate tax
      const taxCalculation = TaxCalculationService.calculateTax(
        data.withdrawalAmount,
        mockAccountInfo.totalPension
      );

      // Calculate remaining balance
      const remainingBalance = TaxCalculationService.calculateRemainingBalance(
        mockAccountInfo.totalPension,
        data.withdrawalAmount,
        taxCalculation.calculations?.taxPayable || 0
      );

      // Merge results
      res.json({
        ...taxCalculation,
        calculations: {
          ...taxCalculation.calculations,
          remainingBalance
        }
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to validate form data"
      });
    }
  }

  // Submit form data
  static async submitForm(req: Request, res: Response) {
    const { flowId, allStepsData } = req.body;
    
    try {
      const withdrawalAmount = allStepsData?.['tax-calculation']?.withdrawalAmount;
      
      if (!withdrawalAmount) {
        return res.status(400).json({
          error: "Missing withdrawal amount"
        });
      }

      // Calculate tax
      const taxCalculation = TaxCalculationService.calculateTax(
        withdrawalAmount,
        mockAccountInfo.totalPension
      );

      // Generate submission result
      res.json({
        success: true,
        reference: `PW-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        summary: {
          totalWithdrawal: withdrawalAmount,
          taxFreeAmount: taxCalculation.calculations?.taxFreeAmount || 0,
          taxableAmount: taxCalculation.calculations?.taxableAmount || 0,
          taxPayable: taxCalculation.calculations?.taxPayable || 0,
          finalAmount: withdrawalAmount - (taxCalculation.calculations?.taxPayable || 0)
        }
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to submit form data"
      });
    }
  }
} 