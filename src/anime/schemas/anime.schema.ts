import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Anime {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  photo: string;

  @Prop({ required: true })
  episodesWatched: number;

  @Prop({ required: true })
  progress: string;

  @Prop({ required: true })
  dayOfWeek: string;

  @Prop({ required: true })
  season: string;

  @Prop({ required: true })
  lastDayWatched: string;
}

export type AnimeDocument = Anime & Document;

export const AnimeSchema = SchemaFactory.createForClass(Anime);
