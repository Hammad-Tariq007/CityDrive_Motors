import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { CarsService } from '../../cars/cars.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private carsService: CarsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;
    const carId = request.params.id;

    if (!userId || !carId) {
      throw new ForbiddenException('Invalid request');
    }

    const car = await this.carsService.findOne(carId);

    if (car.owner?.id !== userId) {
      throw new ForbiddenException('You can only modify your own cars');
    }

    request.car = car;

    return true;
  }
}
