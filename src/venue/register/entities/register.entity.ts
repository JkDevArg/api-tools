import {
    Column,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
  
@Entity()
export class RegisterVenue {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    phone: string;
  
    @Column()
    gender: string;
  
    @Column()
    tel: string;

    @Column()
    city: string;
  
    @DeleteDateColumn()
    deletedAt: Date;
}
  