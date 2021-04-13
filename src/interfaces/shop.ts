import { type } from "os";
import { ShopModule } from "src/shop/shop.module";

export interface ShopItemInterface {
    id: number;
    name: string;
    description: string;
    price: number;
}

export type GetListOfProductsResponse = ShopItemInterface[];

export type GetOneProductResponse = ShopItemInterface;

export type CreateProductResponse = ShopItemInterface;

export interface GetPaginatedListOfProductsResponse {
    items: ShopItemInterface[];
    pages: number;
}