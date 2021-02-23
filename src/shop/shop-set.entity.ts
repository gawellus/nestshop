import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ShopItem } from "./shop-item.entity";

@Entity()
export class ShopSet extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    name: string;

    @ManyToMany(type => ShopItem, entiy => entiy.sets)
    items: ShopItem[];
    
}