import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDetectionDto {
  // 2. 'filename' 속성 정의
  @IsString() // 이 값은 '문자열'이어야 한다
  @IsNotEmpty() // 이 값은 '빈 값'일 수 없다
  filename: string;

  // 3. 'filetype' 속성 정의
  @IsString()
  @IsNotEmpty()
  filetype: string;
}