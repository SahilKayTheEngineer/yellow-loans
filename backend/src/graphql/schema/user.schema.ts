import { gql } from 'graphql-tag';

export const userSchema = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    idNumber: String!
    birthday: String!
    monthlyIncome: Float
    riskGroup: RiskGroup
    selectedPhone: Phone
    createdAt: String!
    updatedAt: String!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    monthlyIncome: Float
    riskGroupId: ID
    selectedPhoneId: ID
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    idNumber: String!
    birthday: String!
    monthlyIncome: Float
  }

  type CreateUserResult {
    success: Boolean!
    user: User
    errors: [String!]!
  }

  extend type Query {
    user(id: ID!): User
    users: [User!]!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): CreateUserResult!
    updateUser(id: ID!, input: UpdateUserInput!): User
  }
`;

