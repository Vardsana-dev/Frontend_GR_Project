"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FlowNode } from "./FlowNode";
import { FlowSettingsPanel, StepData } from "./FlowSettingsPanel";
import { Loader2 } from "lucide-react";
import { SaveSuccessDialog } from "./SaveSuccessDialog";
import { SaveErrorDialog } from "./SaveErrorDialog";
import { useListApprovalFlows } from "@/hooks/list-approval-flows/useListApprovalFlows";
import { useCreateApprovalLevel } from "@/hooks/list-approval-flows/useCreateApprovalLevel";
import { useAddUserToLevel } from "@/hooks/list-approval-flows/useAddUserToLevel";
import { useUpdateApprovalLevel } from "@/hooks/list-approval-flows/useUpdateApprovalLevel";
import { useRemoveUserFromLevel } from "@/hooks/list-approval-flows/useRemoveUserFromLevel";

export function CreateSequenceSection({
  flowId,
  mode = "create"
}: {
  flowId?: number;
  mode?: "create" | "edit"
}) {
  const router = useRouter();
  const [steps, setSteps] = useState<StepData[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data, fetchApprovalFlows } = useListApprovalFlows();
  const { createApprovalLevel } = useCreateApprovalLevel();
  const { updateApprovalLevel } = useUpdateApprovalLevel();
  const { addUserToLevel } = useAddUserToLevel();
  const { removeUserFromLevel } = useRemoveUserFromLevel();

  React.useEffect(() => {
    if (mode === 'edit' && flowId) {
      fetchApprovalFlows();
    }
  }, [mode, flowId, fetchApprovalFlows]);

  React.useEffect(() => {
    if (data?.items && flowId) {
      const flow = data.items.find(f => f.flowId === flowId);
      if (flow && flow.levels) {
        const mappedSteps: StepData[] = flow.levels.map(level => {
          const levelUsers = (level as any).users;
          const approvers = levelUsers && levelUsers.length > 0
            ? levelUsers.map((u: any) => ({
              usercode: u.usercode,
              name: u.name || u.fullName || u.empName || u.usercode || 'Unknown User'
            }))
            : Array.from({ length: level.userCount > 0 ? level.userCount : 0 }).map((_, i) => ({
              usercode: `dummy-${i}`,
              name: `ຜູ້ອະນຸມັດ ${i + 1}`
            }));

          return {
            id: String(level.stepId),
            title: level.stepName,
            approvers
          };
        });
        setSteps(mappedSteps);
      }
    }
  }, [data, flowId]);

  const handleAddStep = (index: number) => {
    const newStep: StepData = {
      id: Math.random().toString(36).substr(2, 9),
      title: "",
      approvers: []
    };
    const newSteps = [...steps];
    newSteps.splice(index, 0, newStep);
    setSteps(newSteps);
    setSelectedStepId(newStep.id);
  };

  const handleUpdateStep = (updatedStep: StepData) => {
    setSteps(steps.map(s => s.id === updatedStep.id ? updatedStep : s));
  };

  const handleRemoveUser = async (stepId: string, usercode: string) => {
    console.log("handleRemoveUser called", { stepId, usercode });
    if (!isNaN(Number(stepId)) && usercode && !usercode.startsWith('dummy-')) {
      try {
        const removeRes = await removeUserFromLevel({ stepId: Number(stepId), usercode });
        console.log("removeRes:", removeRes);
        if (!removeRes.success) {
          setSaveError(`Failed to delete user: ${removeRes.error?.message || 'Unknown error'}`);
          return;
        }
      } catch (err: any) {
        console.log("removeError:", err);
        setSaveError(`Failed to delete user: ${err.message}`);
        return;
      }
    }
    
    // Update local state
    setSteps(prev => prev.map(s => s.id === stepId ? {
      ...s,
      approvers: s.approvers.filter(a => a.usercode !== usercode)
    } : s));
  };

  const selectedStepData = steps.find(s => s.id === selectedStepId) || null;
  const selectedStepIndex = steps.findIndex(s => s.id === selectedStepId);

  const handleSave = async () => {
    if (!flowId) return;

    try {
      setIsSaving(true);
      setSaveError(null);

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        let targetStepId: number | null = null;

        // Check if this is an existing step from the backend (numeric ID) or a new one (random string)
        if (isNaN(Number(step.id))) {
          const levelRes = await createApprovalLevel({
            flowId: flowId,
            approvalLevel: i + 1,
            stepName: step.title || `Step ${i + 1}`,
            approvalMode: "ANY",
            isActive: true
          });

          if (levelRes.success && levelRes.data) {
            const responseData = levelRes.data.data || levelRes.data;
            targetStepId = responseData.stepId || responseData.levelId || responseData.id || responseData.approvalLevelId;
          } else {
            throw new Error("Failed to create new step.");
          }
        } else {
          targetStepId = Number(step.id);
          // Update the existing level's details
          const updateRes = await updateApprovalLevel({
            stepId: targetStepId,
            approvalLevel: i + 1,
            stepName: step.title || `Step ${i + 1}`,
            approvalMode: "ANY",
            isActive: true
          });
          if (!updateRes.success) {
            throw new Error("Failed to update step.");
          }
        }

        if (targetStepId && step.approvers.length > 0) {
          for (const approver of step.approvers) {
            if (approver.usercode && !approver.usercode.startsWith('dummy-')) {
              const addRes = await addUserToLevel({
                stepId: targetStepId,
                usercode: approver.usercode
              });
              if (!addRes.success) {
                // If it fails, we shouldn't necessarily fail the whole flow if the user was just already added.
                // But for robust error checking, we could log it or fail.
              }
            }
          }
        }
      }

      setIsSaving(false);
      setIsSuccessOpen(true);
      setTimeout(() => {
        setIsSuccessOpen(false);
        router.push('/approver-sequence');
      }, 2000);
    } catch (error: any) {
      console.error("Failed to save flow", error);
      setSaveError(error.message || "Failed to save flow.");
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between z-20 shrink-0">
        <h2 className="text-3xl font-black text-[#1e293b]">
          Flow ຢືນຢັນການຮັບສິນຄ້າ
        </h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/approver-sequence')}
            className="border-gray-300 text-[#29429f] font-semibold bg-white"
          >
            ຍົກເລີກ
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#29429f] hover:bg-blue-800 text-white font-semibold px-6">
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            ບັນທຶກ Flow
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden gap-6">
        <div
          className="flex-1 overflow-y-auto relative p-10 flex justify-center bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100"
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px"
          }}
        >
          <div className="flex flex-col items-center py-6 w-full max-w-2xl">
            <FlowNode
              type="start"
              title="ເລີ່ມຕົ້ນ"
              subtitle="ເມື່ອມີເອກະສານ GR"
              onAddNode={() => handleAddStep(0)}
            />

            {steps.map((step, idx) => (
              <FlowNode
                key={step.id}
                type="step"
                stepNumber={idx + 1}
                title={step.title || "ຍັງບໍ່ໄດ້ຕັ້ງຊື່ຂັ້ນຕອນ"}
                subtitle={step.approvers.length > 0 ? `ລາຍຊື່ຜູ້ຢືນຢັນ :\n${step.approvers.map((a, i) => `${i + 1}. ${a.name}`).join('\n')}` : "ຍັງບໍ່ມີຜູ້ຢືນຢັນ"}
                badge={selectedStepId === step.id ? "ກຳລັງແກ້ໄຂ" : "ປົກກະຕິ"}
                badgeVariant={selectedStepId === step.id ? "warning" : "normal"}
                isSelected={selectedStepId === step.id}
                onClick={() => setSelectedStepId(step.id)}
                onAddNode={() => handleAddStep(idx + 1)}
              />
            ))}

            <FlowNode
              type="end"
              title="ສິ້ນສຸດ"
              subtitle="ຢືນຢັນສົມບູນ - ບັນທຶກເຂົ້າສາງ"
            />
          </div>
        </div>

        <FlowSettingsPanel
          step={selectedStepData}
          stepNumber={steps.findIndex(s => s.id === selectedStepId) + 1}
          onUpdateStep={handleUpdateStep}
          onRemoveUser={handleRemoveUser}
        />
      </div>

      <SaveSuccessDialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen} />
      <SaveErrorDialog error={saveError} onClose={() => setSaveError(null)} />
    </div>
  );
}
