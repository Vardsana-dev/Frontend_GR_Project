import React, { useState, useEffect, useRef } from "react";
import { Search, X, User, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchUser } from "@/hooks/list-approval-flows/useSearchUser";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ApproverData {
  usercode: string;
  name: string;
}

export interface StepData {
  id: string;
  title: string;
  approvers: ApproverData[];
}

interface FlowSettingsPanelProps {
  step: StepData | null;
  stepNumber: number;
  onUpdateStep: (updatedStep: StepData) => void;
  onRemoveUser?: (stepId: string, usercode: string) => void;
}

export function FlowSettingsPanel({ step, stepNumber, onUpdateStep, onRemoveUser }: FlowSettingsPanelProps) {
  const [approverInput, setApproverInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [userToRemove, setUserToRemove] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { loading, data, searchUser } = useSearchUser();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (approverInput.trim().length > 1) {
        searchUser(approverInput);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [approverInput, searchUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!step) {
    return (
      <div className="w-[320px] bg-white h-full border border-gray-100 rounded-2xl flex items-center justify-center p-6 shadow-[0_2px_15px_rgba(0,0,0,0.02)] z-20">
        <p className="text-gray-400 text-sm">ກະລຸນາເລືອກຂັ້ນຕອນເພື່ອຕັ້ງຄ່າ</p>
      </div>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateStep({ ...step, title: e.target.value });
  };

  const handleAddApprover = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && approverInput.trim()) {
      e.preventDefault();
      const newApprover = { usercode: approverInput.trim(), name: approverInput.trim() };
      onUpdateStep({ ...step, approvers: [...step.approvers, newApprover] });
      setApproverInput("");
      setShowDropdown(false);
    }
  };

  const handleSelectUser = (user: any) => {
    const nameToAdd = user.name || user.fullName || user.empName || user.usercode || approverInput;
    const newApprover = { usercode: user.usercode || nameToAdd, name: nameToAdd };
    onUpdateStep({ ...step, approvers: [...step.approvers, newApprover] });
    setApproverInput("");
    setShowDropdown(false);
  };

  const handleRemoveApprover = (indexToRemove: number) => {
    const approverToRemove = step.approvers[indexToRemove];
    if (approverToRemove && onRemoveUser) {
      onRemoveUser(step.id, approverToRemove.usercode);
    } else {
      onUpdateStep({
        ...step,
        approvers: step.approvers.filter((_, idx) => idx !== indexToRemove)
      });
    }
  };

  return (
    <div className="w-[320px] bg-white h-full border border-gray-100 rounded-2xl flex flex-col p-6 overflow-y-auto shrink-0 shadow-[0_2px_15px_rgba(0,0,0,0.02)] z-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 rounded bg-[#eef2ff] text-[#3b82f6] text-xs font-bold flex items-center justify-center">
          {stepNumber}
        </div>
        <h3 className="font-bold text-[#1e293b] text-lg">ຕັ້ງຄ່າຂັ້ນຕອນ</h3>
      </div>
      
      <div className="h-px bg-gray-100 w-full mb-6" />

      {/* Form Fields */}
      <div className="flex flex-col gap-6">
        
        {/* Process Name */}
        <div className="flex flex-col gap-2">
          <Label className="text-gray-500 font-semibold text-xs mb-1">
            ຊື່ຂະບວນການ
          </Label>
          <Input 
            value={step.title}
            onChange={handleTitleChange}
            placeholder="ເພີ່ມຊື່ຂະບວນການ..." 
            className="text-sm border-gray-200 h-10 focus-visible:ring-1 focus-visible:ring-blue-500" 
          />
        </div>

        {/* Approver Search */}
        <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
          <Label className="text-gray-500 font-semibold text-xs mb-1">
            ຜູ້ຢືນຢັນ
          </Label>
          <div className="relative">
            <Input 
              placeholder="ຊື່ : ນາງ ສຸພາພອນ (ກົດ Enter ເພື່ອເພີ່ມ)" 
              value={approverInput}
              onChange={(e) => setApproverInput(e.target.value)}
              onKeyDown={handleAddApprover}
              onFocus={() => {
                if (approverInput.trim().length > 1) setShowDropdown(true);
              }}
              className="pl-3 pr-10 text-sm border-gray-200 h-10 focus-visible:ring-1 focus-visible:ring-blue-500" 
            />
            {loading ? (
              <Loader2 className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            )}
          </div>

          {/* Search Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-3 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> ກຳລັງຄົ້ນຫາ...
                </div>
              ) : data?.items?.length > 0 ? (
                <ul className="flex flex-col">
                  {data.items.map((user: any, idx: number) => (
                    <li 
                      key={user.id || user.usercode || idx}
                      className="px-3 py-2 hover:bg-blue-50 text-sm text-gray-700 flex items-center justify-between border-b border-gray-50 last:border-0"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name || user.fullName || user.empName || user.usercode || 'Unknown User'}</span>
                        {(user.usercode || user.department) && (
                          <span className="text-xs text-gray-400">
                            {user.usercode} {user.department ? `- ${user.department}` : ''}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleSelectUser(user)}
                        className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium hover:bg-blue-200 transition-colors shrink-0 ml-2"
                      >
                        ເພີ່ມ
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 text-center text-sm text-gray-500">
                  ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້
                </div>
              )}
            </div>
          )}
        </div>

        {/* Approver List Container */}
        <div className="flex flex-col gap-2 mt-2">
          <Label className="text-gray-500 font-semibold text-xs mb-1">
            ລາຍຊື່ຜູ້ຢືນຢັນ
          </Label>
          
          {step.approvers.length > 0 ? (
            <div className="bg-[#dbeafe] bg-opacity-70 rounded-xl p-3 flex flex-col gap-2 border border-blue-100">
              {step.approvers.map((approver, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                      <div className={`w-full h-full flex items-end justify-center pt-2 ${
                        ['bg-[#fca5a5]', 'bg-[#fdba74]', 'bg-[#93c5fd]', 'bg-[#86efac]'][index % 4]
                      }`}>
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700 font-medium">{approver.name}</span>
                      {approver.usercode !== approver.name && !approver.usercode.startsWith('dummy-') && (
                        <span className="text-xs text-gray-400">{approver.usercode}</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => setUserToRemove(index)}
                    className="p-1.5 hover:bg-red-100 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
              ຍັງບໍ່ມີລາຍຊື່ຜູ້ຢືນຢັນ
            </div>
          )}
        </div>
      </div>

      <Dialog open={userToRemove !== null} onOpenChange={(open) => !open && setUserToRemove(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ຍືນຍັນການລຶບ</DialogTitle>
            <DialogDescription>
              ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຜູ້ຢືນຢັນນີ້?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setUserToRemove(null)}>
              ຍົກເລີກ
            </Button>
            <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => {
              if (userToRemove !== null) {
                handleRemoveApprover(userToRemove);
                setUserToRemove(null);
              }
            }}>
              ລຶບ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
