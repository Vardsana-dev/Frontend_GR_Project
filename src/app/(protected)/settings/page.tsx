"use client"

import { useState } from 'react'
import { getUser } from '@/lib/auth'
import SettingsSidebar from '@/components/screens/setting/SettingsSidebar'
import ProfilePanel from '@/components/screens/setting/ProfilePanel'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const user = getUser()

    return (
        <div className="flex rounded-2xl overflow-hidden shadow-lg min-h-150">
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} />

            <div className="flex-1 bg-primary text-white p-10 flex flex-col gap-7">
                {activeTab === 'profile' && <ProfilePanel user={user} />}
                {/* {activeTab === 'password' && <PasswordPanel />} */}
            </div>
        </div>
    )
}
