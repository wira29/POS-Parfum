import { useApiClient } from "@/core/helpers/ApiClient"
import { Toaster } from "@/core/helpers/BaseAlert"
import { formatNum } from "@/core/helpers/FormatNumber"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"

export const ProductShow = () => {

    const {id} = useParams()
    const apiClient = useApiClient()
    const navigate = useNavigate()
    const [product, setProduct] = useState<{[key:string]:any}>({})

    const getProduct = () => {
        apiClient.get('products/'+id).then(res => {
            setProduct(res.data.data)
            console.log({product : res.data.data})
        }).catch(err => {
            Toaster('error', err.response.data.message)
            navigate('/products')
        })
    }

    useEffect(() => {
        getProduct()
    }, [id])

    return (
        <>
            <Breadcrumb title="Produk Detail" desc="Detail produk yang ada pada toko anda" button={<Link to="/products" className="btn btn-primary mt-2"><i className="ti ti-arrow-left"></i> kembali</Link>} />
            <div className="row">
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <img src="https://placehold.co/200x200" alt="" className="img-fluid w-100 rounded mb-2" />
                            <h2 className="fw-bolder">{product.name}</h2>
                            <p>Tipe unit : {product.unit_type}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="mb-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive rounded">
                                    <table className="table table-striped table-bordered align-middle rounded overflow-hidden">
                                        <thead>
                                            <tr>
                                                <th className="bg-primary text-white py-2">Kategori</th>
                                                <th className="bg-primary text-white py-2">Varian</th>
                                                <th className="bg-primary text-white py-2">Material</th>
                                                <th className="bg-primary text-white py-2">Unit</th>
                                                <th className="bg-primary text-white py-2">Kapasitas</th>
                                                <th className="bg-primary text-white py-2">Berat</th>
                                                <th className="bg-primary text-white py-2">Kekentalan</th>
                                                <th className="bg-primary text-white py-2">Harga</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                product?.details?.length
                                                ?  product.details.map((detail:{[key:string]:any}, index:number) => (
                                                    <tr key={index}>
                                                        <td className="text-nowrap">{detail.category_id}</td>
                                                        <td className="text-nowrap">{detail.varian?.name}</td>
                                                        <td className="text-nowrap">{detail.material}</td>
                                                        <td className="text-nowrap">{detail.unit}</td>
                                                        <td className="text-nowrap">{formatNum(detail.capacity, true)}</td>
                                                        <td className="text-nowrap">{formatNum(detail.weight, true)}</td>
                                                        <td className="text-nowrap">{formatNum(detail.density, true)}</td>
                                                        <td className="text-nowrap">Rp {formatNum(detail.price, true)}</td>
                                                    </tr>
                                                ))
                                                : <tr><th colSpan={8} className="text-center text-muted">-- tidak ada detail produk --</th></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}