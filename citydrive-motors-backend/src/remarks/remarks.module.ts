import { Module } from '@nestjs/common';
import { RemarksService } from './remarks.service';
import { RemarksController } from './remarks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Remark } from '../database/entities/remark.entity';
import { Car } from '../database/entities/car.entity'; // ← ADD THIS

@Module({
  imports: [
    TypeOrmModule.forFeature([Remark, Car]), // ← ADD Car here!
  ],
  controllers: [RemarksController],
  providers: [RemarksService],
})
export class RemarksModule {}
