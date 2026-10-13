// @ts-nocheck
import React from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import { WARNING_MESSAGES } from '@/constants';

export default function WarningDialog({ open, onClose }) {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{WARNING_MESSAGES.TITILE}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {WARNING_MESSAGES.COMING_SOON}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => onClose(false)}>
                        ຕົກລົງ
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
