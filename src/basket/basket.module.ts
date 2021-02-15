import { Module } from '@nestjs/common';
import { ShopModule } from 'src/shop/shop.module';
import { ShopService } from 'src/shop/shop.service';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';

@Module({
    imports: [ShopModule],
    controllers: [BasketController],
    providers: [BasketService],
})
export class BasketModule {

}