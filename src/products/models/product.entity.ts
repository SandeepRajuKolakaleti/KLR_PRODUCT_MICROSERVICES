import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { HighlightDto, SpecificationDto } from "./dto/create-product.dto";

@Entity()
export class ProductEntity {

    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    ThumnailImage!: string;

    @Column()
    Name!: string;

    @Column({unique: true})
    Slug!: string;

    @Column({select: false})
    Category!: number;

    @Column({select: false})
    SubCategory!: number;

    @Column({select: false})
    ChildCategory!: number;

    @Column({select: false})
    Brand!: number;

    @Column({unique: true})
    SKU!: string;

    @Column()
    Price!: number;
    
    @Column()
    OfferPrice!: number;

    @Column()
    StockQuantity!: number;

    @Column()
    Weight!: number;
    
    @Column()
    ShortDescription!: string;

    @Column()
    LongDescription!: string;

    @Column({ type: "json", nullable: true })
    Highlight!: HighlightDto;

    @Column({
        type: "tinyint",
        width: 1,
        default: 1,  // active by default
    })
    Status!: number;

    @Column()
    SEOTitle!: string;

    @Column()
    SEODescription!: string;

    // Store specifications as a JSON object
    @Column({ type: "json", nullable: true })
    Specifications!: SpecificationDto[];

    @Column()
    Vendor!: string;

    // ✅ Auto-created timestamp
    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    // ✅ Auto-updated timestamp
    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

}

// const product = new ProductEntity();
// product.name = "Smartphone";
// product.SKU = 12345;
// product.Specifications = [
//     { key: "Processor", specification: "Snapdragon 888" },
//     { key: "RAM", specification: "8GB" },
//     { key: "Battery", specification: "5000mAh" }
// ];
// product.Highlight = {
//     "Top Product": true,
//     "New Arrival": true,
//     "Best Product": true,
//     "Featured Product": false
// };