import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { AnimeDto } from './dto/animes.dto';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { AnimeService } from './anime.service';
import { ConflictResponse } from 'src/interfaces/response';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Get()
  async findAll(
    @Query('userId') userId?: string
  ): Promise<AnimeDto[] | ConflictResponse> {
    try {
      const animes = await this.animeService.findAll(userId);

      return animes.map((anime) => anime as AnimeDto);
    } catch (err) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: err.message,
      };
    }
  }

  @Get(':id')
  async findById(
    @Param('id') id: string
  ): Promise<AnimeDto | ConflictResponse> {
    return this.animeService.findById(id);
  }

  @Post()
  async create(
    @Body() createAnimeDto: CreateAnimeDto
  ): Promise<AnimeDto | ConflictResponse> {
    return this.animeService.create(createAnimeDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnimeDto: CreateAnimeDto
  ): Promise<AnimeDto | ConflictResponse> {
    const updatedAnime = await this.animeService.update(id, updateAnimeDto);

    return updatedAnime;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<AnimeDto | ConflictResponse> {
    const deletedAnime = await this.animeService.delete(id);

    return deletedAnime;
  }
}
