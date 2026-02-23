import Swal, { SweetAlertIcon, SweetAlertPosition, SweetAlertTheme } from "sweetalert2";

interface SweetAlertProps {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  theme?: SweetAlertTheme;
  confirmButtonText?: string;
  options?: {
    animation?: boolean;
    timer?: number;
    position?: SweetAlertPosition;
    draggable?: boolean;
  };
}

const SweetAlert = async ({
  title = "",
  text = "",
  icon = "success",
  theme = "auto",
  confirmButtonText = "",
  options = {},
}: SweetAlertProps) => {
  return await Swal.fire({
    title,
    text,
    icon,
    theme,
    confirmButtonText,
    timer: options.timer,
    position: options.position,
    animation: options.animation,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
};

export default SweetAlert;
