// @ts-nocheck
"use client"

import { User, Pencil } from 'lucide-react'
import { Button, Separator } from '@/components'

const INFO_ROWS = (user) => [
    { label: 'ລະຫັດພະນັກງານ', value: user?.usercode },
    { label: 'ຊື່ ແລະ ນາມສະກຸນ', value: user?.username },
    { label: 'ຊື່ຫຼີ້ນ', value: user?.shortname },
    { label: 'ອີເມວ', value: user?.email },
    { label: 'ບົດບາດ', value: user?.role },
    { label: 'ພະແນກ', value: user?.departmentmodel?.departmentname },
    { label: 'ຕໍາແໜ່ງ', value: user?.positionmodel?.positionname },
    { label: 'ສະຖານທີ່', value: user?.branchmodel?.branchname },
]

export default function ProfilePanel({ user }) {
    return (
        <>
            <h2 className="text-xl font-bold text-start tracking-wide">ຂໍ້ມູນສ່ວນຕົວ</h2>

            {/* User header row */}
            {/* <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-white/60 flex items-center justify-center bg-white/10 shrink-0">
                    <User className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
                <span className="text-base font-semibold flex-1">{user?.username}</span>
            </div> */}

            <Separator className="bg-white/20" />

            {/* Info rows */}
            <div className="flex flex-col gap-5">
                {INFO_ROWS(user).map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-6">
                        <span className="w-44 text-blue-200 text-sm shrink-0">{label}</span>
                        <span className="text-white text-sm">{value || '-'}</span>
                    </div>
                ))}
            </div>
        </>
    )
}
