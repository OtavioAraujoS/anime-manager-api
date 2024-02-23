import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://otavio:MyPassword@cluster0.gv39ixp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
