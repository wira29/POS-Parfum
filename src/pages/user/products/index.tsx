import { Button } from "@/components/Button"
import { InputWithIcon } from "@/components/InputWithIcon"
import { product } from '@/lib/data/product'
import { numberBodyTemplate } from '@/lib/helpers/TestHelper'
import { Modal } from "flowbite-react"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { SyntheticEvent, useState } from "react"
import { FaHistory, FaImage } from 'react-icons/fa'
import { HiEye, HiSearch } from 'react-icons/hi'

export const ProductIndex = () => {

    const [pageData, setPageData] = useState({})
    const [search, setSearch] = useState('')
    const [imgLoaded, setImgLoaded] = useState(false)
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [openModalHistory, setOpenModalHistory] = useState(false)

    const arrayFill = Array(7).fill('')

    const actionBodyTemplate = (rowData, column) => {
        return (
            <div className='flex gap-2 items-center'>
                <Button color='light-primary' type='button' onClick={() => setOpenModalHistory(true)}><FaHistory /></Button>
                <Button color='light-primary' type='button' onClick={() => setOpenModalDetail(true)}><HiEye /></Button>
            </div>
        )
    }

    const handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement
        if (name === 'search') setSearch(value)
    }

    return (
        <div className='bg-white p-6 rounded-lg'>
            <div className="flex justify-between items-center">
                <div className='font-bold text-2xl mb-3 text-title'>Produk</div>
                <InputWithIcon settings={{
                    id: 'search',
                    type: 'text',
                    name: 'search',
                    placeholder: 'cari',
                    icon: HiSearch,
                    onInputFn: handleInputChange
                }} />
            </div>
            <DataTable
                value={product}
                paginator rows={10} rowsPerPageOptions={[5, 10, 20, 100]}
                paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
                paginatorClassName="custom-paginator"
                pageLinkSize={4}
                currentPageReportTemplate="showing {first} to {last} of {totalRecords} entries"
                tableClassName='w-full dt-custom' showGridlines stripedRows
                sortField='name' sortOrder={-1}
            >
                <Column field='no' header='No' body={numberBodyTemplate} />
                <Column field='name' header='Nama' />
                <Column field='stock' header='Stok' body={(rowData) => (<span className='bg-gray-300 rounded px-3 py-1 text-title text-sm font-bold'>{rowData.stock}</span>)} />
                <Column field='edit_date' header='Terakhir Diubah' />
                <Column field="" header="Aksi" body={actionBodyTemplate} />
            </DataTable>

            <Modal show={openModalDetail} dismissible onClose={() => setOpenModalDetail(false)}>
                <Modal.Header className="bg-primary-800 py-2 text-white" ><span className="text-white">Detail Produk</span></Modal.Header>
                <Modal.Body className="flex flex-col gap-0 justify-center items-center">
                    <div className="w-[100px] h-[100px]">
                        <div role="status" className={"animate-pulse "+(imgLoaded ? 'hidden' : '')}>
                            <div className="flex items-center justify-center w-[100px] h-[100px] bg-gray-300 rounded dark:bg-gray-700">
                                <FaImage />
                            </div>
                        </div>
                        <img src="https://picsum.photos/200/300" className={"object-cover w-[100px] h-[100px] rounded "+(!imgLoaded ? 'hidden' : '')} alt="gambar produk" onLoad={() => {setImgLoaded(true)}}/>
                    </div>
                    <div className="text-title font-bold text-2xl mt-2">Parfum A</div>
                    <div className='text-desc'>Terakhir diubah pada 09 September 2024</div>
                    <div className="text-subtitle font-semibold">Stok: 10L</div>
                    <div className="text-subtitle text-center mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas iste minus cupiditate mollitia ipsum asperiores tempore nihil quibusdam impedit aut?</div>
                </Modal.Body>
            </Modal>

            <Modal show={openModalHistory} dismissible onClose={() => setOpenModalHistory(false)}>
                <Modal.Header className="bg-primary-800 py-2 text-white" ><span className="text-white">Riwayat Perubahan</span></Modal.Header>
                <Modal.Body className="flex flex-col gap-0 justify-center items-center">
                    <table className="dt-custom w-full">
                        <tbody>
                            {
                                arrayFill.map((data, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <FaHistory className="text-3xl font-bold" />
                                                <div className="flex flex-col justify-center">
                                                    <div className="font-semibold">Terakhir diubah pada</div>
                                                    <div>12 September 2024</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            Stok Awal : 20
                                        </td>
                                        <td>
                                            Stok Akhir : 40
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
        </div>
    )
}