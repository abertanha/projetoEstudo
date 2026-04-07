import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAssignmentDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsUUID()
  assetId!: string;

  @IsUUID()
  employeeId!: string;

  @Type(() => Date)
  @IsDate()
  dataDeSaida!: Date;

  @Type(() => Date)
  @IsDate()
  dataRetornoPrevista!: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dataRetornoReal?: Date;

  @IsString()
  observacoes?: string;
}

export interface FindAllParametersAssignments {
  assetId?: string;
  employeeId?: string;
  dataDeSaida?: Date;
  dataRetornoPrevista?: Date;
  dataRetornoReal?: Date;
}
