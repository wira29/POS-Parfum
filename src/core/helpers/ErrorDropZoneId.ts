import { filesize } from 'filesize'
import { FileError } from 'react-dropzone'

export const errorCodeListTrans = {
    "file-too-large": 'Ukuran file tidak boleh lebih besar dari ',
    "too-many-files": 'Jumlah file terlalu banyak',
    "file-invalid-type": 'Jenis file tidak sesuai'
}

export const handlerTranslateDropzone = (err:FileError) => {
    const {code, message} = err

    if(code == 'file-too-large') return errorCodeListTrans[code]+filesize(message.match(/\d/g)?.join('') || 0, {base: 2}).replace('MiB', 'MB')
    return errorCodeListTrans[code as keyof typeof errorCodeListTrans];
}