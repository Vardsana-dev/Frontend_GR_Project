// @ts-nocheck
"use client"

import { User, Lock, LogOut } from 'lucide-react'
import { Button } from '@/components'
import { logout } from '@/lib/auth'

const NAV_ITEMS = [
    { key: 'profile', label: 'ຂໍ້ມູນສ່ວນຕົວ', icon: User },
    { key: 'logout', label: 'ອອກຈາກລະບົບ', icon: LogOut },
]

export default function SettingsSidebar({ activeTab, onTabChange, user }) {
    const handleClick = (key) => {
        if (key === 'logout') { logout(); return }
        onTabChange(key)
    }

    return (
        <div className="w-64 bg-white flex flex-col border overflow-hidden items-center pt-10 pb-8 gap-8 shrink-0">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full border-[3px] border-primary flex items-center justify-center">
                    <User className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>
                <span className="text-primary font-semibold text-sm">
                    {user?.shortname || user?.username}
                </span>
            </div>

            {/* Nav */}
            <div className="w-full px-5 flex flex-col gap-2">
                {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
                    <Button
                        key={key}
                        variant={activeTab === key && key !== 'logout' ? 'default' : 'outline'}
                        className="w-full justify-start gap-3"
                        onClick={() => handleClick(key)}
                    >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1 text-left">{label}</span>
                    </Button>
                ))}
            </div>
        </div>
    )
}
