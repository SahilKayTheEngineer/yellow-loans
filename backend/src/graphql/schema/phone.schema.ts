import { gql } from 'graphql-tag';

export const phoneSchema = gql`
  type Phone {
    id: ID!
    name: String!
    brand: String!
    cashPrice: Float!
    imageUrl: String
    createdAt: String!
    updatedAt: String!
  }

  type PhonePricing {
    phone: Phone!
    riskGroup: RiskGroup!
    depositAmount: Float!
    loanPrincipal: Float!
    loanAmount: Float!
    dailyPayment: Float!
    monthlyPayment: Float!
  }

  extend type Query {
    phones(monthlyIncome: Float, riskGroupId: ID): [Phone!]!
    phone(id: ID!): Phone
    phonePricing(phoneId: ID!, riskGroupId: ID!): PhonePricing
  }
`;

