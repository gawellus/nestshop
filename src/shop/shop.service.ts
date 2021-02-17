import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { INSTANCE_METADATA_SYMBOL } from '@nestjs/core/injector/instance-wrapper';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketService } from 'src/basket/basket.service';
import { GetListOfProductsResponse } from 'src/interfaces/shop';
import { Repository } from 'typeorm';
import { ShopItem } from './shop-item.entity';

@Injectable()
export class ShopService {
    //forwardref - circular dependency fix
    constructor(
        @Inject(forwardRef(() => BasketService)) private basketService: BasketService
    ) {        
    }

    async getProducts(): Promise<GetListOfProductsResponse> {
        return await ShopItem.find();
    }

    async hasProduct(name: string): Promise<boolean> {
        return (await this.getProducts()).some(item => item.name === name);
    }

    async getPrice(name: string): Promise<number> {
        return (await this.getProducts()).find(item => item.name === name).price;
    }

    async getOneProduct(id: string): Promise<ShopItem> {
        return ShopItem.findOneOrFail(id);
    }

    async removeProduct(id: string) {
        await ShopItem.delete(id);
    }

    async createDummyProduct(): Promise<ShopItem> {
        const newItem = new ShopItem();
        newItem.name = 'Pomidor';
        newItem.description = 'Czerwony jak cegła!';
        newItem.price = 17;

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
  
}

