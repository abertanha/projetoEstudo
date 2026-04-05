import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from "@nestjs/common";
import { AssignmentsService } from "./assignments.service";
import {
  CreateAssignmentDto,
  FindAllParametersAssignments,
} from "./dto/create-assignment.dto";
import { UpdateAssignmentDto } from "./dto/update-assignment.dto";

@Controller("assignments")
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  create(
    @Body() createAssignmentDto: CreateAssignmentDto,
  ): Promise<CreateAssignmentDto> {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  findAll(
    @Query() params: FindAllParametersAssignments,
  ): Promise<CreateAssignmentDto[]> {
    return this.assignmentsService.findAll(params);
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<CreateAssignmentDto> {
    return this.assignmentsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<CreateAssignmentDto> {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Patch("finish/:id")
  finishAssignment(@Param("id") id: string): Promise<CreateAssignmentDto> {
    return this.assignmentsService.finishAssignment(id);
  }
}
