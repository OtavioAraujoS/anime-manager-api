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

  async findById(id: string): Promise<Anime | ConflictResponse> {
    try {
      const anime = await this.animeModel.findById(id).exec();

      if (!anime) {
        const notFoundResponse: ConflictResponse = {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Anime não encontrado',
        };
        return notFoundResponse;
      }

      logMessage('Anime encontrado com sucesso!', LogLevel.INFO);
      return anime;
    } catch (err) {
      logMessage(err.message, LogLevel.ERROR);

      const response: ConflictResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: err.message,
      };

      return response;
    }
  }

  async create(
    createAnimeDto: CreateAnimeDto
  ): Promise<AnimeDto | ConflictResponse> {
    try {
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

      logMessage('Anime criado com sucesso!', LogLevel.INFO);
      return savedAnime.toObject();
    } catch (err) {
      logMessage(err.message, LogLevel.ERROR);

      const response: ConflictResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: err.message,
      };

      return response;
    }
  }

  async update(
    id: string,
    updateAnimeDto: CreateAnimeDto
  ): Promise<AnimeDto | ConflictResponse> {
    try {
      const updatedAnime = await this.animeModel
        .findByIdAndUpdate(id, updateAnimeDto, { new: true })
        .exec();

      if (!updatedAnime) {
        const response: ConflictResponse = {
          statusCode: HttpStatus.CONFLICT,
          message: 'Anime não encontrado.',
        };

        return response;
      }

      logMessage('Anime atualizado com sucesso!', LogLevel.INFO);
      return updatedAnime;
    } catch (err) {
      logMessage(err.message, LogLevel.ERROR);

      const response: ConflictResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: err.message,
      };

      return response;
    }
  }

  async delete(id: string): Promise<AnimeDto | ConflictResponse> {
    try {
      const deletedAnime = await this.animeModel.findByIdAndDelete(id).exec();

      if (!deletedAnime) {
        const response: ConflictResponse = {
          statusCode: HttpStatus.CONFLICT,
          message: 'Anime não encontrado.',
        };

        return response;
      }

      logMessage('Anime apagado com sucesso!', LogLevel.INFO);
      return deletedAnime;
    } catch (err) {
      logMessage(err.message, LogLevel.ERROR);

      const response: ConflictResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: err.message,
      };

      return response;
    }
  }
}
