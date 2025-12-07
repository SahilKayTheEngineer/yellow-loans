import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSize['2xl']};
  font-weight: ${(props) => props.theme.fontWeight.semibold};
  color: ${(props) => props.theme.colors.gray[900]};
`;

const FormField = styled.div``;

const Label = styled.label`
  display: block;
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  color: ${(props) => props.theme.colors.gray[700]};
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const CurrencySymbol = styled.span`
  position: absolute;
  left: 1rem;
  top: 0.5rem;
  color: ${(props) => props.theme.colors.gray[500]};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  padding-left: 2rem;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.fontSize.base};

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: ${(props) => props.theme.colors.yellow.primary};
    border-color: transparent;
  }
`;

const ErrorText = styled.p`
  margin-top: 0.25rem;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.red[600]};
`;

const InfoText = styled.p`
  margin-top: 0.25rem;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.gray[600]};
`;

export default function IncomeForm() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const monthlyIncome = watch('monthlyIncome');

  return (
    <FormContainer>
      <FormTitle>Income Information</FormTitle>
      
      <FormField>
        <Label htmlFor="monthlyIncome">Monthly Income (ZAR) *</Label>
        <InputWrapper>
          <CurrencySymbol>R</CurrencySymbol>
          <Input
            type="number"
            id="monthlyIncome"
            {...register('monthlyIncome', { valueAsNumber: true })}
            placeholder="15000"
            min="1000"
            step="100"
          />
        </InputWrapper>
        {errors.monthlyIncome && (
          <ErrorText>{errors.monthlyIncome.message as string}</ErrorText>
        )}
        {monthlyIncome && (
          <InfoText>
            Annual income: R{(Number(monthlyIncome) * 12).toLocaleString()}
          </InfoText>
        )}
      </FormField>
    </FormContainer>
  );
}
