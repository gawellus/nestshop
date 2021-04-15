import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AddProductToBasketResponse, GetBasketStatsResponse, GetTotalPriceResponse, ListProductsInBasketReponse, RemoveProductToBasketResponse } from 'src/interfaces/basket';
import { MailService } from 'src/mail/mail.service';
import { ShopItem } from 'src/shop/shop-item.entity';
import { ShopService } from 'src/shop/shop.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { getConnection } from 'typeorm';
import { runInThisContext } from 'vm';
import { BasketItem } from './basket-item.entity';
import { AddProductDto } from './dto/add-product.dto';
// import {addedToBasketInfoEmailTemplate} from "../templates/email/added-to-basket-info";

@Injectable()
export class BasketService {
    constructor(
        @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        @Inject(MailService) private mailService: MailService,
    ) {}

    async add(product: AddProductDto, user: User): Promise<AddProductToBasketResponse>  {
        const {count, productId} = product;

        const shopItem = await this.shopService.getOneProduct(productId);

        if (
            typeof productId !== 'number'
            ||            
            typeof count !== 'number'
            ||
            productId === null
            ||
            count < 1
            ||
            !shopItem
        ) {
            return {
                isSuccess: false
            }
        }

        const item = new BasketItem();        
        item.count = count;

        await item.save();

        item.shopItem = shopItem;
        item.user = user;

        await item.save();

        // nie dziala na wsl z mailslurper
        // await this.mailService.sendMail(user.email, 'Dziękujemy za dodanie do koszyka!', addedToBasketInfoEmailTemplate());

        this.shopService.addBoughtCounter(productId);

        return {
            isSuccess: true,
            id: item.id
        }
    }

    async remove(productId: number, userId: number): Promise<RemoveProductToBasketResponse> {
        const user = await this.userService.getOneUser(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const item = await BasketItem.findOne({
            where: {
                id: productId,
                user
            }
        });

        console.log(item);
        
        if (item) {
            await item.remove();

            return {
                isSuccess: true
            };
        }

        return {
            isSuccess: false
        }
    }

    async list(): Promise<BasketItem[]> {
        return BasketItem.find({
            relations: ['shopItem']
        });
    }

    async getAllForUser(userId: number): Promise<BasketItem[]> {
        const user = await this.userService.getOneUser(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return BasketItem.find({
            where: {
                user
            },
            relations: ['shopItem']
        });
    }

    async getAllForAdmin(): Promise<BasketItem[]> {
        return BasketItem.find({
            relations: ['shopItem', 'user']
        });
    }

    async getTotalPrice(userId: number): Promise<GetTotalPriceResponse> {
        const items = await this.getAllForUser(userId);

        return (await Promise.all(items
            .map(async item => (item.shopItem.price * 
                item.count * 1.23)
            )))
            .reduce((prev, curr) => prev + curr, 0);
    }

    async clearBasket(userId: number) {
        const user = await this.userService.getOneUser(userId);

        if (!user) {
            throw new Error('User not found');
        }
        await BasketItem.delete({
            user
        });
    }

    async getStats(): Promise<GetBasketStatsResponse> {

        const {itemInBasketAvgPrice} = await getConnection()
            .createQueryBuilder()
            .select('AVG(shopItem.price)', 'itemInBasketAvgPrice')
            .from(BasketItem, 'basketItem')
            .leftJoinAndSelect('basketItem.shopItem', 'shopItem')
            .getRawOne();

        const allItemsInBasket = await this.getAllForAdmin();

        const baskets: {
            [userId: number]: number
        } = {};

        for (const oneItemInBasket of allItemsInBasket) {
            baskets[oneItemInBasket.user.id] = baskets[oneItemInBasket.user.id] || 0;

            baskets[oneItemInBasket.user.id] += oneItemInBasket.shopItem.price * oneItemInBasket.count * 1.23;
        }

        const basketValues = Object.values(baskets);

        const basketAvgTotalPrice = basketValues.reduce((prev, curr) => prev + curr, 0) / basketValues.length;

            return {
                itemInBasketAvgPrice,
                basketAvgTotalPrice
            }
    }
}
