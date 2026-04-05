import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreateAssignmentDto,
  FindAllParametersAssignments,
} from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AssetsService } from 'src/assets/assets.service';
import { EmployeesService } from 'src/employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { Asset, assetStatus } from 'src/assets/entities/asset.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignment: Repository<Assignment>,
    private readonly assetService: AssetsService,
    private readonly employeeService: EmployeesService,
    private dataSouce: DataSource,
  ) {}
  async create(
    createAssignmentDto: CreateAssignmentDto,
  ): Promise<CreateAssignmentDto> {
    const assetFound = await this.assetService.findOne(
      createAssignmentDto.assetId,
    );
    if (assetFound.status !== assetStatus.available) {
      throw new HttpException(
        `Asset ${assetFound.nome} unavailable!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const foundEmployee = await this.employeeService.findOne(
      createAssignmentDto.employeeId,
    );
    if (!foundEmployee.isActive) {
      throw new HttpException(
        `Employee ${foundEmployee.nome} is off!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const queryRunner = this.dataSouce.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(Asset, createAssignmentDto.assetId, {
        status: assetStatus.inUse,
      });

      const newAssignment = queryRunner.manager.create(Assignment, {
        ...createAssignmentDto,
        asset: assetFound,
        employee: foundEmployee,
      });

      const savedAssignment = await this.assignment.save(newAssignment);
      await queryRunner.commitTransaction();
      return this.mapEntityToDto(savedAssignment);
    } catch (err: unknown) {
      await queryRunner.rollbackTransaction();
      Logger.error(
        { data: err instanceof Error ? err.message : err },
        `[ASSIGNMENT SERVICE] Error creating an assignment.`,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    params: FindAllParametersAssignments,
  ): Promise<CreateAssignmentDto[]> {
    const searchParams: FindOptionsWhere<Assignment> = {};

    if (params.assetId) {
      searchParams.asset = { id: params.assetId };
    }
    if (params.employeeId) {
      searchParams.employee = { id: params.employeeId };
    }
    if (params.dataDeSaida) {
      searchParams.dataDeSaida = new Date(params.dataDeSaida);
    }
    if (params.dataRetornoPrevista) {
      searchParams.dataRetornoPrevista = new Date(params.dataRetornoPrevista);
    }
    if (params.dataRetornoReal) {
      searchParams.dataRetornoReal = new Date(params.dataRetornoReal);
    }

    const assignmentFound = await this.assignment.find({
      where: searchParams,
    });

    if (assignmentFound.length === 0) {
      throw new HttpException(
        `No assignments found with filters: ${JSON.stringify(params)}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return assignmentFound.map((assignment) => this.mapEntityToDto(assignment));
  }

  async findOne(id: string): Promise<CreateAssignmentDto> {
    const assignmentFound = await this.assignment.findOneBy({ id: id });
    if (!assignmentFound) {
      throw new HttpException(
        `Assignment with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.mapEntityToDto(assignmentFound);
  }

  async update(
    id: string,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<CreateAssignmentDto> {
    await this.findOne(id);
    await this.assignment.update(id, updateAssignmentDto);

    return this.findOne(id);
  }

  async finishAssignment(id: string): Promise<CreateAssignmentDto> {
    return await this.update(id, { dataRetornoReal: new Date() });
  }

  private mapEntityToDto(assignment: Assignment): CreateAssignmentDto {
    return plainToInstance(CreateAssignmentDto, assignment);
  }
}
