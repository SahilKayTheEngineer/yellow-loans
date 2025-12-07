import { AppDataSource } from '../../data-source';
import { Phone } from '../../entities/Phone';
import { RiskGroup } from '../../entities/RiskGroup';
import { LoanCalculationService } from '../../services/loan-calculation.service';

export const phoneResolvers = {
  Query: {
    phones: async (_: any, { monthlyIncome, riskGroupId }: { monthlyIncome?: number; riskGroupId?: string }) => {
      const phones = await AppDataSource.getRepository(Phone).find({
        order: { cashPrice: 'ASC' },
      });

      // If monthlyIncome and riskGroupId are provided, filter by affordability
      if (monthlyIncome && riskGroupId) {
        const riskGroupRepo = AppDataSource.getRepository(RiskGroup);
        const riskGroup = await riskGroupRepo.findOne({
          where: { id: riskGroupId },
        });

        if (riskGroup) {
          const affordablePhones = phones.filter((phone) => {
            const calculation = LoanCalculationService.calculateLoan(phone.cashPrice, riskGroup);
            const monthlyPayment = calculation.dailyPayment * 30;
            return monthlyIncome > monthlyPayment * 10;
          });

          return affordablePhones;
        }
      }

      return phones;
    },

    phone: async (_: any, { id }: { id: string }) => {
      return await AppDataSource.getRepository(Phone).findOne({
        where: { id },
      });
    },

    phonePricing: async (
      _: any,
      { phoneId, riskGroupId }: { phoneId: string; riskGroupId: string }
    ) => {
      const phone = await AppDataSource.getRepository(Phone).findOne({
        where: { id: phoneId },
      });

      if (!phone) {
        throw new Error('Phone not found');
      }

      const riskGroup = await AppDataSource.getRepository(RiskGroup).findOne({
        where: { id: riskGroupId },
      });

      if (!riskGroup) {
        throw new Error('Risk group not found');
      }

      const calculation = LoanCalculationService.calculateLoan(phone.cashPrice, riskGroup);

      return {
        phone,
        riskGroup,
        depositAmount: calculation.depositAmount,
        loanPrincipal: calculation.loanPrincipal,
        loanAmount: calculation.loanAmount,
        dailyPayment: calculation.dailyPayment,
        monthlyPayment: calculation.dailyPayment * 30,
      };
    },
  },
};

