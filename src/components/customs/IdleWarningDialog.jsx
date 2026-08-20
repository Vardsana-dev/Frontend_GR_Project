"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const IdleWarningDialog = ({
  isOpen,
  onStayLoggedIn,
  onLogoutNow,
  countdown = 30,
}) => {
  const [timeLeft, setTimeLeft] = useState(countdown);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(countdown);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onLogoutNow();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown, onLogoutNow]);

  return (
    <AlertDialog open={isOpen} onOpenChange={() => {}}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            ⚠️ ແຈ້ງເຕືອນເວລາເຊດຊັນຈະໝົດ
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            ທ່ານບໍ່ໄດ້ໃຊ້ງານລະບົບເປັນເວລາ 5 ນາທີແລ້ວ
            <br />
            ລະບົບຈະອອກຈາກລະບົບອັດຕະໂນມັດໃນອີກ{" "}
            <span className="font-bold text-red-600">{timeLeft}</span> ວິນາທີ
            <br />
            <br />
            ຫາກຕ້ອງການໃຊ້ງານຕໍ່ ກະລຸນາກົດ "ໃຊ້ງານຕໍ່"
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <AlertDialogAction onClick={onStayLoggedIn}>
            ໃຊ້ງານຕໍ່
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default IdleWarningDialog;
