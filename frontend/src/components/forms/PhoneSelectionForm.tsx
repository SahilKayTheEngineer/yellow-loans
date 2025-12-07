import { useFormContext } from 'react-hook-form';
import { useQuery } from '@apollo/client';
import { GET_PHONES, GET_PHONE_PRICING } from '../../graphql/queries';
import PhoneCard from '../PhoneCard';
import { useState } from 'react';
import styled from 'styled-components';

interface PhoneSelectionFormProps {
  riskGroupId?: string | null;
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

const CenteredMessage = styled.div`
  text-align: center;
  padding: 2rem 0;
`;

const MessageText = styled.p`
  color: ${(props) => props.theme.colors.gray[600]};
`;

const ErrorText = styled.p`
  color: ${(props) => props.theme.colors.red[600]};
  font-weight: ${(props) => props.theme.fontWeight.semibold};
  margin-bottom: 0.5rem;
`;

const PhoneGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const LoadingCard = styled.div`
  padding: 1rem;
  background: ${(props) => props.theme.colors.blue[50]};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const LoadingText = styled.p`
  color: ${(props) => props.theme.colors.blue[800]};
`;

const PricingCard = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
`;

const PricingTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: ${(props) => props.theme.fontWeight.semibold};
  color: ${(props) => props.theme.colors.gray[900]};
  margin-bottom: 1rem;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  font-size: ${(props) => props.theme.fontSize.sm};
`;

const PricingItem = styled.div``;

const PricingLabel = styled.span`
  color: ${(props) => props.theme.colors.gray[600]};
`;

const PricingValue = styled.p`
  font-weight: ${(props) => props.theme.fontWeight.semibold};
`;

const PricingValueLarge = styled.p`
  font-weight: ${(props) => props.theme.fontWeight.semibold};
  font-size: ${(props) => props.theme.fontSize.lg};
`;

const PricingFullWidth = styled.div`
  grid-column: span 2;
`;

export default function PhoneSelectionForm({ riskGroupId }: PhoneSelectionFormProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const monthlyIncome = watch('monthlyIncome');

  const { data: phonesData, loading: phonesLoading } = useQuery(GET_PHONES, {
    variables: {
      monthlyIncome: monthlyIncome ? Number(monthlyIncome) : undefined,
      riskGroupId: riskGroupId || undefined,
    },
    skip: !monthlyIncome || !riskGroupId, // Only fetch when we have both income and risk group
  });

  const selectedPhoneId = watch('phoneId');
  const [selectedPhonePricing, setSelectedPhonePricing] = useState<any>(null);

  const { loading: pricingLoading } = useQuery(GET_PHONE_PRICING, {
    variables: { phoneId: selectedPhoneId, riskGroupId: riskGroupId || '' },
    skip: !selectedPhoneId || !riskGroupId,
    onCompleted: (data) => {
      setSelectedPhonePricing(data?.phonePricing);
    },
  });

  if (!monthlyIncome || !riskGroupId) {
    return (
      <CenteredMessage>
        <MessageText>Please complete the income step first to see available phones.</MessageText>
      </CenteredMessage>
    );
  }

  if (phonesLoading) {
    return (
      <CenteredMessage>
        <MessageText>Loading affordable phones...</MessageText>
      </CenteredMessage>
    );
  }

  const phones = phonesData?.phones || [];

  if (phones.length === 0) {
    return (
      <CenteredMessage>
        <ErrorText>No phones available</ErrorText>
        <MessageText>
          Your monthly income (R{Number(monthlyIncome).toLocaleString()}) is not sufficient for any available phones.
          <br />
          Monthly income must be at least 10x the monthly payment amount.
        </MessageText>
      </CenteredMessage>
    );
  }

  return (
    <FormContainer>
      <FormTitle>Select a Phone</FormTitle>
      
      <input
        type="hidden"
        {...register('phoneId')}
      />

      {errors.phoneId && (
        <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>
          {errors.phoneId.message as string}
        </p>
      )}

      <PhoneGrid>
        {phones.map((phone: any) => (
          <PhoneCard
            key={phone.id}
            phone={phone}
            isSelected={selectedPhoneId === phone.id}
            onClick={() => {
              setValue('phoneId', phone.id);
            }}
          />
        ))}
      </PhoneGrid>

      {selectedPhoneId && pricingLoading && (
        <LoadingCard>
          <LoadingText>Calculating pricing...</LoadingText>
        </LoadingCard>
      )}

      {selectedPhonePricing && (
        <PricingCard>
          <PricingTitle>Loan Details</PricingTitle>
          <PricingGrid>
            <PricingItem>
              <PricingLabel>Cash Price:</PricingLabel>
              <PricingValue>
                R{selectedPhonePricing.phone.cashPrice.toLocaleString()}
              </PricingValue>
            </PricingItem>
            <PricingItem>
              <PricingLabel>Deposit:</PricingLabel>
              <PricingValue>
                R{selectedPhonePricing.depositAmount.toLocaleString()}
              </PricingValue>
            </PricingItem>
            <PricingItem>
              <PricingLabel>Loan Amount:</PricingLabel>
              <PricingValue>
                R{selectedPhonePricing.loanAmount.toLocaleString()}
              </PricingValue>
            </PricingItem>
            <PricingItem>
              <PricingLabel>Daily Payment:</PricingLabel>
              <PricingValue>
                R{selectedPhonePricing.dailyPayment.toFixed(2)}
              </PricingValue>
            </PricingItem>
            <PricingFullWidth>
              <PricingLabel>Monthly Payment:</PricingLabel>
              <PricingValueLarge>
                R{selectedPhonePricing.monthlyPayment.toFixed(2)}
              </PricingValueLarge>
            </PricingFullWidth>
          </PricingGrid>
        </PricingCard>
      )}
    </FormContainer>
  );
}
