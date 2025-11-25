import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../database/entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
  ) {}

  async create(dto: CreateCarDto, userId: string): Promise<Car> {
    const car = this.carsRepository.create({
      ...dto,
      owner: { id: userId } as any,
    });
    return this.carsRepository.save(car);
  }

  async findAll(): Promise<Car[]> {
    return this.carsRepository.find({ relations: ['owner'] });
  }

  async findMyCars(userId: string): Promise<Car[]> {
    return this.carsRepository.find({
      where: { owner: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async getCarOrFail(id: string): Promise<Car> {
    return this.findOne(id);
  }

  async update(id: string, dto: UpdateCarDto, userId: string): Promise<Car> {
    const car = await this.findOne(id);
    if (car.owner?.id !== userId) {
      throw new ForbiddenException('You can only edit your own cars');
    }
    Object.assign(car, dto);
    return this.carsRepository.save(car);
  }

  async remove(id: string, userId: string): Promise<void> {
    const car = await this.findOne(id);
    if (car.owner?.id !== userId) {
      throw new ForbiddenException('You can only delete your own cars');
    }
    await this.carsRepository.remove(car);
  }
}
