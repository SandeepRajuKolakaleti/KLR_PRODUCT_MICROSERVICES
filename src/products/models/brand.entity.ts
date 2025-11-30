import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class BrandEntity {

    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    ThumnailImage!: string;

    @Column()
    Name!: string;

    @Column({unique: true})
    Slug!: string;

    @Column()
    Status!: string;

    // ✅ Auto-created timestamp
    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    // ✅ Auto-updated timestamp
    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

}