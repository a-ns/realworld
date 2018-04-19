import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne } from "typeorm";
import { Users } from "./Users";
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

    @ManyToOne(() => Users, user => user.comments, )
    author: Users

    @ManyToOne(() => Article, article => article.comments)
    article: Article

}