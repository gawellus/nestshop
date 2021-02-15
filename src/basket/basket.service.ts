import { Inject, Injectable } from '@nestjs/common';
import { AddProductToBasketResponse, GetTotalPriceResponse, ListProductsInBasketReponse, RemoveProductToBasketResponse } from 'src/interfaces/basket';
import { ShopService } from 'src/shop/shop.service';
import { AddProductDto } from './dto/add-product.dto';

@Injectable()
export class BasketService {
    private items: AddProductDto[] = [];

    constructor(
        @Inject(ShopService) private shopService: ShopService
    ) {}

    add(item: AddProductDto): AddProductToBasketResponse  {
        const {count, name} = item;
        if (
            typeof name !== 'string'
            ||
            typeof count !== 'number'
            ||
            name === ''
            ||
            count < 1
            ||
            !this.shopService.hasProduct(name)
        ) {
            return {
                isSuccess: false
            }
        }

        this.items.push(item);

        return {
            isSuccess: true,
            index: this.items.length -1
        }
    }

    remove(index: number): RemoveProductToBasketResponse {
        const {items} = this;
        if (
            index < 0
            ||
            index >= items.length
        ) {
            return {
                isSuccess: false
            };
        }

        items.splice(index, 1);        

        return {
            isSuccess: true
        }
    }

    list(): ListProductsInBasketReponse {
        return this.items;
    }

    getTotalPrice(): GetTotalPriceResponse {
        if (!this.items.every(item => this.shopService.hasProduct(item.name))) {
            //alternatywny produkt, jeśli któregoś nie ma
            const alternativeBasket = this.items.filter(
                item => this.shopService.hasProduct(item.name)
            );

            return {
                isSuccess: false,
                alternativeBasket
            }
        }


        return this.items
        .map(item => this.shopService.getPrice
            (item.name) * item.count * 1.23)
        .reduce((prev, curr) => prev + curr, 0);
        
        
    }
}
