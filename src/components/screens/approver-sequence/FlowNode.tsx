import React from "react";
import { GripVertical, Plus, Check } from "lucide-react";

export type FlowNodeType = "start" | "step" | "end";

interface FlowNodeProps {
  type: FlowNodeType;
  title: string;
  subtitle?: string;
  stepNumber?: number;
  badge?: string;
  badgeVariant?: "normal" | "warning";
  isSelected?: boolean;
  onClick?: () => void;
  onAddNode?: () => void;
}

export function FlowNode({
  type,
  title,
  subtitle,
  stepNumber,
  badge,
  badgeVariant = "normal",
  isSelected = false,
  onClick,
  onAddNode,
}: FlowNodeProps) {
  if (type === "start") {
    return (
      <div className="flex flex-col items-center">
        <div className="w-[450px] bg-[#29429f] rounded-xl p-4 flex items-center gap-4 text-white shadow-sm z-10 relative">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-blue-100">{title}</span>
            <span className="font-bold text-lg">{subtitle}</span>
          </div>
        </div>
        <NodeConnector onClick={onAddNode} />
      </div>
    );
  }

  if (type === "end") {
    return (
      <div className="flex flex-col items-center">
        <div className="w-[450px] bg-[#f0f4f8] rounded-xl p-5 flex items-center gap-4 border border-[#e2e8f0] shadow-sm z-10 relative">
          <div className="w-8 h-8 rounded-md bg-[#29429f] flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-semibold">{title}</span>
            <span className="font-bold text-[#1e293b]">{subtitle}</span>
          </div>
        </div>
      </div>
    );
  }

  // Standard step node
  return (
    <div className="flex flex-col items-center">
      <div
        onClick={onClick}
        className={`w-[450px] bg-white rounded-xl p-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all z-10 relative border-2 ${
          isSelected ? "border-[#3b82f6]" : "border-transparent"
        } ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      >
        <div className="flex items-center gap-4">
          <GripVertical className="text-gray-300 w-5 h-5 cursor-grab" />
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
              isSelected ? "bg-[#29429f]" : "bg-[#93c5fd]"
            }`}
          >
            {stepNumber}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#1e293b]">{title}</span>
            {subtitle && (
              <span
                className="text-xs text-gray-500 whitespace-pre-line leading-relaxed"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
          </div>
        </div>

        {badge && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
              badgeVariant === "warning"
                ? "bg-[#fffbeb] text-[#d97706]"
                : "bg-[#f1f5f9] text-[#64748b]"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <NodeConnector onClick={onAddNode} />
    </div>
  );
}

function NodeConnector({ onClick }: { onClick?: () => void }) {
  return (
    <div className="h-14 flex items-center justify-center relative w-full">
      <div className="absolute top-0 bottom-0 w-px bg-gray-300"></div>
      <div 
        onClick={onClick}
        className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center z-10 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
      >
        <Plus className="w-3.5 h-3.5 text-gray-400" strokeWidth={2.5} />
      </div>
    </div>
  );
}
