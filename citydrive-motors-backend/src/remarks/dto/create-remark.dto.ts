import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateRemarkDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
