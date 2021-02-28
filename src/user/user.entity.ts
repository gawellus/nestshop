import { BasketItem } from "src/basket/basket-item.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 255
    })
    email: string;

    @OneToMany(type => BasketItem, entity => entity.user)
    basketItem: BasketItem[];

}