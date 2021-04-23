import { v4 as uuidv4 } from 'uuid';

import UserDTO from '../models/dto/UserDTO';
import User from '../models/types/User';

import API from './API';
import AuthAPI from './AuthAPI';

class UserAPI extends API<User> {
    constructor() {
        super("users");
    }

    public getUsers(): Promise<User[]> {
        return super.getRecords();
    };

    private getRecordPath(email: string): string {
        return (email.split("@")[0]).split(".").join("_");
    }

    public getUser(email: string): Promise<User> {
        return super.getRecord(this.getRecordPath(email));
    };

    public createUser(dto: UserDTO): Promise<User> {
        return new Promise((resolve, reject) => {
            const userID = uuidv4();

            const newUser: User = {
                id: userID,
                ...dto,
                displayName: dto.firstName + " " + dto.lastName,
                initials: ((dto.firstName).charAt(0).toUpperCase() + (dto.lastName).charAt(0)).toUpperCase()
            };

            AuthAPI.signup(dto.email, "D3f@ult!")
            .then(response => {
                return super.create(this.getRecordPath(dto.email), newUser);
            })
            .then(response => {
                resolve(newUser);
            })
            .catch(error => reject(error));
        });
    };

    public updateUser(user: User): Promise<User> {
        const u: User = {
            ...user,
            displayName: user.firstName + " " + user.lastName,
            initials: ((user.firstName).charAt(0).toUpperCase() + (user.lastName).charAt(0)).toUpperCase()
        }

        return super.update(this.getRecordPath(user.email), u);
    };

    public deleteUser(email: string): Promise<string> {
        return super.delete(this.getRecordPath(email))
            .then(() => email);
    };
};

export default new UserAPI();