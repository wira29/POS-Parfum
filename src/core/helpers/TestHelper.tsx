import { Button } from '@/components/Button';
import { HiBookmark } from "react-icons/hi";

export const numberBodyTemplate = (column: any) => {
    return column.rowIndex + 1;
};
export const actionBodyTemplate = () => {
    return (
        <div className='flex gap-2 items-center'>
            <Button color='primary' type='button'><HiBookmark/></Button>
        </div>
    )
}