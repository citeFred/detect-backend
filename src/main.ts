import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 1. ValidationPipe 임포트
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Global Pipe로 ValidationPipe 추가
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO에 정의되지 않은 속성은 자동으로 제거
    transform: true, // 요청 데이터를 DTO 클래스 인스턴스로 변환
  }));

  await app.listen(3000);
}
bootstrap();