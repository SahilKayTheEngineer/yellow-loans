import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import styled from 'styled-components';

// Extract date from SA ID number (format: YYMMDDGSSSCAZ)
function extractDateFromSAID(idNumber: string): string | null {
  if (idNumber.length !== 13 || !/^\d+$/.test(idNumber)) {
    return null;
  }

  const year = parseInt(idNumber.substring(0, 2));
  const month = parseInt(idNumber.substring(2, 4));
  const day = parseInt(idNumber.substring(4, 6));

  // Determine full year (00-20 = 2000-2020, 21-99 = 1921-1999)
  const fullYear = year <= 20 ? 2000 + year : 1900 + year;

  // Validate month and day
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  // Format as YYYY-MM-DD for date input
  const formattedMonth = month.toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');

  return `${fullYear}-${formattedMonth}-${formattedDay}`;
}

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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FormField = styled.div``;

const Label = styled.label`
  display: block;
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  color: ${(props) => props.theme.colors.gray[700]};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.fontSize.base};

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: ${(props) => props.theme.colors.yellow.primary};
    border-color: transparent;
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[100]};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ErrorText = styled.p`
  margin-top: 0.25rem;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.red[600]};
`;

const HelperText = styled.p`
  margin-top: 0.25rem;
  font-size: ${(props) => props.theme.fontSize.xs};
  color: ${(props) => props.theme.colors.gray[500]};
`;

export default function BiographicalForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const idNumber = watch('idNumber');

  // Auto-fill birthday when ID number is entered
  useEffect(() => {
    if (idNumber && idNumber.length === 13) {
      const extractedDate = extractDateFromSAID(idNumber);
      if (extractedDate) {
        setValue('birthday', extractedDate, { shouldValidate: false });
      }
    }
  }, [idNumber, setValue]);

  return (
    <FormContainer>
      <FormTitle>Personal Information</FormTitle>
      
      <FormGrid>
        <FormField>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            type="text"
            id="firstName"
            {...register('firstName')}
            placeholder="John"
          />
          {errors.firstName && (
            <ErrorText>{errors.firstName.message as string}</ErrorText>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            type="text"
            id="lastName"
            {...register('lastName')}
            placeholder="Doe"
          />
          {errors.lastName && (
            <ErrorText>{errors.lastName.message as string}</ErrorText>
          )}
        </FormField>
      </FormGrid>

      <FormField>
        <Label htmlFor="idNumber">South African ID Number *</Label>
        <Input
          type="text"
          id="idNumber"
          {...register('idNumber')}
          placeholder="9001015800085"
          maxLength={13}
        />
        {errors.idNumber && (
          <ErrorText>{errors.idNumber.message as string}</ErrorText>
        )}
        <HelperText>13-digit South African ID number</HelperText>
      </FormField>

      <FormField>
        <Label htmlFor="birthday">Date of Birth *</Label>
        <Input
          type="date"
          id="birthday"
          {...register('birthday')}
          readOnly
          disabled
        />
        {errors.birthday && (
          <ErrorText>{errors.birthday.message as string}</ErrorText>
        )}
        <HelperText>Automatically extracted from your ID number</HelperText>
      </FormField>
    </FormContainer>
  );
}
