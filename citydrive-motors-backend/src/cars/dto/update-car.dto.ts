import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCarDto extends PartialType(CreateCarDto) {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  brand?: string;

  @ApiPropertyOptional()
  model?: string;

  @ApiPropertyOptional()
  year?: number;

  @ApiPropertyOptional()
  price?: number;

  @ApiPropertyOptional()
  mileage?: number;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  images?: string[];

  @ApiPropertyOptional()
  isSold?: boolean;
}
