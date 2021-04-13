import { Body, Controller, DefaultValuePipe, Delete, Get, HttpStatus, ImATeapotException, Inject, Param, ParseIntPipe, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { strict } from 'assert';
import * as path from 'path';
import { MulterDiskUploadedFiles } from 'src/interfaces/files';
import { CreateProductResponse, GetListOfProductsResponse, GetOneProductResponse, GetPaginatedListOfProductsResponse, ShopItemInterface } from 'src/interfaces/shop';
import { multerStorage, storageDir } from 'src/utils/storage';
import { AddProductDto } from './dto/add-product.dto';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {


    constructor(
        @Inject(ShopService) private shopService: ShopService
    ) {

    }

    @Get('/')
    getShopList(): Promise<ShopItemInterface[]> {
        return this.shopService.getItems();
    }

    // @Get('/test')
    // test() {
    //     throw new Error('Oh shit!')
    // }

    // @Get('/:page?')
    // getListOfProducts(
    //     @Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number //default value dla niewymaganego parametru
    // ): Promise<GetPaginatedListOfProductsResponse> {
    //     return this.shopService.getProducts(Number(page));
    // }

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
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'photo', maxCount: 10,
            },
            ], {storage: multerStorage(path.join(storageDir(), 'product-photos'))},
        ),
    )
    addProduct(
        @Body() req,
        @UploadedFiles() files: MulterDiskUploadedFiles,
    ): Promise<ShopItemInterface> {
        return this.shopService.addProduct(req, files);
    }

    @Get('/photo/:id')
    async getPhoto(
        @Param('id') id: string,
        @Res() res: any,
    ): Promise<any> {
        return this.shopService.getPhoto(id, res);
    }
    
}


