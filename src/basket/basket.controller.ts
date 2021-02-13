import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { AddProductToBasketResponse, GetTotalPriceResponse, ListProductsInBasketReponse, RemoveProductToBasketResponse } from 'src/interfaces/basket';
import { BasketService } from './basket.service';
import { AddProductDto } from './dto/add-product.dto';

@Controller('basket')
export class BasketController {
    
    constructor(
        @Inject(BasketService) private basketService: BasketService
    ) {
        
    }

    @Post('/')
    addProductToBasket(
        @Body() item: AddProductDto
    ): AddProductToBasketResponse {
        return this.basketService.add(item);
    }

    @Delete('/:index')
    removeProductFromBasket(
        @Param('index') index: string //parametry url przychodza jako string
    ): RemoveProductToBasketResponse {
        return this.basketService.remove(Number(index));
    }

    @Get('/')
    listProductsInBasket(): ListProductsInBasketReponse {
        return this.basketService.list();
    }

    @Get('/total-price')
    getTotalPrice(): GetTotalPriceResponse {
        return this.basketService.getTotalPrice();
    }
}
