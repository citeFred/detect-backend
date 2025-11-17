import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetectionService } from './detection.service';
import { CreateDetectionDto } from './dto/create-detection.dto';
import { UpdateDetectionDto } from './dto/update-detection.dto';

@Controller('detection')
export class DetectionController {
  constructor(private readonly detectionService: DetectionService) {}

  @Post()
  create(@Body() createDetectionDto: CreateDetectionDto) {
    return this.detectionService.create(createDetectionDto);
  }

  @Get()
  findAll() {
    return this.detectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detectionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetectionDto: UpdateDetectionDto) {
    return this.detectionService.update(+id, updateDetectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detectionService.remove(+id);
  }
}
