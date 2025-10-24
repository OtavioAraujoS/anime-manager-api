import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AnimeModule } from './anime/anime.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@cluster0.gv39ixp.mongodb.net/meubanco?retryWrites=true&w=majority`,
        connectionFactory: (connection) => {
          connection.on('error', (err) =>
            console.error('Mongoose connection error:', err)
          );
          return connection;
        },
      }),
    }),
    UserModule,
    AnimeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
