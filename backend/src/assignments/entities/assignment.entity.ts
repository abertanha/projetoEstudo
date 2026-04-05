import { Asset } from 'src/assets/entities/asset.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'assignment' })
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => Asset, { eager: true })
  @JoinColumn({ name: 'asset_id' })
  asset!: Asset;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column()
  dataDeSaida!: Date;

  @Column()
  dataRetornoPrevista!: Date;

  @Column()
  dataRetornoReal?: Date;

  @Column()
  observacoes?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
