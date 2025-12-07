import { baseSchema } from './schema/base.schema';
import { userSchema } from './schema/user.schema';
import { phoneSchema } from './schema/phone.schema';
import { riskGroupSchema } from './schema/risk-group.schema';
import { userLoanSchema } from './schema/user-loan.schema';

export const typeDefs = [baseSchema, userSchema, phoneSchema, riskGroupSchema, userLoanSchema];

