import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import BiographicalForm from '../components/forms/BiographicalForm';
import IncomeForm from '../components/forms/IncomeForm';
import PhoneSelectionForm from '../components/forms/PhoneSelectionForm';
import LoanSummary from '../components/LoanSummary';
import { useMutation } from '@apollo/client';
import { CREATE_USER, CREATE_USER_LOAN, UPDATE_USER } from '../graphql/mutations';

const loanFormSchema = z.object({
  // Biographical
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  idNumber: z.string().regex(/^\d{13}$/, 'ID number must be exactly 13 digits'),
  birthday: z.string().refine((date) => {
    const d = new Date(date);
    const age = new Date().getFullYear() - d.getFullYear();
    return age >= 18 && age <= 65;
  }, 'Age must be between 18 and 65'),
  
  // Income
  monthlyIncome: z.number().min(1000, 'Monthly income must be at least R1000'),
  
  // Phone
  phoneId: z.string().min(1, 'Please select a phone'),
});

type LoanFormData = z.infer<typeof loanFormSchema>;

type Step = 'biographical' | 'income' | 'phone' | 'summary';

const Container = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Card = styled.div`
  background: ${(props) => props.theme.colors.white};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.lg};
  padding: 1.5rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontSize['3xl']};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.gray[900]};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.colors.gray[600]};
  margin-bottom: 2rem;
`;

const ProgressContainer = styled.div`
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProgressStep = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const ProgressCircle = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: ${(props) => props.theme.fontWeight.semibold};
  background: ${(props) => {
    if (props.$isActive) return props.theme.colors.yellow.primary;
    if (props.$isCompleted) return props.theme.colors.green[500];
    return props.theme.colors.gray[300];
  }};
  color: ${(props) => {
    if (props.$isActive) return props.theme.colors.gray[900];
    if (props.$isCompleted) return props.theme.colors.white;
    return props.theme.colors.gray[600];
  }};
`;

const ProgressLine = styled.div<{ $isCompleted: boolean }>`
  flex: 1;
  height: 0.25rem;
  margin: 0 0.5rem;
  background: ${(props) =>
    props.$isCompleted ? props.theme.colors.green[500] : props.theme.colors.gray[300]};
`;

const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: ${(props) => props.theme.fontSize.xs};
  color: ${(props) => props.theme.colors.gray[600]};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const ButtonGroup = styled.div`
  margin-left: auto;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' }>`
  padding: 0.5rem 1.5rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-weight: ${(props) => props.theme.fontWeight.semibold};
  border: ${(props) => {
    if (props.$variant === 'secondary') {
      return `1px solid ${props.theme.colors.gray[300]}`;
    }
    return 'none';
  }};
  background: ${(props) => {
    if (props.$variant === 'primary') return props.theme.colors.yellow.primary;
    if (props.$variant === 'success') return props.theme.colors.green[500];
    return 'transparent';
  }};
  color: ${(props) => {
    if (props.$variant === 'primary') return props.theme.colors.gray[900];
    if (props.$variant === 'success') return props.theme.colors.white;
    return props.theme.colors.gray[700];
  }};
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => {
      if (props.$variant === 'primary') return props.theme.colors.yellow.secondary;
      if (props.$variant === 'success') return props.theme.colors.green[600];
      return props.theme.colors.gray[50];
    }};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${(props) => props.theme.colors.red[100]};
  border: 1px solid ${(props) => props.theme.colors.red[400]};
  color: ${(props) => props.theme.colors.red[700]};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  max-width: 400px;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const Notification = styled.div<{ $type: 'error' | 'success' }>`
  padding: 1rem 1.5rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.lg};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(props) =>
    props.$type === 'error'
      ? props.theme.colors.red[100]
      : props.theme.colors.green[500]};
  border: 1px solid
    ${(props) =>
      props.$type === 'error'
        ? props.theme.colors.red[400]
        : props.theme.colors.green[600]};
  color: ${(props) =>
    props.$type === 'error'
      ? props.theme.colors.red[700]
      : props.theme.colors.white};
`;

