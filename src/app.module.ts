import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AnimeModule } from './anime/anime.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://otavio:12345@cluster0.gv39ixp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    ),
    UserModule,
    AnimeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
