import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BasketService } from 'src/basket/basket.service';
import { MulterDiskUploadedFiles } from 'src/interfaces/files';
import { GetListOfProductsResponse, GetPaginatedListOfProductsResponse } from 'src/interfaces/shop';
import { ShopItemInterface } from 'src/interfaces/shop';
import { getConnection, LessThan, Like } from 'typeorm';
import { AddProductDto } from './dto/add-product.dto';
import { ShopItemDetails } from './shop-item-details.entity';
import { ShopItem } from './shop-item.entity';
import * as fs from 'fs';
import * as path from 'path';
import { storageDir } from 'src/utils/storage';

@Injectable()
export class ShopService {
    //forwardref - circular dependency fix
    constructor(
        @Inject(forwardRef(() => BasketService)) private basketService: BasketService
    ) {
    }

    filter(shopItem: ShopItem): ShopItemInterface {
        const {id, price, description, name} = shopItem;
        return {id, price, description, name};
      }
    
      async getItems(): Promise<ShopItemInterface[]> {
        return (await ShopItem.find()).map(this.filter);
      }

    async getProducts(page: number = 1): Promise<GetPaginatedListOfProductsResponse> {
        const maxPerPage = 2;

        const [items, count] = await ShopItem.findAndCount({
            relations: ['details', 'sets'],
            skip: maxPerPage * (page - 1),
            take: maxPerPage
        });

        const pages = Math.ceil(count / maxPerPage);

        return {
            items,
            pages
        }
    }

    async hasProduct(name: string): Promise<boolean> {
        return (await this.getProducts()).items.some(item => item.name === name);
    }

    async getPrice(name: string): Promise<number> {
        return (await this.getProducts()).items.find(item => item.name === name).price;
    }

    async getOneProduct(id: number): Promise<ShopItem> {
        return ShopItem.findOneOrFail(id);
    }

    async removeProduct(id: number) {
        await ShopItem.delete(id);
    }

    async createDummyProduct(): Promise<ShopItem> {
        const newItem = new ShopItem();
        newItem.name = 'Uber Pomidor';
        newItem.description = 'Indian RED!';
        newItem.price = 25;

        await newItem.save();

        const details = new ShopItemDetails();
        details.color = 'red';
        details.width = 10;

        await details.save();

        newItem.details = details;
        await newItem.save();

        return newItem;
    }

    async addBoughtCounter(id: number) {
        //update 1 metodą po id
        await ShopItem.update(id, {
            wasEverBought: true
        })

        //klasyczny update: pobieranie->update
        const item = await ShopItem.findOneOrFail(id);

        item.boughtCounter++;

        await item.save();
    }

    async findProducts(search): Promise<GetListOfProductsResponse> {
        //query builder approach
        return await getConnection()
            .createQueryBuilder()
            .select('shopItem')
            .from(ShopItem, 'shopItem')
            .where('shopItem.description LIKE :search', {
                search: `%${search}%`
            })
            .orderBy('shopItem.id', 'DESC')
            .getMany();

        /*
        //getRaw zwraca rezultat zapytania (nie rekordy), np. count
        return await getConnection()
            .createQueryBuilder()
            .select('COUNT(shopItem.id)', 'count')
            .from(ShopItem, 'shopItem')
            .getRawOne();    
        */

        /*
        //standard approach
        return await ShopItem.find({            
            //where: [ //OR
                // { name:  'Ogórek'},             
                // { price: 17.00, name: 'Pomidor'} //AND
            //]
            // where: { //operatory porownan
            //     price: LessThan(17.00)
            // }
            where: {
                description: Like(`%${search}%`)
            }
        });*/
    }

    async addProduct(req: AddProductDto, files: MulterDiskUploadedFiles): Promise<ShopItemInterface> {

        const photo = files?.photo?.[0] ?? null;

        try {

            const shopItem = new ShopItem();
            shopItem.name = req.name;
            shopItem.description = req.description;
            shopItem.price = req.price;

            if (photo) {
                shopItem.photoFn = photo.filename;
            }

            await shopItem.save();

            return this.filter(shopItem);

        } catch (e) {
            try {
                if (photo) {
                    fs.unlinkSync(
                        path.join(storageDir(), 'product-photos', photo.filename)
                    );
                }
            } catch (e2) { }

            throw e;
        }
    }

    async getPhoto(id: string, res: any) {
        try {
          const one = await ShopItem.findOne(id);
    
          if (!one) {
            throw new Error('No object found!');
          }
    
          if (!one.photoFn) {
            throw new Error('No photo in this entity!');
          }
    
          res.sendFile(
              one.photoFn,
              {
                root: path.join(storageDir(), 'product-photos'),
              },
          );
    
        } catch(e) {
          res.json({
            error: e.message,
          });
        }
      }
}
