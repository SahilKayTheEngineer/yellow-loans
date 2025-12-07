import { useFormContext } from 'react-hook-form';
import { useQuery } from '@apollo/client';
import { GET_PHONE_PRICING } from '../graphql/queries';
import styled from 'styled-components';

interface LoanSummaryProps {
  riskGroupId?: string | null;
  onSubmit: () => void;
  loading: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontSize['2xl']};
  font-weight: ${(props) => props.theme.fontWeight.semibold};
  color: ${(props) => props.theme.colors.gray[900]};
`;

const SummaryCard = styled.div`
  background: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Section = styled.div``;

const SectionTitle = styled.h3`
  font-weight: ${(props) => props.theme.fontWeight.semibold};
  color: ${(props) => props.theme.colors.gray[900]};
  margin-bottom: 0.75rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  font-size: ${(props) => props.theme.fontSize.sm};
`;

const InfoItem = styled.div``;

const InfoLabel = styled.span`
  color: ${(props) => props.theme.colors.gray[600]};
`;

const InfoValue = styled.p`
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;

const InfoText = styled.p`
  font-size: ${(props) => props.theme.fontSize.sm};
`;

const LoanDetailsCard = styled.div`
  background: ${(props) => props.theme.colors.white};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: ${(props) => props.theme.fontSize.sm};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DetailLabel = styled.span`
  color: ${(props) => props.theme.colors.gray[600]};
`;

const DetailValue = styled.span`
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;

const DetailValueBold = styled.span`
  font-weight: ${(props) => props.theme.fontWeight.semibold};
`;

const DetailValueLarge = styled.span`
  font-weight: ${(props) => props.theme.fontWeight.semibold};
  font-size: ${(props) => props.theme.fontSize.lg};
  color: ${(props) => props.theme.colors.green[600]};
`;

const Divider = styled.div`
  border-top: 1px solid ${(props) => props.theme.colors.gray[200]};
  padding-top: 0.5rem;
`;

const NoticeCard = styled.div`
  background: ${(props) => props.theme.colors.blue[50]};
  border: 1px solid ${(props) => props.theme.colors.blue[200]};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: 1rem;
`;

const NoticeText = styled.p`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.blue[800]};
`;

const CenteredMessage = styled.div`
  text-align: center;
  padding: 2rem 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: ${(props) => props.theme.colors.red[600]};
`;

export default function LoanSummary({ riskGroupId }: LoanSummaryProps) {
  const { watch } = useFormContext();
  const formData = watch();

  const { data: pricingData, loading: pricingLoading } = useQuery(GET_PHONE_PRICING, {
    variables: { phoneId: formData.phoneId, riskGroupId: riskGroupId || '' },
    skip: !formData.phoneId || !riskGroupId,
  });

  const pricing = pricingData?.phonePricing;

  if (pricingLoading) {
    return <CenteredMessage>Loading summary...</CenteredMessage>;
  }

  if (!pricing) {
    return <ErrorMessage>Unable to load pricing information</ErrorMessage>;
  }

  return (
    <Container>
      <Title>Review Your Loan Application</Title>

      <SummaryCard>
        <Section>
          <SectionTitle>Personal Information</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Name:</InfoLabel>
              <InfoValue>{formData.firstName} {formData.lastName}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>ID Number:</InfoLabel>
              <InfoValue>{formData.idNumber}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Date of Birth:</InfoLabel>
              <InfoValue>{new Date(formData.birthday).toLocaleDateString()}</InfoValue>
            </InfoItem>
            {pricing?.riskGroup && (
              <InfoItem>
                <InfoLabel>Risk Group:</InfoLabel>
                <InfoValue>{pricing.riskGroup.name}</InfoValue>
              </InfoItem>
            )}
          </InfoGrid>
        </Section>

        <Section>
          <SectionTitle>Income</SectionTitle>
          <InfoText>
            <InfoLabel>Monthly Income: </InfoLabel>
            <InfoValue>R{formData.monthlyIncome.toLocaleString()}</InfoValue>
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>Selected Phone</SectionTitle>
          <InfoText>
            <InfoLabel>{pricing.phone.brand} {pricing.phone.name}</InfoLabel>
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>Loan Details</SectionTitle>
          <LoanDetailsCard>
            <DetailRow>
              <DetailLabel>Cash Price:</DetailLabel>
              <DetailValue>R{pricing.phone.cashPrice.toLocaleString()}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Deposit ({pricing.riskGroup.depositPercent * 100}%):</DetailLabel>
              <DetailValue>R{pricing.depositAmount.toLocaleString()}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Loan Principal:</DetailLabel>
              <DetailValue>R{pricing.loanPrincipal.toLocaleString()}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Interest Rate:</DetailLabel>
              <DetailValue>{(pricing.riskGroup.interestRate * 100).toFixed(1)}%</DetailValue>
            </DetailRow>
            <Divider>
              <DetailRow>
                <DetailLabel>Total Loan Amount:</DetailLabel>
                <DetailValueBold>R{pricing.loanAmount.toLocaleString()}</DetailValueBold>
              </DetailRow>
            </Divider>
            <Divider>
              <DetailRow>
                <DetailLabel>Daily Payment:</DetailLabel>
                <DetailValueBold>R{pricing.dailyPayment.toFixed(2)}</DetailValueBold>
              </DetailRow>
            </Divider>
            <Divider>
              <DetailRow>
                <DetailLabel>Monthly Payment:</DetailLabel>
                <DetailValueLarge>R{pricing.monthlyPayment.toFixed(2)}</DetailValueLarge>
              </DetailRow>
            </Divider>
          </LoanDetailsCard>
        </Section>
      </SummaryCard>

      <NoticeCard>
        <NoticeText>
          By submitting this loan application, you agree to the terms and conditions. 
          Your application will be reviewed and you will be notified of the outcome.
        </NoticeText>
      </NoticeCard>
    </Container>
  );
}
