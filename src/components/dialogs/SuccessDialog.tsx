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
import { SUCCESS_MESSAGES } from '@/constants';

export default function SuccessDialog({ open, onClose }) {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{SUCCESS_MESSAGES.REQUEST_CREATE.TITLE}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {SUCCESS_MESSAGES.REQUEST_CREATE.DESCRIPTION}
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
