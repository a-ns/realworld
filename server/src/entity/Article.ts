import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Tag } from "./Tag";
import { Comment } from './Comment'
import { Users } from "./Users";
@Entity()
export class Article extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    slug: string

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    body: string

    @ManyToMany(() => Tag, {eager: true})
    @JoinTable()
    tagList: Tag[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Users, user => user.articles)
    author: Users

    @OneToMany(() => Comment, comment => comment.article)
    comments: Comment[]

    @ManyToMany(() => Users, user => user.favorites)
    favoritedBy: Users[]
    
}