import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Tag } from "./Tag";
import { User } from "./User";
import { Comment } from './Comment'
@Entity()
export class Article extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    slug: string

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    body: string

    @ManyToMany(() => Tag)
    @JoinTable()
    tagList: Tag[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => User, user => user.articles)
    author: User

    @OneToMany(() => Comment, comment => comment.article)
    comments: Comment[]

    @ManyToMany(() => User, user => user.favorites)
    favoritedBy: User[]
    
}