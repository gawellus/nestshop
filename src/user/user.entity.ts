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
    
    @Column()
    pwdHash: string;

    @Column({
        nullable: true,
        default: null,
    })
    currentTokenId: string | null;

    @OneToMany(type => BasketItem, entity => entity.user)
    basketItem: BasketItem[];

}