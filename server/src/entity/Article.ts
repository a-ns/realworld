import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Tag } from "./Tag";

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

    @ManyToMany(() => Tag, {cascade: ["insert", "update"]})
    @JoinTable()
    tags: Tag[]
}