import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import cn from "classnames";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  leftButtonClassName?: string;
  rightButtonClassName?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  leftButtonClassName,
  rightButtonClassName
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="flex flex-col items-center gap-2 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center py-4">
          {description}
        </DialogDescription>
        <DialogFooter className="sm:justify-center">
          <Button
            variant="secondary"
            className={cn(leftButtonClassName,"border-2 hover:border-2")}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(rightButtonClassName,)}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
