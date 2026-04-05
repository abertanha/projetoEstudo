import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import {
  CreateEmployeeDto,
  FindAllParametersEmployees,
} from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<CreateEmployeeDto> {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll(
    @Query() params: FindAllParametersEmployees,
  ): Promise<CreateEmployeeDto[]> {
    return this.employeesService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CreateEmployeeDto> {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<CreateEmployeeDto> {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Patch('demote/:id')
  remove(@Param('id') id: string) {
    return this.employeesService.toggleStatus(id);
  }
}
