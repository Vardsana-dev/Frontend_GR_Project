'use client'

import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components'
import { 
    User2, 
    Building, 
    Calendar, 
    MapPin, 
    Clock, 
    Shield,
    Globe,
    CheckCircle,
    XCircle
} from 'lucide-react'

const UserPage = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User2 className="w-10 h-10 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້</h2>
                    <p className="text-slate-500">ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ</p>
                </div>
            </div>
        )
    }

    const userData = user.user || {}
    const loginTime = new Date(user.loginTime).toLocaleString('lo-LA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const getOfficeName = (office) => {
        switch (office) {
            case 'VTE_OFFICE': return 'ສາຂາວຽງຈັນ'
            case 'PAKZUN_OFFICE': return 'ສາຂາປາກຊັນ'
            case 'PAKZE_OFFICE': return 'ສາຂາປາກເຊ'
            case 'DONT_OFFICE': return 'ສາຂາດອນຕິ້ວ'
            default: return office || 'ບໍ່ມີຂໍ້ມູນ'
        }
    }

    return (
        <div>
            <div>
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - User Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Card */}
                        <Card className="border shadow-sm bg-white">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <User2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-900">ຂໍ້ມູນຜູ້ໃຊ້</CardTitle>
                                        <p className="text-sm text-slate-500">ລາຍລະອຽດຂໍ້ມູນສ່ວນຕົວ</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">ຊື່ຜູ້ໃຊ້</label>
                                        <p className="text-lg font-semibold text-slate-900">{userData.USERNAME || 'ບໍ່ມີຂໍ້ມູນ'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">ລະຫັດຜູ້ໃຊ້</label>
                                        {/* <p className="text-lg font-mono font-semibold text-blue-600">{userData.USERCODE || 'ບໍ່ມີຂໍ້ມູນ'}</p> */}
                                        <p className="text-lg font-mono font-semibold text-blue-600">{'******' || 'ບໍ່ມີຂໍ້ມູນ'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">ລະຫັດສາຂາ</label>
                                        <p className="text-lg font-mono font-semibold text-indigo-600">{userData.CODE || 'ບໍ່ມີຂໍ້ມູນ'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">ລຳດັບ</label>
                                        <p className="text-lg font-semibold text-slate-900">#{userData.ROWORDER || 'ບໍ່ມີຂໍ້ມູນ'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status Card */}
                        <Card className="border shadow-sm bg-white">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-900">ສະຖານະບັນຊີ</CardTitle>
                                        <p className="text-sm text-slate-500">ສະຖານະການໃຊ້ງານ</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {userData.CLOSEFLAG === 0 ? (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : (
                                            <XCircle className="w-6 h-6 text-red-500" />
                                        )}
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {userData.CLOSEFLAG === 0 ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}
                                            </p>
                                            <p className="text-sm text-slate-500">ສະຖານະປັດຈຸບັນ</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-slate-900">{userData.CLOSEFLAG}</p>
                                        <p className="text-xs text-slate-500">ລະຫັດສະຖານະ</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - System Info */}
                    <div className="space-y-6">
                        {/* Login Info */}
                        <Card className="border shadow-sm bg-white">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-900">ການເຂົ້າສູ່ລະບົບ</CardTitle>
                                        <p className="text-sm text-slate-500">ຂໍ້ມູນການເຂົ້າສູ່ລະບົບ</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{getOfficeName(user.selectedOffice)}</p>
                                        <p className="text-xs text-slate-500">ສາຂາທີ່ເລືອກ</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{loginTime}</p>
                                        <p className="text-xs text-slate-500">ເວລາເຂົ້າສູ່ລະບົບ</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Connection Info */}
                        <Card className="border shadow-sm bg-white">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-900">ການເຊື່ອມຕໍ່</CardTitle>
                                        <p className="text-sm text-slate-500">ສະຖານະການເຊື່ອມຕໍ່</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">ເຊື່ອມຕໍ່ສຳເລັດ</p>
                                        <p className="text-xs text-slate-500">ສະຖານະການເຊື່ອມຕໍ່</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Building className="w-4 h-4 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{getOfficeName(user.selectedOffice)}</p>
                                        <p className="text-xs text-slate-500">ສາຂາທີ່ເຊື່ອມຕໍ່</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPage