import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Button,
  Alert
} from '@mui/material';
import { FormData, ValidationResult } from '@/types';

interface InvestmentChoiceStepProps {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
  onSubmit: () => void;
  validation: ValidationResult;
}

const investmentOptions = [
  {
    id: 'conservative',
    title: 'Conservative Investment',
    description: 'Low risk, stable returns, suitable for short-term investment',
    expectedReturn: '2-4%'
  },
  {
    id: 'balanced',
    title: 'Balanced Investment',
    description: 'Medium risk, balanced returns, suitable for medium-term investment',
    expectedReturn: '4-7%'
  },
  {
    id: 'aggressive',
    title: 'Aggressive Investment',
    description: 'High risk, high returns, suitable for long-term investment',
    expectedReturn: '7-12%'
  }
];

const InvestmentChoiceStep: React.FC<InvestmentChoiceStepProps> = ({
  data,
  onChange,
  onSubmit,
  validation
}) => {
  const handleInvestmentChoice = (choiceId: string) => {
    onChange({ investmentChoice: choiceId });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Choose Your Investment Strategy
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Please select an investment portfolio based on your risk tolerance
      </Typography>

      {validation.errors?.investmentChoice && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {validation.errors.investmentChoice}
        </Alert>
      )}

      <Grid container spacing={3}>
        {investmentOptions.map((option) => (
          <Grid item xs={12} md={4} key={option.id}>
            <Card 
              raised={data.investmentChoice === option.id}
              sx={{
                height: '100%',
                transition: 'all 0.3s',
                transform: data.investmentChoice === option.id ? 'scale(1.02)' : 'none'
              }}
            >
              <CardActionArea
                onClick={() => handleInvestmentChoice(option.id)}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {option.description}
                  </Typography>
                  <Typography variant="subtitle2" color="primary">
                    Expected Annual Return: {option.expectedReturn}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined">
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!data.investmentChoice}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default InvestmentChoiceStep; 