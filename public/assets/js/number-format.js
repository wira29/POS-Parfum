function formatNum(number, isNumber = false) {
    if(number) {
        number = ( isNumber ? parseFloat(number).toFixed(2) : number.toString() )
        var negate = (number.charAt(0) == '-' ? '-' : '');
        if(isNumber) {
            var angka = number.replace(/[^.\d]/g, '').toString()
            var split = angka.split('.')
            var intl = new Intl.NumberFormat('id-ID').format(split[0])
            var dec = split[1] && split[1] != '00' ? ','+split[1] : ''
        } else {
            var angka = number.replace(/[^,\d]/g, '').toString()
            var split = angka.split(',')
            var intl = new Intl.NumberFormat('id-ID').format(split[0])
            var dec = split[1] != undefined && split[1] != '00' ? ','+split[1] : ''
        }

        if(negate+intl+dec == '-0') return 0
        return negate+intl+dec
    } else return 0;
}
function unformatNum(number) {
    if(number) {
        number = number.toString()
        var negate = (number.charAt(0) == '-' ? '-' : '');
        var angka = number.replace(/[^,\d]/g, '').toString()
        var angka = angka.replace(',', '.').toString()
        var angka_string = negate+angka

        return parseFloat(angka_string);
    } else return 0;
}