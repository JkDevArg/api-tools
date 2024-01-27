import { User } from "src/users/entities/user.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class URLSCAN {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    url: string;

    @Column('json')
    data: object;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userEmail', referencedColumnName: 'email',  })
    user: User;

    @Column()
    userEmail: string;

    @DeleteDateColumn()
    deletedAt: Date;
}