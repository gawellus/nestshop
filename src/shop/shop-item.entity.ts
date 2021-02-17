import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShopItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 60
    })
    name: string;

    @Column({
        type: 'text',
        default: null,
        nullable: true
    })
    description: string|null;

    @Column({
        type: 'float',
        precision: 6,
        scale: 2
    })
    price: number;

    @Column({
        default: 0
    })
    boughtCounter: number;

    @Column({
        default: false
    })
    wasEverBought: boolean;
}