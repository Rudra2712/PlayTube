import { toast as reactToastify } from "react-toastify";

// Keep track of active toasts to prevent duplicates
const activeToasts = new Set();

// Default options for all toasts
const defaultOptions = {
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  position: "bottom-right",
};

// Create a wrapper to prevent duplicate toasts
const createToast = (type, message, options = {}) => {
  // Create a unique key for this toast
  const toastKey = `${type}-${message}`;

  // If this toast is already active, don't show it again
  if (activeToasts.has(toastKey)) {
    return;
  }

  // Add to active toasts
  activeToasts.add(toastKey);

  // Show the toast
  const toastId = reactToastify[type](message, {
    ...defaultOptions,
    ...options,
    onClose: () => {
      // Remove from active toasts when closed
      activeToasts.delete(toastKey);
      if (options.onClose) {
        options.onClose();
      }
    },
  });

  return toastId;
};

// Export toast methods
export const toast = {
  success: (message, options) => createToast("success", message, options),
  error: (message, options) => createToast("error", message, options),
  info: (message, options) => createToast("info", message, options),
  warning: (message, options) => createToast("warning", message, options),

  // Method to clear all toasts
  dismiss: (toastId) => {
    if (toastId) {
      reactToastify.dismiss(toastId);
    } else {
      reactToastify.dismiss();
      activeToasts.clear();
    }
  },

  // Method to check if a toast is active
  isActive: (toastId) => reactToastify.isActive(toastId),
};

// Clear all toasts on route change (optional)
export const clearToastsOnRouteChange = () => {
  toast.dismiss();
};

export default toast;
