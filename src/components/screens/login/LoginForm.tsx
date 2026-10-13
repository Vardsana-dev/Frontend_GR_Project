// @ts-nocheck
'use client'

import React, { useState } from "react"
import { Input, Label, Button } from "@/components"
import WarningDialog from "@/components/dialogs/WarningDialog"

const LoginForm = ({ formData, setFormData, handleSubmit, loading }) => {

    const [open, setOpen] = useState(false);

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full">

            <div className="space-y-2">
                <Label className="text-white text-sm font-normal">ຊື່ພະນັກງານ</Label>
                <Input
                    type="text"
                    className="bg-transparent text-white placeholder-white/50 border border-white/60 rounded-lg h-10 focus:border-white focus:ring-1 focus:ring-white/50 focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white/50 transition-colors"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label className="text-white text-sm font-normal">ລະຫັດພະນັກງານ</Label>
                <Input
                    type="password"
                    className="bg-transparent text-white placeholder-white/50 border border-white/60 rounded-lg h-10 focus:border-white focus:ring-1 focus:ring-white/50 focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white/50 transition-colors"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-[#0b4b9b] hover:bg-[#f0f4f8] font-bold text-base h-11 mt-8 rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all"
            >
                {loading ? "ກຳລັງເຂົ້າ..." : "ເຂົ້າສູ່ລະບົບ"}
            </Button>
            <WarningDialog open={open} onClose={() => setOpen(false)} />
        </form>
    )
}

export default LoginForm
