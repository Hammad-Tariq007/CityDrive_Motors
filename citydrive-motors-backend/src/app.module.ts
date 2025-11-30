import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { RemarksModule } from './remarks/remarks.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    AuthModule,
    CarsModule,
    RemarksModule,
    HealthModule,
  ],
})
export class AppModule {}
