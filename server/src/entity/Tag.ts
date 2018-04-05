import { Entity, BaseEntity,Column,  PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Tag extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    kind: string
}