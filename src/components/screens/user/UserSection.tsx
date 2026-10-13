"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserTable } from "./UserTable";
import { MOCK_USER_DATA } from "./mockData";
import { Plus } from "lucide-react";
import { AddUserDialog } from "./AddUserDialog";

export default function UserSection() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header section with title and Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          ຜູ້ໃຊ້ງານທັງໝົດ
          <span className="text-gray-400 font-normal">(64)</span>
        </h1>
        
        <Button 
          onClick={() => setIsAddUserOpen(true)}
          className="h-10 bg-[#2a45a8] hover:bg-[#1e3a8a] text-white rounded-md flex items-center gap-2 px-6"
        >
          <Plus className="w-4 h-4" />
          ເພີ່ມຜູ້ໃຊ້
        </Button>
      </div>

      <UserTable data={MOCK_USER_DATA} />

      <AddUserDialog 
        open={isAddUserOpen} 
        onOpenChange={setIsAddUserOpen}
        onSuccess={(data) => {
          console.log("User successfully added:", data);
          // Here you would typically trigger a data re-fetch
        }}
      />
    </div>
  );
}
