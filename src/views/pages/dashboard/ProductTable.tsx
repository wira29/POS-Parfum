import { useApiClient } from '@/core/helpers/ApiClient'
import { useEffect, useState } from 'react'

export const ProductTable = () => {

    const apiClient = useApiClient()
    const [products, setProducts] = useState<{[key:string]:any}[]>([])

    const getProducts = () => {
        apiClient.get('/products?limit=5').then(res => {
            setProducts(res.data.data)
        }).catch(() => {
            setProducts([])
        })
    }

    useEffect(() => {
        getProducts()
    }, [])

    return (
        <div className='card'>
            <div className="card-header">
                <h5 className='mb-0'>Produk Terbaru</h5>
            </div>
            <div className="card-body">
                <table className='table'>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Produk</th>
                            <th>Kategori</th>
                            <th>Varian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.length
                            ? products.map((product, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{product.name}</td>
                                    <td><span className='badge bg-light-warning text-warning'>{product.category?.name ?? "-"}</span></td>
                                    <td>
                                        <div className='d-flex gap-2'>
                                            {
                                                product.variants?.length
                                                ? product.variants.map((variant:any, v_index:number) => (
                                                    <span key={v_index} className='badge bg-light-primary text-primary'>{variant.name}</span>
                                                ))
                                                : <span className='badge bg-light-primary text-primary'>-</span>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))
                            : <tr><td colSpan={4}>Tidak ada data</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}