import { User } from "src/users/entities/user.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";


@Entity()
export class Mail {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    email: string;

    @Column('json')
    params: object;

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