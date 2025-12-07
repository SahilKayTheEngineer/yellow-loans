import { AppDataSource } from '../../data-source';
import { UserLoan, CheckoutStep } from '../../entities/UserLoan';
import { User } from '../../entities/User';
import { Phone } from '../../entities/Phone';
import { RiskGroup } from '../../entities/RiskGroup';
import { LoanCalculationService } from '../../services/loan-calculation.service';

// Helper to convert enum value to GraphQL enum key
function checkoutStepToGraphQL(value: CheckoutStep): string {
  const mapping: Record<string, string> = {
    'pending': 'PENDING',
    'review': 'REVIEW',
    'completed': 'COMPLETED',
    'rejected': 'REJECTED',
  };
  return mapping[value] || 'PENDING';
}

// Helper to convert GraphQL enum key to enum value
function graphQLToCheckoutStep(value: string): CheckoutStep {
  const mapping: Record<string, CheckoutStep> = {
    'PENDING': CheckoutStep.PENDING,
    'REVIEW': CheckoutStep.REVIEW,
    'COMPLETED': CheckoutStep.COMPLETED,
    'REJECTED': CheckoutStep.REJECTED,
  };
  return mapping[value] || CheckoutStep.PENDING;
}

export const userLoanResolvers = {
  Query: {
    userLoan: async (_: any, { id }: { id: string }) => {
      const userLoan = await AppDataSource.getRepository(UserLoan).findOne({
        where: { id },
        relations: ['user', 'phone', 'riskGroup'],
      });
      if (!userLoan) return null;
      // Convert enum value to GraphQL enum key
      return {
        ...userLoan,
        checkoutStep: checkoutStepToGraphQL(userLoan.checkoutStep),
      };
    },

    userLoans: async (_: any, { userId }: { userId: string }) => {
      // With OneToOne, a user can only have one loan
      const userLoan = await AppDataSource.getRepository(UserLoan).findOne({
        where: { userId },
        relations: ['phone', 'riskGroup'],
        order: { createdAt: 'DESC' },
      });
      if (!userLoan) return [];
      // Convert enum value to GraphQL enum key
      return [{
        ...userLoan,
        checkoutStep: checkoutStepToGraphQL(userLoan.checkoutStep),
      }];
    },
  },

  Mutation: {
    createUserLoan: async (_: any, { input }: { input: any }) => {
      const errors: string[] = [];

      try {
        // Get user, phone, and risk group
        const userRepo = AppDataSource.getRepository(User);
        const phoneRepo = AppDataSource.getRepository(Phone);
        const riskGroupRepo = AppDataSource.getRepository(RiskGroup);

        const user = await userRepo.findOne({ where: { id: input.userId } });
        const phone = await phoneRepo.findOne({ where: { id: input.phoneId } });
        const riskGroup = await riskGroupRepo.findOne({ where: { id: input.riskGroupId } });

        if (!user) errors.push('User not found');
        if (!phone) errors.push('Phone not found');
        if (!riskGroup) errors.push('Risk group not found');

        if (!user || !phone || !riskGroup) {
          return {
            success: false,
            userLoan: null,
            errors: errors,
          };
        }

        // Calculate loan
        const calculation = LoanCalculationService.calculateLoan(phone.cashPrice, riskGroup);

        // Check affordability
        if (user.monthlyIncome) {

          // want to use this as a BE validation rule before showing phones but using this for the loan calculation service as front end filtering is faster in the time constraint
          const canAfford = LoanCalculationService.canAfford(
            user.monthlyIncome,
            calculation.dailyPayment
          );
          if (!canAfford) {
            errors.push('Monthly income must be at least 10x the monthly payment amount');
          }
        }

        if (errors.length > 0) {
          return {
            success: false,
            userLoan: null,
            errors,
          };
        }

        // Create user loan
        const userLoanRepo = AppDataSource.getRepository(UserLoan);
        const userLoan = userLoanRepo.create({
          userId: user.id,
          phoneId: phone.id,
          riskGroupId: riskGroup.id,
          deposit: calculation.depositAmount,
          loanPrincipal: calculation.loanPrincipal,
          loanAmount: calculation.loanAmount,
          dailyPayment: calculation.dailyPayment,
          checkoutStep: input.checkoutStep ? graphQLToCheckoutStep(input.checkoutStep) : CheckoutStep.PENDING,
        });

        await userLoanRepo.save(userLoan);

        // Update user's loanId reference
        user.loanId = userLoan.id;
        await userRepo.save(user);

        // Load with relations
        const userLoanWithRelations = await userLoanRepo.findOne({
          where: { id: userLoan.id },
          relations: ['user', 'phone', 'riskGroup'],
        });

        if (!userLoanWithRelations) {
          return {
            success: false,
            userLoan: null,
            errors: ['Failed to load created user loan'],
          };
        }

        return {
          success: true,
          userLoan: {
            ...userLoanWithRelations,
            checkoutStep: checkoutStepToGraphQL(userLoanWithRelations.checkoutStep),
          },
          errors: [],
        };
      } catch (error: any) {
        return {
          success: false,
          userLoan: null,
          errors: [error.message || 'An error occurred while creating the user loan'],
        };
      }
    },

    updateUserLoanCheckoutStep: async (_: any, { id, checkoutStep }: { id: string; checkoutStep: string }) => {
      const userLoanRepo = AppDataSource.getRepository(UserLoan);
      const userLoan = await userLoanRepo.findOne({ where: { id } });

      if (!userLoan) {
        throw new Error('User loan not found');
      }

      // Convert GraphQL enum key to enum value
      userLoan.checkoutStep = graphQLToCheckoutStep(checkoutStep);
      await userLoanRepo.save(userLoan);

      const updated = await userLoanRepo.findOne({
        where: { id },
        relations: ['user', 'phone', 'riskGroup'],
      });

      if (!updated) {
        throw new Error('Failed to load updated user loan');
      }

      return {
        ...updated,
        checkoutStep: checkoutStepToGraphQL(updated.checkoutStep),
      };
    },
  },
};

