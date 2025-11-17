import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// 1. @Entity(): 이 클래스는 DB 테이블과 매핑되는 '엔티티'임을 선언
@Entity() 
export class Detection {
  
  // 2. @PrimaryGeneratedColumn(): 'id' 컬럼이 '기본 키(PK)'이며,
  //    '자동 증가(Auto-increment)' 값임을 선언
  @PrimaryGeneratedColumn()
  id: number;

  // 3. @Column(): 'filename' 컬럼임을 선언
  @Column()
  filename: string;

  // 4. @Column(): 'filetype' 컬럼임을 선언
  @Column()
  filetype: string;
  
  // 5. @CreateDateColumn(): 데이터가 '생성'될 때의 시간을 자동으로 저장
  @CreateDateColumn()
  createdAt: Date;
  
  // 6. @Column(): 'isDeepfake' 컬럼임을 선언
  @Column('boolean', { default: false })
  isDeepfake: boolean;
  
  // 7. @Column(): 'confidence' 컬럼임을 선언
  @Column('float', { default: 0.0 })
  confidence: number;
}