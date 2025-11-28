import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { RemarksModule } from './remarks/remarks.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    AuthModule,
    CarsModule,
    RemarksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
