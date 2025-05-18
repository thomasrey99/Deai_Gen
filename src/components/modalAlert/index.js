import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default async function ModalAlert(type = 'success', text) {
  return await Swal.fire({
    toast: true,
    position: 'top',
    icon: type,
    title: text,
    showConfirmButton: false,
    timer: 4500,
    background: '#f1f5f9', // slate-100
    color: '#0f172a',       // slate-900
    iconColor: type === 'success' ? '#0ea5e9' : '#f43f5e', // sky-500 / rose-500
    customClass: {
      popup: 'rounded-xl shadow-2xl ring-1 ring-black/10 backdrop-blur-sm animate-fade-in',
      title: 'text-sm md:text-base font-semibold tracking-wide px-3 py-2',
    },
    didOpen: (toast) => {
      toast.classList.add('animate__animated', 'animate__fadeInDown');
    }
  });
}
