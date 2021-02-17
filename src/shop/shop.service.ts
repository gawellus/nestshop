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
        @Inject(forwardRef(() => BasketService)) private basketService: BasketService,
        @InjectRepository(ShopItem) private shopItemRepository: Repository<ShopItem>
    ) {        
    }

    async getProducts(): Promise<GetListOfProductsResponse> {
        return await this.shopItemRepository.find();
    }

    async hasProduct(name: string): Promise<boolean> {
        return (await this.getProducts()).some(item => item.name === name);
    }

    async getPrice(name: string): Promise<number> {
        return (await this.getProducts()).find(item => item.name === name).price;
    }

    async getOneProduct(id: string): Promise<ShopItem> {
        return this.shopItemRepository.findOneOrFail(id);
    }

    async removeProduct(id: string) {
        await this.shopItemRepository.delete(id);
    }

    async createDummyProduct(): Promise<ShopItem> {
        const newItem = new ShopItem();
        newItem.name = 'Pomidor';
        newItem.description = 'Czerwony jak cegła!';
        newItem.price = 17;

        await this.shopItemRepository.save(newItem);

        return newItem;
    }

    async addBoughtCounter(id: number) {
        //update 1 metodą po id
        await this.shopItemRepository.update(id, {
            wasEverBought: true
        })

        //klasyczny update: pobieranie->update
        const item = await this.shopItemRepository.findOneOrFail(id);

        item.boughtCounter++;

        await this.shopItemRepository.save(item);
    }
  
}

