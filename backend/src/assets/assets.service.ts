import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  CreateAssetDto,
  FindAllParametersAssets,
} from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset, assetStatus } from './entities/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly asset: Repository<Asset>,
  ) {}
  async create(createAssetDto: CreateAssetDto) {
    const assetAlreadyRegistered = await this.asset.findOneBy({
      numeroDeSerie: createAssetDto.numeroDeSerie,
    });

    if (assetAlreadyRegistered) {
      throw new ConflictException(
        `Serial number: ${createAssetDto.numeroDeSerie} already registered`,
      );
    }
    const dbAsset = this.asset.create(createAssetDto);

    const savedAsset = await this.asset.save(dbAsset);

    return this.mapEntityToDto(savedAsset);
  }

  async findAll(params: FindAllParametersAssets): Promise<CreateAssetDto[]> {
    const searchParams: FindOptionsWhere<Asset> = {};

    if (params.nome) {
      searchParams.nome = Like(`%${params.nome}%`);
    }
    if (params.modelo) {
      searchParams.modelo = Like(`%${params.modelo}%`);
    }
    if (params.marca) {
      searchParams.marca = Like(`%${params.marca}%`);
    }

    const assetsFound = await this.asset.find({
      where: searchParams,
    });

    if (assetsFound.length === 0) {
      throw new HttpException(
        `No users found with filters: ${JSON.stringify(params)}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return assetsFound.map((Asset) => this.mapEntityToDto(Asset));
  }

  async findOne(id: string): Promise<CreateAssetDto> {
    const assetFound = await this.asset.findOneBy({
      id: id,
    });

    if (!assetFound) {
      throw new HttpException(
        `Asset with the id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.mapEntityToDto(assetFound);
  }

  async update(
    id: string,
    updateAssetDto: UpdateAssetDto,
  ): Promise<CreateAssetDto> {
    await this.findOne(id);
    await this.asset.update(id, updateAssetDto);

    return this.findOne(id);
  }

  async discard(id: string): Promise<CreateAssetDto> {
    return await this.update(id, { status: assetStatus.discarded });
  }

  private mapEntityToDto(asset: Asset): CreateAssetDto {
    return plainToInstance(CreateAssetDto, asset);
  }
}
