"use client"

import { useState } from 'react'
import { Input, Label, Button } from '@/components'

export default function PasswordPanel() {
    const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })

    const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

    return (
        <>
            <h2 className="text-xl font-bold text-center tracking-wide">ປ່ຽນລະຫັດຜ່ານ</h2>

            <div className="flex flex-col gap-4 max-w-sm">
                <div className="flex flex-col gap-1.5">
                    <Label className="text-blue-200 text-sm">ລະຫັດຜ່ານເກົ່າ</Label>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={form.oldPassword}
                        onChange={handleChange('oldPassword')}
                        className="bg-white/10 border-white/30 text-white placeholder:text-blue-300 focus-visible:ring-white/50 focus-visible:border-white"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label className="text-blue-200 text-sm">ລະຫັດຜ່ານໃໝ່</Label>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={form.newPassword}
                        onChange={handleChange('newPassword')}
                        className="bg-white/10 border-white/30 text-white placeholder:text-blue-300 focus-visible:ring-white/50 focus-visible:border-white"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label className="text-blue-200 text-sm">ຢືນຢັນລະຫັດຜ່ານໃໝ່</Label>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        className="bg-white/10 border-white/30 text-white placeholder:text-blue-300 focus-visible:ring-white/50 focus-visible:border-white"
                    />
                </div>

                <Button className="mt-2 bg-white text-primary hover:bg-blue-50 w-fit">
                    ບັນທຶກ
                </Button>
            </div>
        </>
    )
}
