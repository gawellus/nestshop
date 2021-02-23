import { type } from "os";
import { ShopModule } from "src/shop/shop.module";

export interface ShopItem {
    id: number;
    name: string;
    description: string;
    price: number;
}

export type GetListOfProductsResponse = ShopItem[];

export type GetOneProductResponse = ShopItem;

export type CreateProductResponse = ShopItem;

export interface GetPaginatedListOfProductsResponse {
    items: ShopItem[];
    pages: number;
}