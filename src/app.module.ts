import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AnimeModule } from './anime/anime.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UserModule,
    AnimeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
