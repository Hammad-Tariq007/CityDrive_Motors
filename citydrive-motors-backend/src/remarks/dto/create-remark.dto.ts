import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRemarkDto {
  @ApiProperty({
    example: 'Amazing car, very smooth drive!',
    description: 'Remark content',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 5, description: 'Rating from 1 to 5' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
