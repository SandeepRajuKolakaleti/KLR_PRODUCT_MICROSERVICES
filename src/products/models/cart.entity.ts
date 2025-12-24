// cart.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cart_items')
export class CartEntity {
  @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    productId!: number;

    @Column()
    productName!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number;

    @Column()
    quantity!: number;

    @Column()
    userId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
