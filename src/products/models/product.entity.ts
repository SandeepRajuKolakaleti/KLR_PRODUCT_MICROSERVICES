import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    Highlight!: { [key: string]: boolean };

    @Column()
    Status!: string; 

    @Column()
    SEOTitle!: string;

    @Column()
    SEODescription!: string;

    // Store specifications as a JSON object
    @Column({ type: "json", nullable: true })
    Specifications!: {key: string; specification: string }[];

    @Column()
    Vendor!: string;

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