import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Article } from "./Article";


@Entity()
export class Comment extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column()
    body: string

    @ManyToOne(() => User, user => user.comments)
    author: User

    @ManyToOne(() => Article, article => article.comments)
    article: Article

}