import { gql } from '@apollo/client';

export const GET_PHONES = gql`
  query GetPhones($monthlyIncome: Float, $riskGroupId: ID) {
    phones(monthlyIncome: $monthlyIncome, riskGroupId: $riskGroupId) {
      id
      name
      brand
      cashPrice
      imageUrl
    }
  }
`;

export const GET_PHONE_PRICING = gql`
  query GetPhonePricing($phoneId: ID!, $riskGroupId: ID!) {
    phonePricing(phoneId: $phoneId, riskGroupId: $riskGroupId) {
      phone {
        id
        name
        brand
        cashPrice
        imageUrl
      }
      riskGroup {
        id
        groupNumber
        name
        depositPercent
        interestRate
      }
      depositAmount
      loanPrincipal
      loanAmount
      dailyPayment
      monthlyPayment
    }
  }
`;

export const GET_RISK_GROUPS = gql`
  query GetRiskGroups {
    riskGroups {
      id
      groupNumber
      name
      depositPercent
      interestRate
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      idNumber
      birthday
      monthlyIncome
      riskGroup {
        id
        groupNumber
        name
        depositPercent
        interestRate
      }
      selectedPhone {
        id
        name
        brand
        cashPrice
      }
    }
  }
`;

export const GET_USER_LOANS = gql`
  query GetUserLoans($userId: ID!) {
    userLoans(userId: $userId) {
      id
      phone {
        id
        name
        brand
      }
      riskGroup {
        id
        groupNumber
        name
      }
      deposit
      loanPrincipal
      loanAmount
      dailyPayment
      checkoutStep
      createdAt
    }
  }
`;
