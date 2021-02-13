import { AddProductDto } from "src/basket/dto/add-product.dto";

export type AddProductToBasketResponse = {
    isSuccess: true;
    index?: number;
} | {
    isSuccess: false
}

export interface RemoveProductToBasketResponse {
    isSuccess: boolean;
}

export type ListProductsInBasketReponse = AddProductDto[];

export type GetTotalPriceResponse = number | {
    isSuccess: false;
    alternativeBasket: AddProductDto[];
};