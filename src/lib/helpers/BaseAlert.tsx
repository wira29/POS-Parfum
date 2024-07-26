import Swal from 'sweetalert2'

type TSwalIcon = "success"|"warning"|"error"|"info"|"question"

export const Toast = (icon: TSwalIcon, text: string|HTMLElement) => {
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