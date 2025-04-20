import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SubCategoryEntity {

    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    ThumnailImage!: string;

    @Column()
    Name!: string;

    @Column()
    Category!: number;

    @Column({unique: true})
    Slug!: string;

    @Column()
    Status!: string; 

}