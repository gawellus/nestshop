import { forwardRef, Module } from '@nestjs/common';
import { ShopModule } from 'src/shop/shop.module';
import { ShopService } from 'src/shop/shop.service';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';

@Module({
    imports: [
        forwardRef(() => ShopModule)
    ],
    controllers: [BasketController],
    providers: [BasketService],
    exports: [BasketService]
})
export class BasketModule {

}