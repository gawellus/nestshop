import { Controller, DefaultValuePipe, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { strict } from 'assert';
import { CreateProductResponse, GetListOfProductsResponse, GetOneProductResponse, GetPaginatedListOfProductsResponse } from 'src/interfaces/shop';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {


    constructor(
        @Inject(ShopService) private shopService: ShopService
    ) {

    }

    @Get('/:page?')
    getListOfProducts(
        @Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number //default value dla niewymaganego parametru
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
        @Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.FORBIDDEN   //np. customowy błąd gdy na wejsciu co innego niz number
        })) id: number //parsowanie str to int
    ): Promise<GetOneProductResponse> {
        return this.shopService.getOneProduct(Number(id));
    }

    @Delete('/:id')
    removeProduct(
        @Param('id', ParseIntPipe) id: number //parsowanie str to int / wywala blad gdydostanie cos innego niz number
    ) {
        return this.shopService.removeProduct(Number(id));
    }

    @Post('/')
    createProduct(): Promise<CreateProductResponse>  {
        return this.shopService.createDummyProduct();
    }
}
