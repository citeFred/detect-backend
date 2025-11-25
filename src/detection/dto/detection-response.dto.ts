export class DetectionResponseDto {
  id: number;
  filename: string;
  filetype: string;
  isDeepfake: boolean;
  confidence: number;
  createdAt: Date;
}