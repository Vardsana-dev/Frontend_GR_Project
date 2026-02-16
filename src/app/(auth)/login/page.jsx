'use client'

import Image from "next/image"
import React, { useState } from "react"
import bgImage from "../../../../public/csc-items/it_strong_bg.jpg"
import logo from "../../../../public/csc-items/1757302046465.png"
import { useLogin } from "../../../hooks/useLogin"
import LoginForm from "../../../components/screens/login/LoginForm"
import ErrorDialog from "../../../components/screens/login/ErrorDialog"

const LoginPage = () => {
    const { login, loading, error, setError } = useLogin()

    const [formData, setFormData] = useState({
        office: "",
        username: "",
        password: ""
    })

    const apiEndpoints = {
        VTE_OFFICE: process.env.NEXT_PUBLIC_VTE_API,
        PAKZUN_OFFICE: process.env.NEXT_PUBLIC_PAKZUN_API,
        PAKZE_OFFICE: process.env.NEXT_PUBLIC_PAKZE_API,
        DONT_OFFICE: process.env.NEXT_PUBLIC_DONT_API,
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await login({
            office: formData.office,
            username: formData.username,
            password: formData.password,
            apiEndpoints
        })
        if (result.success) {
            window.location.reload()
        }
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Background */}
            <Image
                src={bgImage}
                alt="Background"
                fill
                className="object-cover"
                priority
            />

            {/* Login Card */}
            <div className="absolute inset-0 flex justify-center items-center p-4">
                <div className="
                    w-full max-w-[850px] rounded-2xl overflow-hidden
                    bg-gradient-to-br from-[#c9d8f0] via-[#6898ff] to-[#1b58ff]
                    shadow-[0_8px_40px_rgba(0,0,0,0.15)]
                    flex flex-col md:flex-row
                ">
                    {/* Left - Logo Section */}
                    <div className="
                        md:w-[50%] w-full
                        flex flex-col justify-center items-center
                        p-8 md:p-12
                        border-b md:border-b-0 md:border-r border-white/30
                    ">
                        <Image
                            src={logo}
                            alt="CSC Logo"
                            width={360}
                        />
                    </div>

                    {/* Right - Form Section */}
                    <div className="md:w-[50%] w-full p-8 md:p-10 flex flex-col justify-center">
                        <h1 className="text-center text-3xl md:text-4xl md:mb-16 font-bold text-white mb-8 tracking-wide">
                            IT-STRONG
                        </h1>

                        <LoginForm
                            formData={formData}
                            setFormData={setFormData}
                            handleSubmit={handleSubmit}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>

            <ErrorDialog error={error} setError={setError} />
        </div>
    )
}

export default LoginPage
