import { AddProductDto } from "src/basket/dto/add-product.dto";

export type AddProductToBasketResponse = {
    isSuccess: true;
    id: number;
} | {
    isSuccess: false
}

export interface RemoveProductToBasketResponse {
    isSuccess: boolean;
}

export type ListProductsInBasketReponse = OneBasketItem[];

export type GetTotalPriceResponse = number | {
    isSuccess: false;
    alternativeBasket: AddProductDto[];
};

interface OneBasketItem {
    id : number;
    count: number;
}

export interface GetBasketStatsResponse {
    itemInBasketAvgPrice: number;
    basketAvgTotalPrice: number;
}