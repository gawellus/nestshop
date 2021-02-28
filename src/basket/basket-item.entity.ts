import { ShopItem } from "src/shop/shop-item.entity";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany,  PrimaryGeneratedColumn } from "typeorm";
import { AddProductDto } from "./dto/add-product.dto";

@Entity()
export class BasketItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    count: number;

    @ManyToOne(type => ShopItem, entity => entity.basketItem)
    @JoinColumn()
    shopItem: ShopItem;

    @ManyToOne(type => User, entity => entity.basketItem)
    @JoinColumn()
    user: User;
}