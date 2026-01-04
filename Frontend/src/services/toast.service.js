import Swal from "sweetalert2";

const TOAST_CONFIG = {
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
};

function toast(icon, title, options = {}) {
  return Swal.fire({
    ...TOAST_CONFIG,
    icon,
    title,
    ...options,
  });
}

async function confirm({
  title = "Are you sure?",
  text = "This cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
} = {}) {
  const res = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return res.isConfirmed;
}

export const toastService = {
  success(message, options) {
    return toast("success", message, options);
  },
  error(message, options) {
    return toast("error", message, options);
  },
  confirm,
};
