import { Entity, BaseEntity, PrimaryColumn, Column, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { Article } from "./Article";
import { Comment } from './Comment'
@Entity()
export class User extends BaseEntity {

    @PrimaryColumn()
    email: string

    @Column()
    token: string

    @PrimaryColumn()
    username: string

    @Column()
    bio: string

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