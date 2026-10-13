import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface SaveSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaveSuccessDialog({ open, onOpenChange }: SaveSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md text-center flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
          ບັນທຶກສຳເລັດ
        </DialogTitle>
        <DialogDescription className="text-gray-500">
          ລຳດັບຂັ້ນຕອນການອະນຸມັດຂອງທ່ານໄດ້ຖືກບັນທຶກຮຽບຮ້ອຍແລ້ວ.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
