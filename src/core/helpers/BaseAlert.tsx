import Swal, { SweetAlertIcon } from 'sweetalert2'

export const Toast = (icon: SweetAlertIcon, text: string|HTMLElement) => {
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: icon,
        title: text
    })
}
export const Toaster = (icon: SweetAlertIcon, text: string|HTMLElement) => {
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: icon,
        title: text
    })
}