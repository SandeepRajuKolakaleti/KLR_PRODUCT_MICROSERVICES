import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column({
        type: "tinyint",
        width: 1,
        default: 1,  // active by default
    })
    Status!: number;

    // ✅ Auto-created timestamp
    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    // ✅ Auto-updated timestamp
    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

}