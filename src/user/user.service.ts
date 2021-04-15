import { Injectable } from "@nestjs/common";
import { RegisterUserResponse } from "src/interfaces/user";
import { hashPwd } from "src/utils/hash-pwd";
import { RegisterDto } from "./dto/register.dto";
import { User } from "./user.entity";

@Injectable()
export class UserService {

    filter(user: User): RegisterUserResponse {
        const {id, email} = user;
        return {id, email};
    }

    async register(newUser: RegisterDto): Promise<RegisterUserResponse> {
        const user = new User();
        user.email = newUser.email;
        user.pwdHash = hashPwd(newUser.pwd);
        await user.save();

        return this.filter(user);
    }

    async getOneUser(id: number): Promise<User> {
        return await User.findOne(id);
    }

}