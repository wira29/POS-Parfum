import { IconType } from "react-icons"

export type TNavItem = {
    title: string,
    navItem: TNavList[]
}

export type TNavList = {
    label: string,
    icon: IconType,
    url: string,
    children?: TNavListChild[]
}

export type TNavListChild = {
    label: string,
    url: string,
}