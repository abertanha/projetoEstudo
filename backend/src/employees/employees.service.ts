import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  CreateEmployeeDto,
  FindAllParametersEmployees,
} from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employee: Repository<Employee>,
  ) {}
  async create(createEmployeeDto: CreateEmployeeDto) {
    const employeeAlreadyRegistered = await this.employee.findOneBy({
      cpf: createEmployeeDto.cpf,
    });

    if (employeeAlreadyRegistered) {
      throw new ConflictException(
        `Employee with cpf: ${createEmployeeDto.cpf} already registered`,
      );
    }
    const dbEmployee = this.employee.create(createEmployeeDto);

    const savedEmployee = await this.employee.save(dbEmployee);

    return this.mapEntityToDto(savedEmployee);
  }

  async findAll(
    params: FindAllParametersEmployees,
  ): Promise<CreateEmployeeDto[]> {
    const searchParams: FindOptionsWhere<Employee> = {};

    if (params.nome) {
      searchParams.nome = Like(`%${params.nome}%`);
    }
    if (params.email) {
      searchParams.email = Like(`%${params.email}%`);
    }
    if (params.departament) {
      searchParams.departament = Like(`%${params.departament}%`);
    }
    if (params.cpf) {
      searchParams.cpf = Like(`%${params.cpf}%`);
    }

    const employeeFound = await this.employee.find({
      where: searchParams,
    });

    if (employeeFound.length === 0) {
      throw new HttpException(
        `No employees found with filters: ${JSON.stringify(params)}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return employeeFound.map((Asset) => this.mapEntityToDto(Asset));
  }

  async findOne(id: string): Promise<CreateEmployeeDto> {
    const employeeFound = await this.employee.findOneBy({ id: id });
    if (!employeeFound) {
      throw new HttpException(
        `Employeed with the id: ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.mapEntityToDto(employeeFound);
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<CreateEmployeeDto> {
    await this.findOne(id);
    await this.employee.update(id, updateEmployeeDto);

    return this.findOne(id);
  }

  async toggleStatus(id: string): Promise<CreateEmployeeDto> {
    return await this.update(id, { isActive: false });
  }

  private mapEntityToDto(employee: Employee): CreateEmployeeDto {
    return plainToInstance(CreateEmployeeDto, employee);
  }
}
