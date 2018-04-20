import { Entity, BaseEntity, Column, OneToMany, ManyToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { IsEmail } from 'class-validator'
import { Article } from "./Article";
import { Comment } from './Comment'
@Entity()
export class Users extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsEmail()
    email: string

    @Column({unique: true})
    username: string

    @Column({nullable: true})
    bio: string

    @Column()
    password: string

    @Column({nullable: true})
    image: string

    @OneToMany(() => Article, article => article.author)
    articles: Article[]

    @OneToMany(() => Comment, comment => comment.author)
    comments: Comment[]

    @ManyToMany(() => Article, article => article.favoritedBy, {eager: true})
    @JoinTable()
    favorites: Article[]

    @ManyToMany(() => Users)
    @JoinTable({name : "follows", joinColumn: {name:"followed", referencedColumnName: "id"}, inverseJoinColumn: {name:"follower", referencedColumnName:"id"}})
    // select * from users inner join follows on users.id = follows.followed and follows.follower = { some_id}
    followers: Users[]
}