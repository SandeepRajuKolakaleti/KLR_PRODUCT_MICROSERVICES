import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VendorEntity {

    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    ThumnailImage!: string;

    @Column()
    Name!: string;

    @Column({select: false})
    Email!: string;

    @Column({select: false})
    PhoneNumber!: number;

    @Column({select: false})
    Address!: string;

}