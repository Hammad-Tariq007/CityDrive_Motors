import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RemarksService } from './remarks.service';
import { CreateRemarkDto } from './dto/create-remark.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Remarks')
@Controller('cars')
export class RemarksController {
  constructor(private readonly remarksService: RemarksService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':carId/remarks')
  @ApiOperation({ summary: 'Add a remark to a car' })
  @ApiResponse({ status: 201, description: 'Remark created successfully' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async create(
    @Param('carId') carId: string,
    @Body() dto: CreateRemarkDto,
    @Request() req,
  ) {
    return this.remarksService.create(carId, dto, req.user.sub);
  }

  @Get(':carId/remarks')
  @ApiOperation({ summary: 'Get all remarks for a specific car' })
  @ApiResponse({ status: 200, description: 'List of remarks' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  findByCar(@Param('carId') carId: string) {
    return this.remarksService.findByCar(carId);
  }
}
