// src/remarks/remarks.controller.ts
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

@Controller('cars')
export class RemarksController {
  constructor(private readonly remarksService: RemarksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':carId/remarks')
  async create(
    @Param('carId') carId: string,
    @Body() dto: CreateRemarkDto,  // ← Take full DTO directly
    @Request() req,
  ) {
    // Now TypeScript is HAPPY because we use the real DTO
    return this.remarksService.create(carId, dto, req.user.sub);
  }

  @Get(':carId/remarks')
  findByCar(@Param('carId') carId: string) {
    return this.remarksService.findByCar(carId);
  }
}