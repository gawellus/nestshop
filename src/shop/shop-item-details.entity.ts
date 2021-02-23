import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShopItem } from "./shop-item.entity";

@Entity()
export class ShopItemDetails extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 15
    })
    color: string;

    @Column()
    width: number;

    @OneToOne(type => ShopItem)
    shopItem: ShopItem;
}