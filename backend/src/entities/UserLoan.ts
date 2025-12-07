import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Phone } from './Phone';
import { RiskGroup } from './RiskGroup';

export enum CheckoutStep {
  PENDING = 'pending',
  REVIEW = 'review',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

@Entity('user_loans')
export class UserLoan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @OneToOne(() => User, (user: User) => user.loan)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column('uuid')
  phoneId!: string;

  @ManyToOne(() => Phone)
  @JoinColumn({ name: 'phoneId' })
  phone!: Phone;

  @Column('uuid')
  riskGroupId!: string;

  @ManyToOne(() => RiskGroup, (riskGroup: RiskGroup) => riskGroup.userLoans)
  @JoinColumn({ name: 'riskGroupId' })
  riskGroup!: RiskGroup;

  @Column('decimal', { precision: 10, scale: 2 })
  deposit!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  loanPrincipal!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  loanAmount!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  dailyPayment!: number;

  @Column({
    type: 'enum',
    enum: CheckoutStep,
    default: CheckoutStep.PENDING,
  })
  checkoutStep!: CheckoutStep;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

