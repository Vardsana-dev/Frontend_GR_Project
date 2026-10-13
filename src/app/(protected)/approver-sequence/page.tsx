import React from "react";
import { ApproverSequenceSection } from "@/components/screens/approver-sequence/ApproverSequenceSection";
import { CreateSequenceSection } from "@/components/screens/approver-sequence/CreateSequenceSection";

export default async function ApproverSequencePage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; id?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const isFormView = resolvedSearchParams.action === "create" || resolvedSearchParams.action === "edit";
  const flowId = resolvedSearchParams.id ? parseInt(resolvedSearchParams.id) : undefined;

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-theme(spacing.header-height))]">
      <div className="p-6 w-full flex-1">
        {isFormView ? (
          <CreateSequenceSection flowId={flowId} mode={resolvedSearchParams.action as "create" | "edit"} />
        ) : (
          <ApproverSequenceSection />
        )}
      </div>
    </div>
  );
}
