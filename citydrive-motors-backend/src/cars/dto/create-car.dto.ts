import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({ example: 'Mercedes-Benz C200', description: 'Car title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Mercedes-Benz', description: 'Car brand' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'C200', description: 'Car model' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2025, description: 'Manufacturing year' })
  @Type(() => Number)
  @IsNumber()
  year: number;

  @ApiProperty({ example: 120000, description: 'Car price in USD' })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({ example: 15000, description: 'Car mileage in km' })
  @Type(() => Number)
  @IsNumber()
  mileage: number;

  @ApiPropertyOptional({
    example: 'Top condition, very smooth drive',
    description: 'Optional description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['/uploads/uuid1.jpg', '/uploads/uuid2.jpg'],
    description: 'Car images URLs',
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ example: false, description: 'Is the car sold?' })
  @IsOptional()
  @IsBoolean()
  isSold?: boolean;
}
