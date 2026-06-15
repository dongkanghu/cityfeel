import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose: () => void;
};

export function Modal({
  open,
  title,
  children,
  confirmText = "确认",
  cancelText = "取消",
  onConfirm,
  onClose
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-end bg-ink/30 p-3 backdrop-blur-sm sm:place-items-center">
      <div className="w-full max-w-[430px] rounded-[1.6rem] border border-line bg-white p-4 shadow-lift">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-black text-ink">{title}</h2>
          <button
            className="grid h-9 w-9 place-items-center rounded-full bg-cream text-muted"
            onClick={onClose}
            aria-label="关闭弹窗"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="text-sm text-muted">{children}</div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
