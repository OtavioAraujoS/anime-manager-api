import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AnimeDto } from './dto/animes.dto';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { AnimeService } from './anime.service';
import { ConflictResponse } from 'src/interfaces/response';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Get()
  async findAll(): Promise<AnimeDto[] | ConflictResponse> {
    return this.animeService.findAll();
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
}
