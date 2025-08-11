import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AnimeModule } from './anime/anime.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@cluster0.gv39ixp.mongodb.net/`
    ),
    UserModule,
    AnimeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
