import { AppDataSource } from '../../data-source';
import { User } from '../../entities/User';
import { RiskGroup } from '../../entities/RiskGroup';
import { Phone } from '../../entities/Phone';
import { ValidationService } from '../../services/validation.service';
import { LoanCalculationService } from '../../services/loan-calculation.service';
import { calculateAge } from '../../utils/sa-id-validator';

export const userResolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }) => {
      return await AppDataSource.getRepository(User).findOne({
        where: { id },
        relations: ['riskGroup', 'selectedPhone', 'loan'],
      });
    },

    users: async () => {
      return await AppDataSource.getRepository(User).find({
        relations: ['riskGroup', 'selectedPhone', 'loan'],
        order: { createdAt: 'DESC' },
      });
    },
  },

  Mutation: {
    createUser: async (_: any, { input }: { input: any }) => {
      const errors: string[] = [];

      try {
        // Parse birthday
        const birthday = new Date(input.birthday);

        // Validate biographical information
        const bioValidation = await ValidationService.validateBiographical(
          input.firstName,
          input.lastName,
          input.idNumber,
          birthday
        );

        if (!bioValidation.isValid) {
          errors.push(...bioValidation.errors);
        }

        // Validate income only if provided
        if (input.monthlyIncome !== null && input.monthlyIncome !== undefined) {
          const incomeValidation = ValidationService.validateIncome(input.monthlyIncome);
          if (!incomeValidation.isValid) {
            errors.push(...incomeValidation.errors);
          }
        }

        if (errors.length > 0) {
          return {
            success: false,
            user: null,
            errors,
          };
        }

        // Calculate risk group based on age
        const age = calculateAge(birthday);
        const riskGroupNumber = LoanCalculationService.getRiskGroupNumber(age);

        // Get risk group
        const riskGroupRepo = AppDataSource.getRepository(RiskGroup);
        const riskGroup = await riskGroupRepo.findOne({
          where: { groupNumber: riskGroupNumber },
        });

        if (!riskGroup) {
          return {
            success: false,
            user: null,
            errors: ['Risk group not found'],
          };
        }

        // Check if user already exists
        const userRepo = AppDataSource.getRepository(User);
        let user = await userRepo.findOne({
          where: { idNumber: input.idNumber.trim() },
        });

        if (user) {
          // Update existing user
          user.firstName = input.firstName.trim();
          user.lastName = input.lastName.trim();
          user.birthday = birthday;
          user.riskGroupId = riskGroup.id;
          if (input.monthlyIncome !== null && input.monthlyIncome !== undefined) {
            user.monthlyIncome = input.monthlyIncome;
          }
          await userRepo.save(user);
        } else {
          // Create new user
          user = userRepo.create({
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            idNumber: input.idNumber.trim(),
            birthday,
            monthlyIncome: input.monthlyIncome || null,
            riskGroupId: riskGroup.id,
          });
          await userRepo.save(user);
        }

        // Load with relations
        const userWithRelations = await userRepo.findOne({
          where: { id: user.id },
          relations: ['riskGroup', 'selectedPhone'],
        });

        return {
          success: true,
          user: userWithRelations,
          errors: [],
        };
      } catch (error: any) {
        return {
          success: false,
          user: null,
          errors: [error.message || 'An error occurred while creating the user'],
        };
      }
    },

    updateUser: async (_: any, { id, input }: { id: string; input: any }) => {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id } });

      if (!user) {
        throw new Error('User not found');
      }

      if (input.firstName !== undefined) user.firstName = input.firstName.trim();
      if (input.lastName !== undefined) user.lastName = input.lastName.trim();
      if (input.monthlyIncome !== undefined) user.monthlyIncome = input.monthlyIncome;
      if (input.riskGroupId !== undefined) user.riskGroupId = input.riskGroupId;
      if (input.selectedPhoneId !== undefined) user.selectedPhoneId = input.selectedPhoneId;

      await userRepo.save(user);

      return await userRepo.findOne({
        where: { id },
        relations: ['riskGroup', 'selectedPhone'],
      });
    },
  },
};

