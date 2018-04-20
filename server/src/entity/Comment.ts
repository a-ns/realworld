import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Article } from "./Article";
import { IsDateString } from "class-validator";


@Entity()
export class Comment extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    @IsDateString()
    createdAt: Date

    @UpdateDateColumn()
    @IsDateString()
    updatedAt: Date

    @Column()
    body: string

    @ManyToOne(() => Users, user => user.comments, {eager: true} )
    author: Users

    @ManyToOne(() => Article, article => article.comments, {eager: true})
    article: Article

}