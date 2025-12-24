// wishlist.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('wishlist_items')
@Index(['userId', 'productId'], { unique: true })
export class WishlistEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column()
    productId!: number;

    @Column()
    productName!: string;
    @Column()
    price!: number;
    @Column({
        type: "tinyint",
        width: 1,
        default: 1,  // active by default
    })
    status!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
