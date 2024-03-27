import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Anime, AnimeDocument } from './schemas/anime.schema';
import { Model } from 'mongoose';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { AnimeDto } from './dto/animes.dto';
import { LogLevel, logMessage } from 'src/utils/logMessage';
import { ConflictResponse } from 'src/interfaces/response';

@Injectable()
export class AnimeService {
  constructor(
    @InjectModel(Anime.name) private animeModel: Model<AnimeDocument>
  ) {}

  async findAll(): Promise<Anime[] | ConflictResponse> {
    try {
      const animes = await this.animeModel.find().exec();

      logMessage('Animes encontrados com sucesso!', LogLevel.INFO);
      return animes;
    } catch (err) {
      logMessage(err.message, LogLevel.ERROR);

      const response: ConflictResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: err.message,
      };

      return response;
    }
  }

  async create(createAnimeDto: CreateAnimeDto): Promise<AnimeDto> {
    const requiredFields = [
      'userId',
      'title',
      'photo',
      'episodesWatched',
      'progress',
      'dayOfWeek',
      'season',
      'lastDayWatched',
    ];
    const missingFields = requiredFields.filter(
      (field) => !createAnimeDto.hasOwnProperty(field)
    );

    if (missingFields.length > 0) {
      const errorMessage = `Campos obrigatórios faltando: ${missingFields.join(', ')}`;
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    const anime = new this.animeModel(createAnimeDto);
    const savedAnime = await anime.save();
    return savedAnime.toObject();
  }
}
