'use client'

import React, { useState } from 'react'
import loginImage from "../../../../public/csc-items/csc_login_image.jpeg"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Input,
    Label,
    Button,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components'
import { setAuthCookie } from '@/lib/auth'

const LoginPage = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [formData, setFormData] = useState({
        office: '',
        username: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showErrorDialog, setShowErrorDialog] = useState(false)

    React.useEffect(() => {
        setIsClient(true)
    }, [])

    // API endpoints mapping
    const apiEndpoints = {
        VTE_OFFICE: process.env.NEXT_PUBLIC_VTE_API,
        PAKZUN_OFFICE: process.env.NEXT_PUBLIC_PAKZUN_API,
        PAKZE_OFFICE: process.env.NEXT_PUBLIC_PAKZE_API
    }

    // Function to translate error messages to Lao
    const translateErrorMessage = (message) => {
        if (!message) return 'ເກີດຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບ'
        
        const errorTranslations = {
            'This user can not login, because username or password is not active.': 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
            'Invalid username or password': 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
            'User not found': 'ບໍ່ພົບຜູ້ໃຊ້',
            'Account is disabled': 'ບັນຊີຖືກປິດການໃຊ້ງານ',
            'Account is locked': 'ບັນຊີຖືກລ໋ອກ',
            'Password expired': 'ລະຫັດຜ່ານໝົດອາຍຸ',
            'Too many failed attempts': 'ພະຍາຍາມເຂົ້າສູ່ລະບົບຫຼາຍເກີນໄປ',
            'Network error': 'ຂໍ້ຜິດພາດເຄືອຂ່າຍ',
            'Server error': 'ຂໍ້ຜິດພາດເຊີເວີ',
            'Connection timeout': 'ເວລາເຊື່ອມຕໍ່ໝົດອາຍຸ',
            'Unauthorized': 'ບໍ່ມີສິດເຂົ້າເຖິງ',
            'Forbidden': 'ຫ້າມເຂົ້າເຖິງ',
            'Not found': 'ບໍ່ພົບຂໍ້ມູນ',
            'Internal server error': 'ຂໍ້ຜິດພາດພາຍໃນເຊີເວີ',
            'Bad request': 'ຄຳຮ້ອງຂໍບໍ່ຖືກຕ້ອງ',
            'Service unavailable': 'ບໍລິການບໍ່ພ້ອງໃຊ້ງານ'
        }

        // Check for exact match first
        if (errorTranslations[message]) {
            return errorTranslations[message]
        }

        // Check for partial matches (case insensitive)
        const lowerMessage = message.toLowerCase()
        for (const [english, lao] of Object.entries(errorTranslations)) {
            if (lowerMessage.includes(english.toLowerCase())) {
                return lao
            }
        }

        // If no translation found, return the original message
        return message
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // Clear error when user starts typing
        if (error) {
            setError('')
            setShowErrorDialog(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setShowErrorDialog(false)
        setLoading(true)

        console.log('🚀 Starting login process...')
        console.log('📋 Form Data:', formData)

        try {
            // Validate form
            if (!formData.office || !formData.username || !formData.password) {
                throw new Error('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ')
            }

            const selectedApiUrl = apiEndpoints[formData.office]
            
            if (!selectedApiUrl) {
                throw new Error('ກະລຸນາເລືອກສາຂາ')
            }

            // Prepare login data
            const loginData = {
                username: formData.username,
                password: formData.password
            }
            // console.log('📤 Login Data (without password):', { username: loginData.username, password: '***' })

            // Call login API
            const apiEndpoint = `${selectedApiUrl}/api/csmstrightuser/loginSystem`
            
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            })

            const result = await response.json()

            if (!response.ok) {
                // Translate error message to Lao
                const translatedMessage = translateErrorMessage(result.message)
                throw new Error(translatedMessage)
            }

            // console.log('✅ Login successful!')
            
            // Extract token and user data from data_id
            const token = result.data_id?.token
            const userData = result.data_id
            
            // console.log('🎫 Token received:', token ? 'Yes' : 'No')
            // console.log('👤 User data received:', userData ? 'Yes' : 'No')
            // console.log('🎫 Token value:', token ? 'Token exists' : 'No token')
            // console.log('👤 User data:', userData)

            // Store user data and API info in localStorage and cookies
            const userDataToStore = {
                token: token,
                user: userData,
                selectedOffice: formData.office,
                selectedApiUrl: selectedApiUrl,
                loginTime: new Date().toISOString()
            }

            // console.log('💾 Storing user data:', {
            //     ...userDataToStore,
            //     token: userDataToStore.token ? 'Token exists' : 'No token',
            //     user: userDataToStore.user ? 'User data exists' : 'No user data'
            // })

            // Set cookies only (no localStorage needed)
            setAuthCookie(userDataToStore.token, userDataToStore)
            // Refresh page to trigger middleware redirect
            window.location.reload()

        } catch (err) {
            // console.log('�� Login error caught:', err)
            // console.log('💥 Error message:', err.message)
            // console.log('💥 Error stack:', err.stack)
            
            // Translate error message if it's not already in Lao
            const translatedError = translateErrorMessage(err.message)
            // console.log('🌐 Translated error:', translatedError)
            
            setError(translatedError)
            setShowErrorDialog(true)
        } finally {
            // console.log('🏁 Login process finished')
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 overflow-hidden">
            <div className="w-full max-w-md bg-white rounded-lg shadow overflow-hidden md:flex md:max-w-2xl">
                {/* Image Section */}
                <div className="hidden md:block md:w-1/2">
                    <Image
                        // src="/csc-items/csc_login_image.jpeg"
                        src={loginImage}
                        alt="Login illustration"
                        className="object-cover h-full"
                        priority
                    />
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center">
                    <div className="w-full">
                        <h1 className="text-lg md:text-2xl text-center font-bold mb-6">ເຂົ້າສູ່ລະບົບ</h1>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Office Selection */}
                            <div>
                                <Label className="mb-2 block">ສາຂາຜູ້ໃຊ້</Label>
                                {isClient && (
                                    <Select 
                                        value={formData.office} 
                                        onValueChange={(value) => handleInputChange('office', value)}
                                    >
                                        <SelectTrigger className="w-full h-10">
                                            <SelectValue placeholder="ເລືອກສາຂາ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="VTE_OFFICE">ສາຂາວຽງຈັນ</SelectItem>
                                            <SelectItem value="PAKZUN_OFFICE">ສາຂາປາກຊັນ</SelectItem>
                                            <SelectItem value="PAKZE_OFFICE">ສາຂາປາກເຊ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            {/* Username Field */}
                            <div>
                                <Label className="mb-2 block">ໄອດີພະນັກງານ</Label>
                                <Input 
                                    type="text" 
                                    placeholder="ປ້ອນໄອດີ" 
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <Label className="mb-2 block">ລະຫັດ</Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="ປ້ອນລະຫັດ"
                                        className="h-10 pr-10 px-3 text-base"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#999] hover:text-[#777]"
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16" aria-hidden>
                                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                                <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16" aria-hidden>
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full mt-4"
                                disabled={loading}
                            >
                                {loading ? 'ກຳລັງເຂົ້າສູ່ລະບົບ...' : 'ເຂົ້າສູ່ລະບົບ'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Error Alert Dialog */}
            <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ເກີດຂໍ້ຜິດພາດ</AlertDialogTitle>
                        <AlertDialogDescription>
                            {error}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction 
                            onClick={() => setShowErrorDialog(false)}
                        >
                            ຕົກລົງ
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default LoginPage

// Development by: Nengxiong Wangtouaxiong