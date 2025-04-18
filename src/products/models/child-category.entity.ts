import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChildCategoryEntity {

    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    ThumnailImage!: string;

    @Column()
    Name!: string;

    @Column()
    Category!: number;

    @Column()
    SubCategory!: number;

    @Column({unique: true})
    Slug!: string;

    @Column()
    Status!: boolean; 

}