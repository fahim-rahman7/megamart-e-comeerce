import React from "react";



const VARIANT_CLASSES = {
  primary:
    "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white border-transparent",
  secondary:
    "bg-white hover:bg-gray-50 text-gray-800 border-gray-300 shadow-sm",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-800 border-transparent",
  danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border-transparent",
};

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 border rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";



const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  onClick,
  children,
  ...rest
}) => {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      className={`${base} ${variantClass} ${sizeClass} ${fullWidth ? "w-full" : "inline-block"} ${className}`}
      {...rest}
    >
      
      {children}
    </button>
  );
};

export default Button;



