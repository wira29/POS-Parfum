import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import 'primereact/resources/primereact.min.css'
import { product } from '@/lib/data/product'
import { numberBodyTemplate, actionBodyTemplate } from '@/lib/helpers/TestHelper'

export const ProductTable = () => {

    return (
        <div className='bg-white p-6 rounded-lg'>
            <div className='font-bold text-xl mb-3 text-title'>Produk</div>
            <DataTable value={product} tableClassName='w-full dt-custom' >
                <Column field='no' header='No' body={numberBodyTemplate}/>
                <Column field='name' header='Nama'/>
                <Column field='stock' header='Stok' body={(rowData) => (<span className='bg-gray-300 rounded px-3 py-1 text-title text-sm'>{rowData.stock}</span>)}/>
                <Column field="" header="Aksi" body={actionBodyTemplate} />
            </DataTable>
        </div>
    )
}