import { type } from "os";

export interface ShopItem {
    id: number;
    name: string;
    description: string;
    price: number;
}

export type GetListOfProductsResponse = ShopItem[];

export type GetOneProductResponse = ShopItem;

export type CreateProductResponse = ShopItem;