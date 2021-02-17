import { Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { CreateProductResponse, GetListOfProductsResponse, GetOneProductResponse } from 'src/interfaces/shop';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {


    constructor(
        @Inject(ShopService) private shopService: ShopService
    ) {

    }

    @Get('/')
    getListOfProducts(): Promise<GetListOfProductsResponse> {
        return this.shopService.getProducts();
    }

    @Get('/:id')
    getOneProduct(
        @Param('id') id: string
    ): Promise<GetOneProductResponse> {
        return this.shopService.getOneProduct(id);
    }

    @Delete('/:id')
    removeProduct(
        @Param('id') id: string
    ) {
        return this.shopService.removeProduct(id);
    }

    @Post('/')
    createProduct(): Promise<CreateProductResponse>  {
        return this.shopService.createDummyProduct();
    }

}
