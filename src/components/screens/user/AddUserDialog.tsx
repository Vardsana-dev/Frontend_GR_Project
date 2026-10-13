"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, User } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(1, "ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ"),
  employeeId: z.string().min(1, "ກະລຸນາປ້ອນລະຫັດພະນັກງານ"),
  position: z.string().min(1, "ກະລຸນາເລືອກຕຳແໜ່ງ"),
  branch: z.string().min(1, "ກະລຸນາເລືອກສາຂາ"),
  password: z.string().min(6, "ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ"),
  role: z.string().min(1, "ກະລຸນາເລືອກບົດບາດ"),
});

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: z.infer<typeof formSchema>) => void;
}

export function AddUserDialog({ open, onOpenChange, onSuccess }: AddUserDialogProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      employeeId: "",
      position: "",
      branch: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    if (onSuccess) {
      onSuccess(values);
    }
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 bg-white rounded-2xl overflow-hidden gap-0 border-none shadow-2xl">
        <DialogHeader className="p-8 pb-6 bg-white border-b border-[#1e3a8a]/20">
          <DialogTitle className="text-xl md:text-2xl font-bold text-[#1e3a8a]">
            ຟອມຂໍ້ມູນຜູ້ໃຊ້ໃໝ່
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-2 text-sm">
            ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຄົບຖ້ວນເພື່ອສ້າງບັນຊີຜູ້ໃຊ້ໃໝ່ເຂົ້າໃນລະບົບ
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">ຊື່ ແລະ ນາມສະກຸນ</FormLabel>
                    <FormControl>
                      <Input placeholder="ຕົວຢ່າງ: ສົມພອນ ແກ້ວມະນີ" className="h-12 bg-gray-50 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employee ID */}
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">ລະຫັດພະນັກງານ</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="ຕົວຢ່າງ: EMP00189" className="h-12 bg-gray-50 rounded-xl pr-10" {...field} />
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2a45a8]" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Position */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">ຕຳແໜ່ງ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-gray-50 rounded-xl text-gray-500">
                          <SelectValue placeholder="ເລືອກຕຳແໜ່ງ..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="it_support">IT Support</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Branch */}
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">ສາຂາ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-gray-50 rounded-xl text-gray-500">
                          <SelectValue placeholder="ເລືອກສາຂາ / ສາງສິນຄ້າ..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="headquarters">ສຳນັກງານໃຫຍ່</SelectItem>
                        <SelectItem value="branch_1">ສາຂາ 1</SelectItem>
                        <SelectItem value="warehouse_1">ສາງສິນຄ້າ 1</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">ລະຫັດຜ່ານ</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="ປ້ອນລະຫັດຜ່ານ..." 
                          className="h-12 bg-gray-50 rounded-xl pr-10" 
                          {...field} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2a45a8] hover:text-[#1e3a8a]"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">ເລືອກບົດບາດ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-gray-50 rounded-xl text-gray-500">
                          <SelectValue placeholder="ບົດບາດ..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">ຜູ້ເບິ່ງແຍງລະບົບ</SelectItem>
                        <SelectItem value="approver">ຜູ້ອະນຸມັດ</SelectItem>
                        <SelectItem value="user">ຜູ້ໃຊ້</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="h-12 px-8 rounded-xl border-[#2a45a8] text-[#2a45a8] hover:bg-blue-50 bg-white font-semibold"
                onClick={() => onOpenChange(false)}
              >
                ຍົກເລີກ
              </Button>
              <Button 
                type="submit" 
                className="h-12 px-8 rounded-xl bg-[#2a45a8] hover:bg-[#1e3a8a] text-white font-semibold"
              >
                ບັນທຶກຜູ້ໃຊ້
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
