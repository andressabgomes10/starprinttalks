import * as React from "react";
import { X } from "lucide-react";
import { Toast, useToast } from "./use-toast";
import { cn } from "./utils";

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  toast: Toast;
}

const ToastComponent = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, toast, ...props }, ref) => {
    const { dismiss } = useToast();

    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
          toast.variant === "destructive"
            ? "border-destructive/50 bg-destructive text-destructive-foreground"
            : "border-border bg-background text-foreground",
          className
        )}
        {...props}
      >
        <div className="grid gap-1">
          {toast.title && (
            <div className="text-sm font-semibold">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm opacity-90">{toast.description}</div>
          )}
        </div>
        <button
          onClick={() => dismiss(toast.id)}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
);

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </div>
  );
}