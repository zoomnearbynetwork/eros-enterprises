"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createAutomationRule, updateAutomationRule } from "@/actions/automation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AUTOMATION_ACTION_LABELS,
  AUTOMATION_ACTION_TYPES,
  AUTOMATION_TRIGGER_LABELS,
  AUTOMATION_TRIGGER_TYPES,
} from "@/features/automation/constants";

type SelectedRule = {
  id: string;
  name: string;
  description: string | null;
  triggerType: (typeof AUTOMATION_TRIGGER_TYPES)[number];
  actionType: (typeof AUTOMATION_ACTION_TYPES)[number];
  isActive: boolean;
  delayMinutes: number;
  messageTemplate: string | null;
  taskTitle: string | null;
  taskDescription: string | null;
  notificationTitle: string | null;
  notificationMessage: string | null;
} | null;

function MessageLine({ message, error = false }: { message: string | null; error?: boolean }) {
  if (!message) {
    return null;
  }

  return <p className={`text-sm ${error ? "text-rose-300" : "text-emerald-300"}`}>{message}</p>;
}

export function AutomationRuleForm({ selectedRule }: { selectedRule: SelectedRule }) {
  const router = useRouter();
  const [name, setName] = useState(selectedRule?.name ?? "");
  const [description, setDescription] = useState(selectedRule?.description ?? "");
  const [triggerType, setTriggerType] = useState<(typeof AUTOMATION_TRIGGER_TYPES)[number]>(
    selectedRule?.triggerType ?? "LEAD_CREATED",
  );
  const [actionType, setActionType] = useState<(typeof AUTOMATION_ACTION_TYPES)[number]>(
    selectedRule?.actionType ?? "SEND_WHATSAPP_MESSAGE",
  );
  const [isActive, setIsActive] = useState(selectedRule?.isActive ?? true);
  const [delayMinutes, setDelayMinutes] = useState(String(selectedRule?.delayMinutes ?? 0));
  const [messageTemplate, setMessageTemplate] = useState(selectedRule?.messageTemplate ?? "");
  const [taskTitle, setTaskTitle] = useState(selectedRule?.taskTitle ?? "");
  const [taskDescription, setTaskDescription] = useState(selectedRule?.taskDescription ?? "");
  const [notificationTitle, setNotificationTitle] = useState(selectedRule?.notificationTitle ?? "");
  const [notificationMessage, setNotificationMessage] = useState(
    selectedRule?.notificationMessage ?? "",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit() {
    setMessage(null);
    setErrorMessage(null);

    const payload = {
      ruleId: selectedRule?.id,
      name,
      description,
      triggerType,
      actionType,
      isActive,
      delayMinutes,
      messageTemplate,
      taskTitle,
      taskDescription,
      notificationTitle,
      notificationMessage,
    };

    const result = selectedRule
      ? await updateAutomationRule(payload)
      : await createAutomationRule(payload);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setMessage(result.message);
    router.push(`/dashboard/automation?ruleId=${result.data.ruleId}`);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2 sm:col-span-2">
          <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Rule name</label>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Description</label>
          <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Trigger</label>
          <select
            className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            value={triggerType}
            onChange={(event) =>
              setTriggerType(event.target.value as (typeof AUTOMATION_TRIGGER_TYPES)[number])
            }
          >
            {AUTOMATION_TRIGGER_TYPES.map((trigger) => (
              <option key={trigger} value={trigger} className="bg-[#101113]">
                {AUTOMATION_TRIGGER_LABELS[trigger]}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Action</label>
          <select
            className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            value={actionType}
            onChange={(event) =>
              setActionType(event.target.value as (typeof AUTOMATION_ACTION_TYPES)[number])
            }
          >
            {AUTOMATION_ACTION_TYPES.map((action) => (
              <option key={action} value={action} className="bg-[#101113]">
                {AUTOMATION_ACTION_LABELS[action]}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Delay (minutes)</label>
          <Input
            type="number"
            min={0}
            value={delayMinutes}
            onChange={(event) => setDelayMinutes(event.target.value)}
          />
        </div>
        <label className="flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-200">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
          />
          Rule is active
        </label>
      </div>

      {actionType === "SEND_WHATSAPP_MESSAGE" ? (
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            WhatsApp template
          </label>
          <Textarea
            placeholder="Example: Hi {{name}}, your quotation is ready for review."
            value={messageTemplate}
            onChange={(event) => setMessageTemplate(event.target.value)}
          />
        </div>
      ) : null}

      {actionType === "CREATE_TASK" ? (
        <>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Task title</label>
            <Input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Task description
            </label>
            <Textarea
              value={taskDescription}
              onChange={(event) => setTaskDescription(event.target.value)}
            />
          </div>
        </>
      ) : null}

      {actionType === "INTERNAL_NOTIFICATION" ? (
        <>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Notification title
            </label>
            <Input
              value={notificationTitle}
              onChange={(event) => setNotificationTitle(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Notification message
            </label>
            <Textarea
              value={notificationMessage}
              onChange={(event) => setNotificationMessage(event.target.value)}
            />
          </div>
        </>
      ) : null}

      <Button disabled={isPending} onClick={() => startTransition(handleSubmit)}>
        {selectedRule ? "Update rule" : "Create rule"}
      </Button>

      <MessageLine message={message} />
      <MessageLine message={errorMessage} error />
    </div>
  );
}
