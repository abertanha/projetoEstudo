import {
  IsDate,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";
import { assetStatus } from "../entities/asset.entity";
import { Type } from "class-transformer";

export class CreateAssetDto {
  @IsOptional()
  id?: string;

  @IsString()
  nome!: string;

  @IsString()
  modelo!: string;

  @IsString()
  marca!: string;

  @IsNumberString()
  numeroDeSerie!: string;

  @Type(() => Date)
  @IsDate({ message: "dataAquisicao deve ser uma instância de Date" })
  dataAquisicao!: Date;

  @IsEnum(assetStatus)
  status!: assetStatus;
}

export interface FindAllParametersAssets {
  nome?: string;
  modelo?: string;
  marca?: string;
  dataAquisicao?: string;
  status?: assetStatus;
}
