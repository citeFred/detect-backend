import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Detection } from './entities/detection.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import FormData from 'form-data';
import { UpdateDetectionDto } from './dto/update-detection.dto';
import { DetectionResponseDto } from './dto/detection-response.dto';
import { InferenceResponseDto } from './dto/inference-response.dto';

@Injectable()
export class DetectionService {
  constructor(
    @InjectRepository(Detection)
    private detectionRepository: Repository<Detection>,
    private readonly httpService: HttpService,
  ) {}

  // 탐지(파일 업로드 -> FastAPI 추론 -> 결과 DB 저장)
  async detectAndSave(file: Express.Multer.File): Promise<DetectionResponseDto> {    
    let inferenceServerApiUrl = '';
    let apiResult: InferenceResponseDto | null = null;
    const mimeType = file.mimetype;

    // 1. 파일 타입에 따라 FastAPI 엔드포인트 결정
    if (mimeType.startsWith('image/')) {
      inferenceServerApiUrl = 'http://localhost:8000/predict/image';
    } else if (mimeType.startsWith('audio/') || mimeType === 'application/octet-stream') {
      inferenceServerApiUrl = 'http://localhost:8000/predict/audio';
    } else {
      throw new Error('지원하지 않는 파일 형식입니다. (이미지 또는 오디오만 가능)');
    }

    // 2. FastAPI로 보낼 FormData 생성
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    try {
      // 3. Inference API 서버 호출(Axios 사용)
      const response = await lastValueFrom(
        this.httpService.post<InferenceResponseDto>(
          inferenceServerApiUrl,
          formData, 
          {
            headers: formData.getHeaders(),
          }
        ),
      );
      apiResult = response.data;
    } catch (error) {
        console.error('FastAPI Connection Error:', error.message);
      throw new InternalServerErrorException('AI 서버와 통신 중 오류가 발생했습니다.');
    }

    // 4. DB에 저장할 엔티티 생성(DTO-Entity 매핑)
    const newDetection = this.detectionRepository.create({
      filename: file.originalname,
      filetype: file.mimetype,
      isDeepfake: apiResult.is_deepfake ?? false,
      confidence: Number(apiResult?.confidence ?? 0.0)
    });

    // 5. DB 저장 및 결과 DTO 반환
    const savedEntity = await this.detectionRepository.save(newDetection);
    const detectionResponseDto = Object.assign(new DetectionResponseDto(), savedEntity);
    return detectionResponseDto;
  }

  async findAll(): Promise<DetectionResponseDto[]> {
    const detectionResponseDtos = await this.detectionRepository.find({ order: { createdAt: 'DESC' } });
    return detectionResponseDtos.map(detection => Object.assign(new DetectionResponseDto(), detection));
  }

  async findOne(id: number): Promise<Detection> {
    const detection = await this.detectionRepository.findOneBy({ id });
    if (!detection) {
      throw new NotFoundException(`ID #${id} Not Found`);
    }
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
