import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketModule } from 'src/basket/basket.module';
import { ShopItem } from './shop-item.entity';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
    imports: [
        forwardRef(() =>  BasketModule), //circular dependency fix
        TypeOrmModule.forFeature([ShopItem])
    ],
    controllers: [ShopController],
    providers: [ShopService],
    exports: [ShopService]
})
export class ShopModule {

}