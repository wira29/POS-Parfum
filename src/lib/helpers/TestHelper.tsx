import { Button } from '@/components/Button'
import { HiBookmark } from "react-icons/hi";

export const numberBodyTemplate = (rowData, column) => {
    return column.rowIndex + 1;
};
export const actionBodyTemplate = (rowData, column) => {
    return (
        <div className='flex gap-2 items-center'>
            <Button color='primary' type='button'><HiBookmark/></Button>
        </div>
    )
}