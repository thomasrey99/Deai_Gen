import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default async function ModalAlert(type = "success", text) {
    return await Swal.fire({
        position: 'top-end',
        icon: type,
        title: text,
        showConfirmButton: false,
        timer: 5000,
        background: '#1f2937',
        color: '#f9fafb',
        iconColor: type === 'success' ? '#4f46e5' : '#ef4444',
        toast: true,
        customClass: {
            popup: 'rounded-lg shadow-lg px-4 py-3 text-sm',
        },
    });
}
