import { Controller, Get, Post, Body } from '@nestjs/common';
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

  @Post()
  async create(@Body() createAnimeDto: CreateAnimeDto): Promise<AnimeDto> {
    return this.animeService.create(createAnimeDto);
  }
}
