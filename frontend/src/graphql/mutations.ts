import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      success
      errors
      user {
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
        }
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      monthlyIncome
      riskGroup {
        id
        groupNumber
        name
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

export const CREATE_USER_LOAN = gql`
  mutation CreateUserLoan($input: CreateUserLoanInput!) {
    createUserLoan(input: $input) {
      success
      errors
      userLoan {
        id
        user {
          id
          firstName
          lastName
        }
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
      }
    }
  }
`;

export const UPDATE_USER_LOAN_CHECKOUT_STEP = gql`
  mutation UpdateUserLoanCheckoutStep($id: ID!, $checkoutStep: CheckoutStep!) {
    updateUserLoanCheckoutStep(id: $id, checkoutStep: $checkoutStep) {
      id
      checkoutStep
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
      loanAmount
      dailyPayment
    }
  }
`;
