import { Injectable } from '@nestjs/common';
import { CreateDetectionDto } from './dto/create-detection.dto';
import { UpdateDetectionDto } from './dto/update-detection.dto';

// 1. TypeORM 관련 모듈 임포트
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Detection } from './entities/detection.entity';

@Injectable()
export class DetectionService {
  
  // 2. 생성자(Constructor)에서 Repository 주입 받기
  constructor(
    @InjectRepository(Detection) // "Detection Entity의 Repository를 주입해주세요"
    private detectionRepository: Repository<Detection>, // "주입받은 것을 this.detectionRepository 변수에 할당"
  ) {}

  // 3-1. create() 메서드 수정
  async create(createDetectionDto: CreateDetectionDto): Promise<Detection> {
    // (Before) return 'This action adds a new detection';
    
    // (After)
    // 1. DTO로부터 Entity 인스턴스 생성
    const newDetection = this.detectionRepository.create(createDetectionDto);
    
    // 2. DB에 저장 (INSERT 쿼리가 실행됨)
    return this.detectionRepository.save(newDetection);
  }

// src/detection/detection.service.ts

  // 3-2. findAll() 메서드 수정
  async findAll(): Promise<Detection[]> {
    // (Before) return `This action returns all detection`;
    
    // (After)
    // 1. DB에서 'detection' 테이블의 모든 데이터를 조회 (SELECT * 쿼리)
    return this.detectionRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} detection`;
  }

  update(id: number, updateDetectionDto: UpdateDetectionDto) {
    return `This action updates a #${id} detection`;
  }

  remove(id: number) {
    return `This action removes a #${id} detection`;
  }
}
