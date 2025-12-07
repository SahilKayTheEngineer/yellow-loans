import { phoneResolvers } from './phone.resolver';
import { userResolvers } from './user.resolver';
import { riskGroupResolvers } from './risk-group.resolver';
import { userLoanResolvers } from './user-loan.resolver';

export const resolvers = {
  Query: {
    ...phoneResolvers.Query,
    ...userResolvers.Query,
    ...riskGroupResolvers.Query,
    ...userLoanResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...userLoanResolvers.Mutation,
  },
};

