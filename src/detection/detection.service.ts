import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetectionDto } from './dto/create-detection.dto';
import { UpdateDetectionDto } from './dto/update-detection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Detection } from './entities/detection.entity';

@Injectable()
export class DetectionService {
  // DI
  constructor(
    @InjectRepository(Detection)
    private detectionRepository: Repository<Detection>,
  ) {}

  // Create
  async create(createDetectionDto: CreateDetectionDto): Promise<Detection> {
    // 1. DTO로부터 Entity 인스턴스 생성
    const newDetection = this.detectionRepository.create(createDetectionDto);
    
    // 2. DB에 저장 (INSERT 쿼리가 실행됨)
    return this.detectionRepository.save(newDetection);
  }

  // Find All
  async findAll(): Promise<Detection[]> {
    // 1. DB에서 'detection' 테이블의 모든 데이터를 조회 (SELECT * 쿼리)
    return this.detectionRepository.find();
  }

  // Find One
  async findOne(id: number): Promise<Detection> {
    // 1. DB에서 'id' 컬럼을 기준으로 1개 조회 (SELECT * ... WHERE id = ...)
    const detection = await this.detectionRepository.findOneBy({ id });

    // 2. (에러 핸들링) 만약 해당 ID의 데이터가 없으면 404 에러 반환
    if (!detection) {
      throw new NotFoundException(`ID #${id}에 해당하는 탐지 내역을 찾을 수 없습니다.`);
    }

    // 3. 찾은 데이터 반환
    return detection;
  }

  // Update
  async update(id: number, updateDetectionDto: UpdateDetectionDto) {
    // 1. 'id'로 찾아서, 'updateDetectionDto'의 내용으로 DB를 업데이트 (UPDATE 쿼리)
    //    (참고: 'update'는 결과로 업데이트된 Entity를 반환하지 않고, 영향 받은 행 수(Affected Rows) 등을 반환합니다.)
    const updateResult = await this.detectionRepository.update(id, updateDetectionDto);

    // 2. (에러 핸들링) 만약 업데이트된 행(affected)이 0개라면, 해당 ID가 없다는 뜻.
    if (updateResult.affected === 0) {
      throw new NotFoundException(`ID #${id}에 해당하는 탐지 내역을 찾을 수 없습니다.`);
    }

    // 3. 업데이트된 내용을 다시 조회하여 반환
    return this.findOne(id);
  }

  // Delete
  async remove(id: number) {
    // 1. 'id'로 찾아서 DB에서 삭제 (DELETE 쿼리)
    const deleteResult = await this.detectionRepository.delete(id);

    // 2. (에러 핸들링) 만약 삭제된 행(affected)이 0개라면, 해당 ID가 없다는 뜻.
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`ID #${id}에 해당하는 탐지 내역을 찾을 수 없습니다.`);
    }

    // 3. 성공 메시지 반환 (또는 삭제된 객체를 반환해도 됨)
    return {
      deleted: true,
      message: `ID #${id} 탐지 내역이 성공적으로 삭제되었습니다.`,
    };
  }
}
