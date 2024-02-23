import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://otavio:MyPassword@cluster0.gv39ixp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    ),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
