import { RoleList } from "@/core/stores/AuthStore";

type UserType = {
    name: string,
    email: string,
    password: string,
    role: RoleList
}

export const users: UserType[] = [
    {
        name: 'warehouse',
        email: 'warehouse@gmail.com',
        password: 'password',
        role: 'warehouse'
    },
    {
        name: 'owner',
        email: 'owner@gmail.com',
        password: 'password',
        role: 'owner'
    },
];
