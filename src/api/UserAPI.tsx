import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import UserDTO from '../models/dto/UserDTO';
import User from '../models/types/User';

import { API_KEY } from '../config';

const path = "users/";
const extension = ".json";

class UserAPI {
    public static getUsers(): Promise<User[]> {
        return axios.get(path + extension)
            .then(response => {
                const data: any = response.data || {};

                return Object.keys(data).map(key =>
                    ({...data[key]} as User));
            });
    };

    public static getRecordPath(email: string): string {
        return (email.split("@")[0]).split(".").join("_");
    }

    public static getUser(email: string): Promise<any> {
        return axios.get(path + UserAPI.getRecordPath(email) + extension)
        .then(response => {
            if (!Boolean(response.data)) {
                return Promise.reject({
                    response:{
                        data: {
                            error: {
                                message: "EMAIL_NOT_FOUND"
                            }
                        }
                    }
                });
            } else {
                const user: User = {...response.data}
                return user;
            }
        });
    };

    public static createUser(dto: UserDTO): Promise<User> {
        return new Promise((resolve, reject) => {
            const userID = uuidv4();

            const newUser: User = {
                id: userID,
                ...dto,
                displayName: dto.firstName + " " + dto.lastName,
                initials: ((dto.firstName).charAt(0).toUpperCase() + (dto.lastName).charAt(0)).toUpperCase()
            };

            axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY,
                    { email: dto.email, password: "D3f@ult!", role: dto.role, returnSecureToken: true}
            )
            .then(() => {
                return axios.put(path + UserAPI.getRecordPath(dto.email) + extension, newUser)
            })
            .then(response => {
                resolve(newUser);
            })
            .catch(error => reject(error));
        });
    };

    public static updateUser(user: User): Promise<User> {
        return axios.put(path + UserAPI.getRecordPath(user.email) + extension, {
            ...user,
            displayName: user.firstName + " " + user.lastName,
            initials: ((user.firstName).charAt(0).toUpperCase() + (user.lastName).charAt(0)).toUpperCase()
        }).then(response => user);
    };

    public static deleteUser(email: string): Promise<string> {
        return axios.delete(path + UserAPI.getRecordPath(email) + extension)
            .then(response => email);
    };
};

export default UserAPI;