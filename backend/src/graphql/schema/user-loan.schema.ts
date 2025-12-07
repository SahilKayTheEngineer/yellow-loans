import { gql } from 'graphql-tag';

export const userLoanSchema = gql`
  enum CheckoutStep {
    PENDING
    REVIEW
    COMPLETED
    REJECTED
  }

  type UserLoan {
    id: ID!
    user: User!
    phone: Phone!
    riskGroup: RiskGroup!
    deposit: Float!
    loanPrincipal: Float!
    loanAmount: Float!
    dailyPayment: Float!
    checkoutStep: CheckoutStep!
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserLoanInput {
    userId: ID!
    phoneId: ID!
    riskGroupId: ID!
    checkoutStep: CheckoutStep!
  }

  type CreateUserLoanResult {
    success: Boolean!
    userLoan: UserLoan
    errors: [String!]!
  }

  extend type Query {
    userLoan(id: ID!): UserLoan
    userLoans(userId: ID!): [UserLoan!]!
  }

  extend type Mutation {
    createUserLoan(input: CreateUserLoanInput!): CreateUserLoanResult!
    updateUserLoanCheckoutStep(id: ID!, checkoutStep: CheckoutStep!): UserLoan
  }
`;

