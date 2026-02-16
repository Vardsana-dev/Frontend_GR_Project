'use client'

import React from "react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction } from "@/components"

const ErrorDialog = ({ error, setError }) => {
    return (
        <AlertDialog open={!!error} onOpenChange={() => setError("")}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>ເກີດຂໍ້ຜິດພາດ</AlertDialogTitle>
                    <AlertDialogDescription>{error}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setError("")}>ຕົກລົງ</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ErrorDialog