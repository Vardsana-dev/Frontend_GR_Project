import React, { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateApprovalFlow } from "@/hooks/list-approval-flows/useCreateApprovalFlow";

interface CreateFlowDialogProps {
  onSuccess: (flowId?: number) => void;
}

export function CreateFlowDialog({ onSuccess }: CreateFlowDialogProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const { createApprovalFlow, loading: creating, error: createError } = useCreateApprovalFlow();

  const handleCreateFlow = async () => {
    if (!flowName.trim()) return;
    const response = await createApprovalFlow({
      flowName: flowName.trim(),
      isActive: true,
    });
    if (response.success && response.data) {
      setIsCreateOpen(false);
      setFlowName("");
      onSuccess(response.data.flowId);
    }
  };

  return (
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          ສ້າງ Flow
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Flow</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="flow-name">Flow name</Label>
            <Input 
              id="flow-name" 
              placeholder="Enter flow name"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
            />
            {createError && <p className="text-sm text-red-500">{createError}</p>}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleCreateFlow} disabled={creating || !flowName.trim()}>
            {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
