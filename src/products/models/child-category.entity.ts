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
    Category!: string;

    @Column()
    SubCategory!: string;

    @Column({unique: true})
    Slug!: string;

    @Column()
    Status!: string; 

}