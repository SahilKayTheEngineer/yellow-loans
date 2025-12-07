import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { UserLoan } from './UserLoan';

@Entity('risk_groups')
export class RiskGroup {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('int', { unique: true })
  groupNumber!: number; // 1, 2, or 3

  @Column('varchar')
  name!: string; // e.g., "Low Risk", "Medium Risk", "High Risk"

  @Column('decimal', { precision: 5, scale: 4 })
  depositPercent!: number;

  @Column('decimal', { precision: 5, scale: 4 })
  interestRate!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;


  @OneToMany(() => UserLoan, (userLoan: UserLoan) => userLoan.riskGroup)
  userLoans!: UserLoan[];
}

