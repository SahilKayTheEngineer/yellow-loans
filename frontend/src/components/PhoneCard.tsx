import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

interface PhoneCardProps {
  phone: {
    id: string;
    name: string;
    brand: string;
    cashPrice: number;
    imageUrl?: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

const Card = styled.div<{ $isSelected: boolean }>`
  padding: 1rem;
  border: 2px solid ${(props) =>
    props.$isSelected ? props.theme.colors.yellow.primary : props.theme.colors.gray[200]};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) =>
    props.$isSelected ? '#fffef0' : props.theme.colors.white};

  &:hover {
    border-color: ${(props) =>
      props.$isSelected
        ? props.theme.colors.yellow.primary
        : props.theme.colors.gray[300]};
    box-shadow: ${(props) => props.theme.shadows.sm};
  }
`;

const PhoneImage = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: contain;
  margin-bottom: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const CardContent = styled.div`
  text-align: center;
`;

const PhoneName = styled.h3`
  font-weight: ${(props) => props.theme.fontWeight.semibold};
  color: ${(props) => props.theme.colors.gray[900]};
`;

const PhoneBrand = styled.p`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.gray[600]};
  margin-bottom: 0.5rem;
`;

const PhonePrice = styled.p`
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.yellow.primary};
`;

export default function PhoneCard({ phone, isSelected, onClick }: PhoneCardProps) {
  const { setValue } = useFormContext();

  const handleClick = () => {
    setValue('phoneId', phone.id);
    onClick();
  };

  return (
    <Card $isSelected={isSelected} onClick={handleClick}>
      {phone.imageUrl && (
        <PhoneImage src={phone.imageUrl} alt={phone.name} />
      )}
      <CardContent>
        <PhoneName>{phone.name}</PhoneName>
        <PhoneBrand>{phone.brand}</PhoneBrand>
        <PhonePrice>R{phone.cashPrice.toLocaleString()}</PhonePrice>
      </CardContent>
    </Card>
  );
}
