import { AppDataSource } from '../../data-source';
import { RiskGroup } from '../../entities/RiskGroup';

export const riskGroupResolvers = {
  Query: {
    riskGroups: async () => {
      return await AppDataSource.getRepository(RiskGroup).find({
        order: { groupNumber: 'ASC' },
      });
    },

    riskGroup: async (_: any, { id }: { id: string }) => {
      return await AppDataSource.getRepository(RiskGroup).findOne({
        where: { id },
      });
    },
  },
};

