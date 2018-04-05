import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Tag } from "./Tag";
import { flattenDeep, difference } from 'lodash'
import { User } from "./User";
import { Comment } from './Comment'
@Entity()
export class Article extends BaseEntity {
    static async saveWithTags(args: any){
        const tagsKinds = args.tags.map((tag: any) => tag.kind)
        let tagsKindsFinds =  tagsKinds.map((kind: string) => Tag.find({where: {kind}}))
        tagsKindsFinds = flattenDeep(await Promise.all(tagsKindsFinds))
        let tagsToMake: any[] = args.tags
        tagsToMake = difference(tagsKinds, tagsKindsFinds.map((f: any) => f.kind))
        const tagsMade = await Promise.all(tagsToMake.map(kind => Tag.create({kind}).save()))
        const finalTags = [...tagsKindsFinds, ...tagsMade]

        const article = Article.create({...args})
        article.tags = finalTags as any

        return article.save()
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

    @ManyToMany(() => Tag, {cascade:true })
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