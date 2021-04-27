import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import UserDTO from '../models/dto/UserDTO';
import User from '../models/types/User';

import API from './API';
import AuthAPI from './AuthAPI';

import Collections from './Collections';

class UserAPI extends API<User> {
    constructor() {
        super(Collections.USERS);
    }

    public getUsers(): Promise<User[]> {
        return super.getRecords();
    }

    public getAccounts(email: string): Promise<User[]> {
        return super.getRecords()
            .then(users => {
                if (!users || users.length < 1) {
                    Promise.reject({status: 400, message: "No record found."});
                }

                return _.orderBy(users.filter(user => user.email === email), ["role"]);
            });
    }

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
                return super.create(userID, newUser);
            })
            .then(response => {
                resolve(newUser);
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.error && 
                    error.response.data.error.message === "EMAIL_EXISTS") {
                    
                    super.create(userID, newUser)
                    .then(response => {
                        resolve(newUser);
                    })
                    .catch(error => reject(error))
                } else {
                    reject(error)
                }
            });
        });
    };

    public updateUser(user: User): Promise<User> {
        const u: User = {
            ...user,
            displayName: user.firstName + " " + user.lastName,
            initials: ((user.firstName).charAt(0).toUpperCase() + (user.lastName).charAt(0)).toUpperCase()
        }

        return super.update(user.id, u);
    };

    public deleteUser(id: string): Promise<string> {
        return super.delete(id)
            .then(() => id);
    };
};

export default new UserAPI();