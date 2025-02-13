export const formatNum = (number:string|number, isNumber = false):number|string => {
    
    if(number === '-' || number == '0') {
        return number
    } else if(number) {
        if(typeof number == 'number') number = number.toString()
        number = ( isNumber ? parseFloat(number).toFixed(2) : number.toString() )
        var negate = (number.charAt(0) == '-' ? '-' : '');
        if(isNumber) {
            var angka = number.replace(/[^.\d]/g, '').toString()
            var split = angka.split('.')
            var intl = new Intl.NumberFormat('id-ID').format(parseInt(split[0]))
            var dec = split[1] && split[1] != '00' ? ','+split[1] : ''
        } else {
            var angka = number.replace(/[^,\d]/g, '').toString()
            var split = angka.split(',')
            var intl = new Intl.NumberFormat('id-ID').format(parseInt(split[0]))
            var dec = split[1] != undefined && split[1] != '00' ? ','+split[1] : ''
        }

        if(intl === 'NaN') intl = ''

        if(negate+intl+dec == '-0') return 0
        return negate+intl+dec
    } else return '';
}

export const unformatNum = (number:number|string):number => {
    if(number) {
        number = number.toString()
        var negate = (number.charAt(0) == '-' ? '-' : '');
        var angka = number.replace(/[^,\d]/g, '').toString()
        var angka = angka.replace(',', '.').toString()
        var angka_string = negate+angka

        return parseFloat(angka_string);
    } else return 0;
}