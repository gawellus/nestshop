import { Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { strict } from 'assert';
import { CreateProductResponse, GetListOfProductsResponse, GetOneProductResponse, GetPaginatedListOfProductsResponse } from 'src/interfaces/shop';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {


    constructor(
        @Inject(ShopService) private shopService: ShopService
    ) {

    }

    @Get('/:page')
    getListOfProducts(
        @Param('page') page: string
    ): Promise<GetPaginatedListOfProductsResponse> {
        return this.shopService.getProducts(Number(page));
    }

    @Get('/find/:search')
    findItem(
        @Param('search') search: string
    ): Promise<GetListOfProductsResponse> {
        
        return this.shopService.findProducts(search);
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
