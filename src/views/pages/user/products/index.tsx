import { SyntheticEvent, useEffect, useState } from "react"
import axios from 'axios'
import { InputWithIcon } from "@/views/components/InputWithIcon"
import { HiSearch } from 'react-icons/hi'
import { product } from '@/core/data/product'
import { HiEye } from 'react-icons/hi'
import { FaHistory, FaImage } from 'react-icons/fa'

export const ProductIndex = () => {

    const [pageData, setPageData] = useState({})
    const [search, setSearch] = useState('')
    const [imgLoaded, setImgLoaded] = useState(false)
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [openModalHistory, setOpenModalHistory] = useState(false)

    const arrayFill = Array(7).fill('')

    const handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement
        if (name === 'search') setSearch(value)
    }

    return (
        <div className='bg-white p-6 rounded-lg'>
            <div className="flex justify-between items-center">
                <div className='font-bold text-xl mb-3 text-title'>Produk</div>
                <InputWithIcon settings={{
                    id: 'search',
                    type: 'text',
                    name: 'search',
                    placeholder: 'cari',
                    icon: HiSearch,
                    onInputFn: handleInputChange
                }} />
            </div>
        </div>
    )
}