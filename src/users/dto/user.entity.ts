import { IsString, IsStrongPassword } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column()
  username: string;

  @IsStrongPassword()
  @Column()
  password: string;
}
