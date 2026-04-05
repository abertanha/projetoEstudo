import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum assetStatus {
  available = 'disponivel',
  inUse = 'em_uso',
  maintenance = 'manutencao',
  discarded = 'discarded',
}

@Entity({ name: 'asset' })
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  nome!: string;

  @Column()
  modelo!: string;

  @Column()
  marca!: string;

  @Column({ unique: true })
  numeroDeSerie!: string;

  @Column()
  dataAquisicao!: Date;

  @Column({ default: assetStatus.available })
  status!: assetStatus;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