const NotificationMessage = styled.div`
  flex: 1;
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.25rem;
  margin-left: 1rem;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export default function ApplicationPage() {
  const [step, setStep] = useState<Step>('biographical');
  const [riskGroupId, setRiskGroupId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [createUserLoan, { loading, error }] = useMutation(CREATE_USER_LOAN);

  // Auto-dismiss notifications after 5 seconds
  const showNotification = (type: 'error' | 'success', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Display Apollo GraphQL errors
  useEffect(() => {
    if (error) {
      setNotification({ type: 'error', message: `GraphQL Error: ${error.message}` });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  }, [error]);

  const methods = useForm<LoanFormData>({
    resolver: zodResolver(loanFormSchema),
    mode: 'onChange',
  });

  const onSubmit = async () => {
    // Risk group is already calculated in nextStep, just move to summary
    setStep('summary');
  };

  const handleFinalSubmit = async () => {
    if (!userId || !riskGroupId) {
      showNotification('error', 'User information not saved. Please go back and complete the form.');
      return;
    }

    const data = methods.getValues();
    
    try {
      // Update user's selected phone
      await updateUser({
        variables: {
          id: userId,
          input: {
            selectedPhoneId: data.phoneId,
          },
        },
      });

      // Create user loan
      const result = await createUserLoan({
        variables: {
          input: {
            userId: userId,
            phoneId: data.phoneId,
            riskGroupId: riskGroupId,
            checkoutStep: 'REVIEW',
          },
        },
      });

      if (result.data?.createUserLoan?.success) {
        showNotification('success', 'Loan application submitted successfully!');
        methods.reset();
        setStep('biographical');
        setUserId(null);
        setRiskGroupId(null);
      } else {
        const errors = result.data?.createUserLoan?.errors || [];
        showNotification('error', `Loan application failed: ${errors.join(', ')}`);
      }
    } catch (err: any) {
      showNotification('error', `Error: ${err.message}`);
    }
  };

  const nextStep = async () => {
    const currentStep = step;
    if (currentStep === 'biographical') {
      const isValid = await methods.trigger(['firstName', 'lastName', 'idNumber', 'birthday']);
      if (isValid) {
        // Create or update user (without income initially)
        const formData = methods.getValues();
        try {
          const result = await createUser({
            variables: {
              input: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                idNumber: formData.idNumber,
                birthday: formData.birthday,
                monthlyIncome: null, // Will be updated in income step
              },
            },
          });

          if (result.data?.createUser?.success && result.data?.createUser?.user) {
            const user = result.data.createUser.user;
            setUserId(user.id);
            if (user.riskGroup?.id) {
              setRiskGroupId(user.riskGroup.id);
            }
            setStep('income');
          } else {
            const errors = result.data?.createUser?.errors || [];
            showNotification('error', `Failed to save user information: ${errors.join(', ')}`);
          }
        } catch (err: any) {
          showNotification('error', `Error saving user information: ${err.message}`);
        }
      }
    } else if (currentStep === 'income') {
      const isValid = await methods.trigger(['monthlyIncome']);
      if (isValid && userId) {
        // Update user's monthly income
        const formData = methods.getValues();
        try {
          await updateUser({
            variables: {
              id: userId,
              input: {
                monthlyIncome: formData.monthlyIncome,
              },
            },
          });
          setStep('phone');
        } catch (err: any) {
          showNotification('error', `Error updating income: ${err.message}`);
        }
      } else if (isValid) {
        setStep('phone');
      }
    } else if (currentStep === 'phone') {
      methods.trigger(['phoneId']).then((isValid) => {
        if (isValid) {
          onSubmit();
        }
      });
    }
  };

  const prevStep = () => {
    // Only allow going back from income to biographical
    // Once user reaches phone selection, they cannot go back
    if (step === 'income') setStep('biographical');
  };

  const steps: Step[] = ['biographical', 'income', 'phone', 'summary'];
  const stepIndex = steps.indexOf(step);

  return (
    <>
      {notification && (
        <NotificationContainer>
          <Notification $type={notification.type}>
            <NotificationMessage>{notification.message}</NotificationMessage>
            <CloseButton onClick={() => setNotification(null)}>×</CloseButton>
          </Notification>
        </NotificationContainer>
      )}
      <Container>
        <Card>
        <Title>Apply for a Phone Loan</Title>
        <Subtitle>Complete the form below to apply for financing</Subtitle>

        <ProgressContainer>
          <ProgressBar>
            {steps.map((s, index) => (
              <ProgressStep key={s}>
                <ProgressCircle $isActive={step === s} $isCompleted={stepIndex > index}>
                  {index + 1}
                </ProgressCircle>
                {index < 3 && (
                  <ProgressLine $isCompleted={stepIndex > index} />
                )}
              </ProgressStep>
            ))}
          </ProgressBar>
          <ProgressLabels>
            <span>Personal Info</span>
            <span>Income</span>
            <span>Phone</span>
            <span>Review</span>
          </ProgressLabels>
        </ProgressContainer>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {step === 'biographical' && <BiographicalForm />}
            {step === 'income' && <IncomeForm />}
            {step === 'phone' && <PhoneSelectionForm riskGroupId={riskGroupId} />}
            {step === 'summary' && (
              <LoanSummary
                riskGroupId={riskGroupId}
                onSubmit={handleFinalSubmit}
                loading={loading}
              />
            )}

            <ButtonContainer>
              {step === 'income' && (
                <Button type="button" onClick={prevStep} $variant="secondary">
                  Previous
                </Button>
              )}
              <ButtonGroup>
                {step !== 'summary' ? (
                  <Button type="button" onClick={nextStep} $variant="primary">
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    $variant="success"
                  >
                    {loading ? 'Submitting...' : 'Submit Loan Application'}
                  </Button>
                )}
              </ButtonGroup>
            </ButtonContainer>
          </form>
        </FormProvider>

        {error && (
          <ErrorMessage>
            Error: {error.message}
          </ErrorMessage>
        )}
      </Card>
    </Container>
    </>
  );
}
