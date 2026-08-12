import React from "react";

const OrderSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-[fadeIn_0.25s_ease-out]" />

      {/* Modal */}
      <div
        className="
          relative w-full max-w-md
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-[0_25px_80px_rgba(0,0,0,0.25)]
          animate-[modalIn_0.35s_cubic-bezier(0.16,1,0.3,1)]
        "
      >
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute right-4 top-4
            z-10
            flex h-9 w-9
            items-center justify-center
            rounded-full
            text-slate-400
            transition-all duration-200
            hover:bg-slate-100
            hover:text-slate-700
            active:scale-95
            cursor-pointer
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6L18 18" />
          </svg>
        </button>

        <div className="px-7 py-9 sm:px-10 sm:py-10 text-center">

          {/* Success Icon */}
          <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center">

            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />

            {/* Outer ring */}
            <div className="absolute inset-1 rounded-full border-8 border-emerald-50" />

            {/* Icon */}
            <div
              className="
                relative
                flex h-20 w-20 items-center justify-center
                rounded-full
                bg-gradient-to-br from-emerald-400 to-green-600
                shadow-lg shadow-emerald-500/30
              "
            >
              <svg
                className="h-10 w-10 text-white animate-[checkmark_0.5s_ease-out_0.25s_both]"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className="
              inline-flex items-center gap-2
              rounded-full
              bg-emerald-50
              px-3.5 py-1.5
              text-xs font-semibold
              text-emerald-700
              ring-1 ring-inset ring-emerald-200
              mb-4
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Payment Successful
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Order Confirmed!
          </h2>

          {/* Description */}
          <p className="mx-auto mt-3 max-w-sm text-sm sm:text-base leading-relaxed text-slate-500">
            Your order has been placed successfully. We’ll start processing it
            right away.
          </p>

          {/* Divider */}
          <div className="my-7 h-px bg-slate-100" />

          {/* Thank You */}
          <p className="text-sm sm:text-base font-medium text-slate-500">
            Thank you for shopping with us{" "}
            <span className="text-red-500">❤️</span>
          </p>
        </div>

        {/* Bottom decorative glow */}
        <div
          className="
            pointer-events-none
            absolute -bottom-20 left-1/2
            h-40 w-40
            -translate-x-1/2
            rounded-full
            bg-emerald-400/10
            blur-3xl
          "
        />
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes modalIn {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes checkmark {
            from {
              opacity: 0;
              stroke-dasharray: 50;
              stroke-dashoffset: 50;
              transform: scale(0.7);
            }
            to {
              opacity: 1;
              stroke-dasharray: 50;
              stroke-dashoffset: 0;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default OrderSuccessModal;