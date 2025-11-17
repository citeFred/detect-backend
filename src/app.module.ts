import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DetectionModule } from './detection/detection.module';

// 1. TypeOrmModule 임포트
import { TypeOrmModule } from '@nestjs/typeorm';
// 2. (중요) DB와 매핑할 Entity 클래스 임포트
import { Detection } from './detection/entities/detection.entity'; 

@Module({
  imports: [
    // 3. TypeOrmModule.forRoot() 설정 추가
    TypeOrmModule.forRoot({
      type: 'mysql', // DB 타입
      host: 'localhost', // (DB가 설치된 주소, 보통 localhost)
      port: 3306, // (MySQL 기본 포트)
      username: 'root', // (PC의 MySQL 아이디)
      password: '1234', // (PC의 MySQL 비밀번호)
      database: 'deepfake_db', // (미리 생성해둔 DB 스키마 이름)
      
      // 4. Entity: 이 프로젝트가 어떤 Entity들을 사용하는지 등록
      entities: [Detection], // ★ Detection 엔티티 등록
      // 5. synchronize: true (개발용 옵션)
      synchronize: true, 
      logging: true, // 쿼리 로깅 여부
    }),
    
    DetectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}