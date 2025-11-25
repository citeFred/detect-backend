import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DetectionService } from './detection.service';
import { UpdateDetectionDto } from './dto/update-detection.dto';
import { DetectionResponseDto } from './dto/detection-response.dto';

@Controller('detection')
export class DetectionController {
  constructor(private readonly detectionService: DetectionService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File): Promise<DetectionResponseDto> {
    if (!file) {
      throw new BadRequestException('파일이 업로드되지 않았습니다.');
    }
    return this.detectionService.detectAndSave(file);
  }

  @Get()
  findAll(): Promise<DetectionResponseDto[]> {
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
