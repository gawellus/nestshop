import { Controller, Get, Inject } from '@nestjs/common';
import { GetListOfProductsResponse } from 'src/interfaces/shop';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {


    constructor(
        @Inject(ShopService) private shopService: ShopService
    ) {

    }

    @Get('/')
    getListOfProducts(): GetListOfProductsResponse {
        return this.shopService.getProducts();
    }

}
