// @ts-nocheck
"use client"

import { User, Lock, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components'
import { useLogout } from '@/hooks/useLogout'

const NAV_ITEMS = [
    { key: 'profile', label: 'ຂໍ້ມູນສ່ວນຕົວ', icon: User },
    { key: 'logout', label: 'ອອກຈາກລະບົບ', icon: LogOut },
]

export default function SettingsSidebar({ activeTab, onTabChange, user }) {
    const { logout: handleLogout, loading: isLoggingOut } = useLogout()

    const handleClick = (key) => {
        if (key === 'logout') { handleLogout(); return }
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
                {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
                    const isLogout = key === 'logout'
                    return (
                        <Button
                            key={key}
                            variant={activeTab === key && !isLogout ? 'default' : 'outline'}
                            className={`w-full justify-start gap-3 ${isLogout ? 'text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200' : ''}`}
                            disabled={isLogout && isLoggingOut}
                            onClick={() => handleClick(key)}
                        >
                            {isLogout && isLoggingOut ? (
                                <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                            ) : (
                                <Icon className="w-4 h-4 shrink-0" />
                            )}
                            <span className="flex-1 text-left">
                                {isLogout && isLoggingOut ? 'ກຳລັງອອກ...' : label}
                            </span>
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
