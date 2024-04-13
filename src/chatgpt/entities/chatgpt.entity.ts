import { Bots } from "src/common/enums/bots_enum";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class Chatgpt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chat: string;

    @Column({ nullable: true })
    token: string;

    @Column({ type: 'enum', default: Bots.GEMINI, enum: Bots })
    bot: Bots;

    @Column()
    response: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userEmail', referencedColumnName: 'email',  })
    user: User;

    @Column()
    userEmail: string;

    @CreateDateColumn()
    createdAt: Date;
}
