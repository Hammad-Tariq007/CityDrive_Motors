// src/cars/cars.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AuthGuard } from '@nestjs/passport';
import { OwnerGuard } from '../common/guards/owner.guard';

// MULTER + EXPRESS IMPORTS
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { File as MulterFile } from 'multer';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  findAll() {
    return this.carsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-cars')
  findMyCars(@Request() req: any) {
    return this.carsService.findMyCars(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  // CREATE CAR WITH IMAGES — 100% WORKING
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
          return callback(new Error('Only image files allowed!'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() dto: CreateCarDto,
    @Request() req: any,
    @UploadedFiles() files: MulterFile[],
  ) {
    const imageUrls = files?.map((file) => `/uploads/${file.filename}`) || [];

    const fullDto = {
      ...dto,
      price: Number(dto.price),
      mileage: Number(dto.mileage),
      year: Number(dto.year),
      images: imageUrls,
    };

    return this.carsService.create(fullDto, req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCarDto,
    @Request() req: any,
  ) {
    const car = await this.carsService.getCarOrFail(id);
    req.car = car;
    return this.carsService.update(id, dto, req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const car = await this.carsService.getCarOrFail(id);
    req.car = car;
    return this.carsService.remove(id, req.user.sub);
  }
}
