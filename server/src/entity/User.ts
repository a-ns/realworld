import { Entity, BaseEntity, PrimaryColumn, Column, OneToMany, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail } from 'class-validator'
import { Article } from "./Article";
import { Comment } from './Comment'
@Entity()
export class User extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number

    @PrimaryColumn()
    @IsEmail()
    email: string

    @Column({unique: true})
    username: string

    @Column({nullable: true})
    bio: string

    @Column()
    password: string

    @OneToMany(() => Article, article => article.author)
    articles: Article[]

    @OneToMany(() => Comment, comment => comment.author)
    comments: Comment[]

    @ManyToMany(() => Article, article => article.favoritedBy)
    favorites: Article[]

    @OneToMany(() => User, user => user.followers)
    following: User[]

    @ManyToOne(() => User, user => user.following)
    followers: User[]
}