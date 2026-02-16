'use client'

import React from "react"
import { Input, Label, Button } from "@/components"

const LoginForm = ({ formData, setFormData, handleSubmit, loading }) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-5 text-blue-900">

            <div>
                <Label className={'text-white'}>ຊື່ພະນັກງານ</Label>
                <Input
                    type="text"
                    className="bg-transparent text-white placeholder-white/50 border-white focus:!border-white focus:!ring-white/50 focus-visible:!border-white focus-visible:!ring-white/50"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
            </div>

            <div className="md:mt-10">
                <Label className={'text-white'}>ລະຫັດພະນັກງານ</Label>
                <Input
                    type="password"
                    className="bg-transparent text-white placeholder-white/50 border-white focus:!border-white focus:!ring-white/50 focus-visible:!border-white focus-visible:!ring-white/50"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <div className="flex justify-end mt-1.5">
                    <span className="text-xs text-white cursor-pointer hover:text-gray-200 transition-colors">
                        ລືມລະຫັດຜ່ານ?
                    </span>
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-blue-900 hover:bg-blue-800 hover:text-white font-semibold mt-2 md:mt-6"
            >
                {loading ? "ກຳລັງເຂົ້າ..." : "ເຂົ້າສູ່ລະບົບ"}
            </Button>
        </form>
    )
}

export default LoginForm
