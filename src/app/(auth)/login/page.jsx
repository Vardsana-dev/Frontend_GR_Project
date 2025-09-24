'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Input,
    Label,
    Button
} from '@/components'

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 overflow-hidden">
            <div className="w-full max-w-md bg-white rounded-lg shadow overflow-hidden md:flex md:max-w-2xl">
                {/* Image Section */}
                <div className="hidden md:block md:w-1/2">
                    <Image
                        src="/csc-items/csc_login_image.jpeg"
                        alt="Login illustration"
                        width={400}
                        height={600}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center">
                    <div className="w-full">
                        <h1 className="text-lg md:text-2xl text-center font-bold mb-6">ເຂົ້າສູ່ລະບົບ</h1>

                        <form className="space-y-4">
                            {/* Office Selection */}
                            <div>
                                <Label className="mb-2 block">ສາຂາຜູ້ໃຊ້</Label>
                                <Select>
                                    <SelectTrigger className="w-full h-10">
                                        <SelectValue placeholder="ເລືອກສາຂາ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VIENTIANE_OFFICE">ສາຂາວຽງຈັນ</SelectItem>
                                        <SelectItem value="PHONZUN_OFFICE">ສາຂາປາກຊັນ</SelectItem>
                                        <SelectItem value="PHONZE_OFFICE">ສາຂາປາກເຊ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Username Field */}
                            <div>
                                <Label className="mb-2 block">ໄອດີພະນັກງານ</Label>
                                <Input type="text" placeholder="ປ້ອນໄອດີ" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <Label className="mb-2 block">ລະຫັດ</Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="ປ້ອນລະຫັດ"
                                        className="h-10 pr-10 px-3 text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#999] hover:text-[#777]"
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
                            >
                                ເຂົ້າສູ່ລະບົບ
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage