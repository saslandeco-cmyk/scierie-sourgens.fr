"use client";

export default function ConfirmButton({
  children,
  className,
  confirmText,
}: {
  children: React.ReactNode;
  className?: string;
  confirmText: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirmText)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
