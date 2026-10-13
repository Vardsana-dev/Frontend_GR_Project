"use client";

import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useListApprovalFlows } from "@/hooks/list-approval-flows/useListApprovalFlows";
import { CreateFlowDialog } from "./CreateFlowDialog";
import { FlowCard } from "./FlowCard";

export function ApproverSequenceSection() {
  const router = useRouter();
  const { data, loading, error, fetchApprovalFlows } = useListApprovalFlows();
  const handleCreateSuccess = (flowId?: number) => {
    if (flowId) {
      router.push(`?action=edit&id=${flowId}`);
    } else {
      fetchApprovalFlows();
    }
  };

  useEffect(() => {
    fetchApprovalFlows();
  }, [fetchApprovalFlows]);

  return (
    <div className="flex flex-col gap-6 mt-2 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-start gap-4">
        {/* Description text */}
        <p className="text-gray-500 text-[15px] max-w-4xl leading-relaxed">
          ກຳນົດລຳດັບຂັ້ນຕອນການຢືນຢັນສຳລັບເອກະສານຮັບສິນຄ້າແຕ່ລະປະເພດ ຜູ້ຈັດການ ແລະ ຫົວໜ້າສາຍງານສາມາດສ້າງ ແລະ ປັບ flow ໄດ້ເອງຢ່າງຍືດຍຸ່ນ
        </p>

        {/* Add Button */}
        <CreateFlowDialog onSuccess={handleCreateSuccess} />
      </div>

      {/* Loading and Error states */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* List of Sequence Cards */}
      {!loading && !error && data?.items && data.items.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.items.map((flow) => (
            <FlowCard 
              key={flow.flowId} 
              flow={flow} 
              onEdit={(id) => router.push(`?action=edit&id=${id}`)} 
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!data?.items || data.items.length === 0) && (
        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-2xl bg-gray-50">
          ບໍ່ມີຂໍ້ມູນ Approval Flow
        </div>
      )}
    </div>
  );
}
