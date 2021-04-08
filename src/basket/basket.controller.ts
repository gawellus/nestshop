import { Body, Controller, Delete, Get, Inject, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { resolve } from 'path';
import { UseCacheTime } from 'src/decorators/use-cache-time.decorator';
import { UsePassword } from 'src/decorators/use-password.decorator';
import { PasswordProtectGuard } from 'src/guards/password-protect.guard';
import { MyCacheInterceptor } from 'src/interceptors/my-cache.interceptor';
import { MyTimeoutInterceptor } from 'src/interceptors/my-timeout.interceptor';
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
    @UseGuards(PasswordProtectGuard)
    @UsePassword('admin')
    getBasketForAdmin(): Promise<ListProductsInBasketReponse> {
        return this.basketService.getAllForAdmin();
    }

    @Get('/stats')
    @UseGuards(PasswordProtectGuard)
    @UsePassword('stats')
    @UseInterceptors(MyTimeoutInterceptor, MyCacheInterceptor)
    @UseCacheTime(10)
    getStats(): Promise<GetBasketStatsResponse> {
        return this.basketService.getStats();
        //return new Promise(resolve => {}); //promise, ktory nigdy sie nie zakonczy - do testu timeout
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
