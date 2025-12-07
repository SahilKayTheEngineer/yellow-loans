import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserLoan } from './UserLoan';

@Entity('phones')
export class Phone {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  brand!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  cashPrice!: number;

  @Column('varchar', { nullable: true })
  imageUrl!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => UserLoan, (userLoan: UserLoan) => userLoan.phone)
  userLoans!: UserLoan[];
}

