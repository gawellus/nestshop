import { Injectable } from '@nestjs/common';
import { INSTANCE_METADATA_SYMBOL } from '@nestjs/core/injector/instance-wrapper';
import { GetListOfProductsResponse } from 'src/interfaces/shop';

@Injectable()
export class ShopService {
    getProducts(): GetListOfProductsResponse {
        return [
            {
                name: 'Ogórki',
                description: 'Opis',
                price: 2
            },
            {
                name: 'Pomidor',
                description: 'Opis pomidora',
                price: 3
            },
            {
                name: 'Kalafior',
                description: 'Opis kalafiora',
                price: 4
            }
        ]
    }

    hasProduct(name: string): boolean {
        return this.getProducts().some(item => item.name === name);
    }

    getPrice(name: string): number {
        return this.getProducts().find(item => item.name === name).price;
    }
}

