import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import {
  CreateAssetDto,
  FindAllParametersAssets,
} from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  create(@Body() createAssetDto: CreateAssetDto): Promise<CreateAssetDto> {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  findAll(@Query() params: FindAllParametersAssets): Promise<CreateAssetDto[]> {
    return this.assetsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CreateAssetDto> {
    return this.assetsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.update(id, updateAssetDto);
  }

  @Patch('discard/:id')
  discard(@Param('id') id: string) {
    return this.assetsService.discard(id);
  }
}
