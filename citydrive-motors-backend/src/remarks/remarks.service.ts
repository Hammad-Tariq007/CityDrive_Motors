import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Remark } from '../database/entities/remark.entity';
import { CreateRemarkDto } from './dto/create-remark.dto';
import { Car } from '../database/entities/car.entity';

@Injectable()
export class RemarksService {
  constructor(
    @InjectRepository(Remark)
    private remarksRepository: Repository<Remark>,
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
  ) {}

  async create(carId: string, dto: CreateRemarkDto, userId: string) {
    const car = await this.carsRepository.findOne({ where: { id: carId } });
    if (!car) throw new NotFoundException('Car not found');

    const remark = this.remarksRepository.create({
      ...dto,
      car, // ← car relation
      user: { id: userId }, // ← user relation (not author)
    });

    return this.remarksRepository.save(remark);
  }

  async findByCar(carId: string) {
    return this.remarksRepository.find({
      where: { car: { id: carId } },
      relations: ['user'], // ← load user
      order: { createdAt: 'DESC' },
    });
  }
}
