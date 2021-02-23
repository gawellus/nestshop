import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BasketService } from 'src/basket/basket.service';
import { GetListOfProductsResponse, GetPaginatedListOfProductsResponse } from 'src/interfaces/shop';
import { getConnection, LessThan, Like } from 'typeorm';
import { ShopItemDetails } from './shop-item-details.entity';
import { ShopItem } from './shop-item.entity';

@Injectable()
export class ShopService {
    
    //forwardref - circular dependency fix
    constructor(
        @Inject(forwardRef(() => BasketService)) private basketService: BasketService
    ) {        
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

    async getOneProduct(id: string): Promise<ShopItem> {
        return ShopItem.findOneOrFail(id);
    }

    async removeProduct(id: string) {
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
  
}

