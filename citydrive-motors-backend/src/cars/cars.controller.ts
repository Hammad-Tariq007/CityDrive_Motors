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
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'multer';
import { storage } from '../config/cloudinary.config';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cars (public)' })
  @ApiResponse({ status: 200, description: 'List of cars' })
  findAll() {
    return this.carsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('my-cars')
  @ApiOperation({ summary: 'Get cars owned by the logged-in user' })
  @ApiResponse({ status: 200, description: "List of user's cars" })
  findMyCars(@Request() req: any) {
    return this.carsService.findMyCars(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a car by ID' })
  @ApiResponse({ status: 200, description: 'Car details' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage,
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
          return callback(new Error('Only image files allowed!'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Create a new car' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCarDto })
  @ApiResponse({ status: 201, description: 'Car created successfully' })
  async create(
    @Body() dto: CreateCarDto,
    @Request() req: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imageUrls = files?.map((file) => file.path) || [];

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
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a car (owner only)' })
  @ApiResponse({ status: 200, description: 'Car updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden (not owner)' })
  @ApiResponse({ status: 404, description: 'Car not found' })
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
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a car (owner only)' })
  @ApiResponse({ status: 200, description: 'Car deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden (not owner)' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const car = await this.carsService.getCarOrFail(id);
    req.car = car;
    return this.carsService.remove(id, req.user.sub);
  }
}
