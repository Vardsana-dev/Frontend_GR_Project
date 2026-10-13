import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SaveErrorDialogProps {
  error: string | null;
  onClose: () => void;
}

export function SaveErrorDialog({ error, onClose }: SaveErrorDialogProps) {
  return (
    <Dialog open={!!error} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md text-center flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-red-600">!</span>
        </div>
        <DialogTitle className="text-xl font-bold text-red-600 mb-2">
          ຜິດພາດ
        </DialogTitle>
        <DialogDescription className="text-red-500 font-medium">
          {error}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
