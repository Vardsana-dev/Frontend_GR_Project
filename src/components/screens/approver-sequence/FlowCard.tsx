import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlowCardProps {
  flow: any; 
  onEdit: (flowId: number) => void;
}

export function FlowCard({ flow, onEdit }: FlowCardProps) {
  return (
    <div className="border border-[#c6cde6] bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#1e293b]">
              {flow.flowName}
            </h2>
            {flow.isActive ? (
              <span className="bg-[#eef2ff] text-[#4f46e5] text-xs font-semibold px-2.5 py-1 rounded-md">
                ໃຊ້ງານ
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-md">
                ປິດໃຊ້ງານ
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            {/* Placeholder for department/date as it's not in API response */}
            ທຸກພະແນກ &bull; ລະຫັດ: {flow.flowId}
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={() => onEdit(flow.flowId)}
          className="text-[#3b82f6] border-[#e2e8f0] font-medium h-9 px-5 hover:bg-blue-50"
        >
          ແກ້ໄຂ
        </Button>
      </div>

      {/* Sequence Flow */}
      <div className="flex items-center flex-wrap gap-3">
        {flow.levels && flow.levels.length > 0 ? (
          flow.levels.map((level: any, index: number) => (
            <React.Fragment key={level.stepId || `level-${index}`}>
              {/* Step */}
              <div className="bg-[#f1f5f9] text-[#334155] px-4 py-2 rounded-lg text-sm font-semibold">
                {level.stepName}
                <span className="text-gray-400 font-normal ml-2">({level.approvalMode})</span>
              </div>

              {/* Arrow (except for the last item) */}
              {index < flow.levels.length - 1 && (
                <ArrowRight className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
              )}
            </React.Fragment>
          ))
        ) : (
          <span className="text-gray-400 text-sm italic">ບໍ່ມີຂັ້ນຕອນການອະນຸມັດ</span>
        )}
      </div>
    </div>
  );
}
