import React from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Paper,
  Alert
} from '@mui/material';
import { FormData, ValidationResult } from '@/types';

interface TaxCalculationStepProps {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
  onSubmit: () => void;
  validation: ValidationResult;
  totalPension: number;
}

const TaxCalculationStep: React.FC<TaxCalculationStepProps> = ({
  data,
  onChange,
  onSubmit,
  validation,
  totalPension
}) => {
  const handleWithdrawalTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      withdrawalType: event.target.value as 'all' | 'part',
      withdrawalAmount: event.target.value === 'all' ? totalPension : undefined
    });
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(event.target.value);
    onChange({
      withdrawalAmount: isNaN(amount) ? undefined : amount
    });
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Understand Your Withdrawal Amount
      </Typography>
      
      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          How much of your pension would you like to withdraw?
        </Typography>
        
        <RadioGroup
          value={data.withdrawalType}
          onChange={handleWithdrawalTypeChange}
        >
          <FormControlLabel
            value="all"
            control={<Radio />}
            label={`Withdraw all (£${totalPension.toLocaleString()})`}
          />
          <FormControlLabel
            value="part"
            control={<Radio />}
            label="Withdraw part"
          />
        </RadioGroup>
      </Box>

      {data.withdrawalType === 'part' && (
        <Box sx={{ my: 3 }}>
          <TextField
            label="Withdrawal Amount"
            type="number"
            value={data.withdrawalAmount || ''}
            onChange={handleAmountChange}
            fullWidth
            InputProps={{
              startAdornment: <Typography>£</Typography>
            }}
            error={!!validation.errors?.withdrawalAmount}
            helperText={validation.errors?.withdrawalAmount}
          />
          
          {validation.warnings?.map((warning, index) => (
            <Alert severity="warning" sx={{ mt: 2 }} key={index}>
              {warning.message}
            </Alert>
          ))}
        </Box>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!data.withdrawalAmount}
        >
          Continue
        </Button>
      </Box>
    </Paper>
  );
};

export default TaxCalculationStep; 