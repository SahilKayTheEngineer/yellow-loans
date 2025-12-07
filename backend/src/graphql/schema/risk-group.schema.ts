import { gql } from 'graphql-tag';

export const riskGroupSchema = gql`
  type RiskGroup {
    id: ID!
    groupNumber: Int!
    name: String!
    depositPercent: Float!
    interestRate: Float!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    riskGroups: [RiskGroup!]!
    riskGroup(id: ID!): RiskGroup
  }
`;

