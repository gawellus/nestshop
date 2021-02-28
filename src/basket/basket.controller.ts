import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { AddProductToBasketResponse, GetBasketStatsResponse, GetTotalPriceResponse, ListProductsInBasketReponse, RemoveProductToBasketResponse } from 'src/interfaces/basket';
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
    ): Promise<AddProductToBasketResponse> {
        return this.basketService.add(item);
    }

    @Delete('/clear/:userId')
    clearBasket(
        @Param('userId') userId: number
    ) {
        this.basketService.clearBasket(userId);
    }

    @Delete('/:productId/:userId')
    removeProductFromBasket(
        @Param('productId') productId: string, //parametry url przychodza jako string
        @Param('userId') userId: number
    ): Promise<RemoveProductToBasketResponse> {
        return this.basketService.remove(Number(productId), Number(userId));
    }

    @Get('/admin')
    getBasketForAdmin(): Promise<ListProductsInBasketReponse> {
        return this.basketService.getAllForAdmin();
    }

    @Get('/stats')
    getStats(): Promise<GetBasketStatsResponse> {
        return this.basketService.getStats();
    }

    @Get('/:userId')
    listProductsInBasket(
        @Param('userId') userId: number
    ): Promise<ListProductsInBasketReponse> {
        return this.basketService.getAllForUser(userId);
    }

    @Get('/total-price/:userId')
    getTotalPrice(
        @Param('userId') userId: number
    ): Promise<GetTotalPriceResponse> {
        return this.basketService.getTotalPrice(userId);
    }


}
