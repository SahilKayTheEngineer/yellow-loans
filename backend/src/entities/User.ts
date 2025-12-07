import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RiskGroup } from './RiskGroup';
import { Phone } from './Phone';
import { UserLoan } from './UserLoan';

@Entity('users')
@Index(['idNumber'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  firstName!: string;

  @Column('varchar')
  lastName!: string;

  @Column('varchar', { unique: true })
  idNumber!: string;

  @Column('timestamp')
  birthday!: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  monthlyIncome!: number | null;

  @Column('uuid', { nullable: true })
  riskGroupId!: string | null;

  @OneToOne(() => RiskGroup)
  @JoinColumn({ name: 'riskGroupId' })
  riskGroup!: RiskGroup | null;

  @Column('uuid', { nullable: true })
  selectedPhoneId!: string | null;

  @OneToOne(() => Phone)
  @JoinColumn({ name: 'selectedPhoneId' })
  selectedPhone!: Phone | null;

  @Column('uuid', { nullable: true })
  loanId!: string | null;

  @OneToOne(() => UserLoan, (userLoan: UserLoan) => userLoan.user)
  @JoinColumn({ name: 'loanId' })
  loan!: UserLoan | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

