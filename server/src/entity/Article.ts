import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Tag } from "./Tag";
import { flattenDeep, difference } from 'lodash'
import { User } from "./User";
import { Comment } from './Comment'
@Entity()
export class Article extends BaseEntity {
    static async saveWithTags(args: any): Promise<Article> {
        const tagsKinds = args.tags.map((tag: any) => tag.kind)
        const existingTags = flattenDeep(await Promise.all(tagsKinds.map((kind: string) => Tag.find({where: {kind}}))))
        const tagsToMake = difference(tagsKinds, existingTags.map((f: any) => f.kind))
        const newTags = await Promise.all(tagsToMake.map(kind => Tag.create({kind}).save()))
        const finalTags = [...existingTags, ...newTags]

        return Article.create({...args, tags: finalTags}).save()
    }
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
    tags: Tag[]

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