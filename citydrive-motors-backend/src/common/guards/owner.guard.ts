import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;
    const car = request.car; // we will set this in the service

    if (!userId || !car) {
      throw new ForbiddenException('Invalid request');
    }

    if (car.ownerId !== userId) {
      throw new ForbiddenException('You can only modify your own cars');
    }

    return true;
  }
}
