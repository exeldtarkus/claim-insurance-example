import Swal from "sweetalert2";

type AlertOptions = {
  title: string;
  text?: string;
  icon?: "success" | "error" | "warning" | "info" | "question";
  confirmButtonText?: string;
  onClose?: () => void;
};

export function showAlert({
  title,
  text = "",
  icon = "info",
  confirmButtonText = "Close",
  onClose,
}: AlertOptions) {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
  }).then(() => {
    if (onClose) onClose();
  });
}