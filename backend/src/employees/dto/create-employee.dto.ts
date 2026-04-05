import {
  IsBoolean,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { IsCPF } from "class-validator-cpf";

export class CreateEmployeeDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  nome!: string;

  @IsString()
  @IsEmail()
  email!: string;

  @IsNumberString()
  @IsCPF()
  cpf!: string;

  @IsString()
  departament!: string;

  @IsBoolean()
  isActive!: boolean;
}

export interface FindAllParametersEmployees {
  nome?: string;
  email?: string;
  cpf?: string;
  departament?: string;
}
