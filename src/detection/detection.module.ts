import { Module } from '@nestjs/common';
import { DetectionService } from './detection.service';
import { DetectionController } from './detection.controller';
// 1. TypeOrmModule, Detection 임포트
import { Detection } from './entities/detection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // 2. forFeature()로 이 모듈에서 사용할 Entity를 등록
  imports: [TypeOrmModule.forFeature([Detection])],
  controllers: [DetectionController],
  providers: [DetectionService],
})
export class DetectionModule {}
