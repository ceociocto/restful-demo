import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { FormData, ValidationResult } from '@/types';

interface ReviewStepProps {
  data: FormData;
  onSubmit: () => void;
  isSubmitting: boolean;
  validation: ValidationResult;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  data,
  onSubmit,
  isSubmitting,
  validation
}) => {
  const formatCurrency = (amount?: number) => {
    if (!amount) return '£0';
    return `£${amount.toLocaleString()}`;
  };

  const getInvestmentTitle = (choice?: string) => {
    switch (choice) {
      case 'conservative':
        return 'Conservative Investment';
      case 'balanced':
        return 'Balanced Investment';
      case 'aggressive':
        return 'Aggressive Investment';
      default:
        return 'Not Selected';
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Confirm Your Choices
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          Withdrawal Details
        </Typography>
        <Box sx={{ my: 2 }}>
          <Typography color="text.secondary">
            Withdrawal Type
          </Typography>
          <Typography variant="subtitle1">
            {data.withdrawalType === 'all' ? 'Withdraw All' : 'Partial Withdrawal'}
          </Typography>
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography color="text.secondary">
            Withdrawal Amount
          </Typography>
          <Typography variant="subtitle1">
            {formatCurrency(data.withdrawalAmount)}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ my: 2 }}>
          <Typography color="text.secondary">
            Investment Choice
          </Typography>
          <Typography variant="subtitle1">
            {getInvestmentTitle(data.investmentChoice)}
          </Typography>
        </Box>
      </Box>

      {validation.warnings?.map((warning, index) => (
        <Alert severity="warning" sx={{ my: 2 }} key={index}>
          {warning.message}
        </Alert>
      ))}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined">
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Submit'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ReviewStep; 