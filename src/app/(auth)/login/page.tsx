'use client'

import Image from "next/image"
import React, { useState } from "react"
import bgImage from "../../../../public/csc-items/bg_gr.jpg"
import logo from "../../../../public/csc-items/1757302046465.png"
import { useLogin } from "../../../hooks/useLogin"
import LoginForm from "../../../components/screens/login/LoginForm"
import ErrorDialog from "../../../components/screens/login/ErrorDialog"

const LoginPage = () => {
    const { login, loading, error, setError } = useLogin()

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await login({
            username: formData.username,
            password: formData.password,
        })
        if (result.success) {
            window.location.href = '/dashboard'
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
                    w-full max-w-[850px] rounded-3xl overflow-hidden
                    bg-gradient-to-r from-[#d9e8fb] to-[#5681ff]
                    shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-white/20
                    flex flex-col md:flex-row
                ">
                    {/* Left - Logo Section */}
                    <div className="
                        md:w-[50%] w-full
                        flex flex-col justify-center items-center
                        p-8 md:p-12
                    ">
                        <Image
                            src={logo}
                            alt="CSC Logo"
                            width={360}
                        />
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px bg-white/40 my-10"></div>
                    <div className="block md:hidden h-px w-full bg-white/40 mx-auto max-w-[80%]"></div>

                    {/* Right - Form Section */}
                    <div className="md:w-[50%] w-full p-8 md:p-12 flex flex-col justify-center">
                        <h1 className="text-center text-4xl md:text-5xl font-black text-white mb-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] tracking-wide">
                            ລະບົບຮັບສິນຄ້າ
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
