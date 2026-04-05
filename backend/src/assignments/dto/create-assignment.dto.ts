import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAssignmentDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsUUID()
  assetId!: string;

  @IsUUID()
  employeeId!: string;

  @IsDate()
  dataDeSaida!: Date;

  @IsDate()
  dataRetornoPrevista!: Date;

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
