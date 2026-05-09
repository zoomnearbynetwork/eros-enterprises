"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  addCustomerNote,
  addLeadNote,
  addSiteVisitNote,
  assignLead,
  assignSiteVisitEngineer,
  convertLeadToCustomer,
  createSiteVisit,
  updateLeadPriority,
  updateLeadStatus,
  updateSiteVisitStatus,
} from "@/actions/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CUSTOMER_TYPES,
  LEAD_PRIORITIES,
  LEAD_PRIORITY_LABELS,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  SITE_VISIT_STATUSES,
  SITE_VISIT_STATUS_LABELS,
} from "@/features/crm/constants";
import { formatDateTimeLocalInput } from "@/features/crm/utils";

type AssignableUser = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  role: {
    name: string;
  };
};

function UserLabel(user: AssignableUser) {
  return `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`;
}

function FieldLabel({ children }: { children: string }) {
  return <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">{children}</label>;
}

function MessageLine({ message, error = false }: { message: string | null; error?: boolean }) {
  if (!message) {
    return null;
  }

  return <p className={`text-sm ${error ? "text-rose-300" : "text-emerald-300"}`}>{message}</p>;
}

export function LeadMutationPanel({
  lead,
  salesUsers,
  engineerUsers,
}: {
  lead: {
    id: string;
    status: (typeof LEAD_STATUSES)[number];
    priority: (typeof LEAD_PRIORITIES)[number];
    assignedToId: string | null;
    customer: { id: string } | null;
    serviceInterest: string;
    location: string | null;
  };
  salesUsers: AssignableUser[];
  engineerUsers: AssignableUser[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [priority, setPriority] = useState(lead.priority);
  const [assignedUserId, setAssignedUserId] = useState(lead.assignedToId ?? salesUsers[0]?.id ?? "");
  const [customerType, setCustomerType] = useState<(typeof CUSTOMER_TYPES)[number]>("INDIVIDUAL");
  const [note, setNote] = useState("");
  const [visitAt, setVisitAt] = useState(() =>
    formatDateTimeLocalInput(new Date(Date.now() + 86_400_000)),
  );
  const [visitAddress, setVisitAddress] = useState(lead.location ?? "");
  const [visitNotes, setVisitNotes] = useState("");
  const [visitEngineerId, setVisitEngineerId] = useState(engineerUsers[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startAction] = useTransition();

  async function handleStatusUpdate() {
    setErrorMessage(null);
    setMessage(null);

    const result = await updateLeadStatus({ leadId: lead.id, status });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setMessage(result.message);
    router.refresh();
  }

  async function handlePriorityUpdate() {
    setErrorMessage(null);
    setMessage(null);

    const result = await updateLeadPriority({ leadId: lead.id, priority });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setMessage(result.message);
    router.refresh();
  }

  async function handleAssignmentUpdate() {
    setErrorMessage(null);
    setMessage(null);

    const result = await assignLead({ leadId: lead.id, userId: assignedUserId });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setMessage(result.message);
    router.refresh();
  }

  async function handleConvert() {
    setErrorMessage(null);
    setMessage(null);

    const result = await convertLeadToCustomer({ leadId: lead.id, customerType });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    router.push(`/dashboard/customers/${result.data.customerId}`);
    router.refresh();
  }

  async function handleNoteCreate() {
    setErrorMessage(null);
    setMessage(null);

    const result = await addLeadNote({ leadId: lead.id, note });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setNote("");
    setMessage(result.message);
    router.refresh();
  }

  async function handleVisitCreate() {
    setErrorMessage(null);
    setMessage(null);

    const result = await createSiteVisit({
      leadId: lead.id,
      scheduledAt: visitAt,
      address: visitAddress,
      serviceInterest: lead.serviceInterest,
      notes: visitNotes,
      assignedEngineerId: visitEngineerId || undefined,
    });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setVisitNotes("");
    router.push(`/dashboard/site-visits/${result.data.siteVisitId}`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Pipeline Controls</div>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <FieldLabel>Status</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={status}
              onChange={(event) => setStatus(event.target.value as (typeof LEAD_STATUSES)[number])}
            >
              {LEAD_STATUSES.map((item) => (
                <option key={item} value={item} className="bg-[#101113]">
                  {LEAD_STATUS_LABELS[item]}
                </option>
              ))}
            </select>
            <Button disabled={isPending} onClick={() => startAction(handleStatusUpdate)}>
              Update Status
            </Button>
          </div>

          <div className="grid gap-2">
            <FieldLabel>Priority</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as (typeof LEAD_PRIORITIES)[number])
              }
            >
              {LEAD_PRIORITIES.map((item) => (
                <option key={item} value={item} className="bg-[#101113]">
                  {LEAD_PRIORITY_LABELS[item]}
                </option>
              ))}
            </select>
            <Button variant="secondary" disabled={isPending} onClick={() => startAction(handlePriorityUpdate)}>
              Update Priority
            </Button>
          </div>

          <div className="grid gap-2">
            <FieldLabel>Assigned Sales User</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={assignedUserId}
              onChange={(event) => setAssignedUserId(event.target.value)}
            >
              {salesUsers.map((user) => (
                <option key={user.id} value={user.id} className="bg-[#101113]">
                  {UserLabel(user)}
                </option>
              ))}
            </select>
            <Button variant="secondary" disabled={isPending} onClick={() => startAction(handleAssignmentUpdate)}>
              Assign Lead
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Customer Conversion</div>
        <div className="mt-4 grid gap-3">
          {lead.customer ? (
            <Button asChild variant="outline">
              <Link href={`/dashboard/customers/${lead.customer.id}`}>Open Customer Record</Link>
            </Button>
          ) : (
            <>
              <div className="grid gap-2">
                <FieldLabel>Customer Type</FieldLabel>
                <select
                  className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
                  value={customerType}
                  onChange={(event) =>
                    setCustomerType(event.target.value as (typeof CUSTOMER_TYPES)[number])
                  }
                >
                  {CUSTOMER_TYPES.map((item) => (
                    <option key={item} value={item} className="bg-[#101113]">
                      {item.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <Button disabled={isPending} onClick={() => startAction(handleConvert)}>
                Convert to Customer
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Schedule Site Visit</div>
        <div className="mt-4 grid gap-3">
          <div className="grid gap-2">
            <FieldLabel>Date & Time</FieldLabel>
            <Input type="datetime-local" value={visitAt} onChange={(event) => setVisitAt(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <FieldLabel>Address</FieldLabel>
            <Textarea value={visitAddress} onChange={(event) => setVisitAddress(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <FieldLabel>Assign Engineer</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={visitEngineerId}
              onChange={(event) => setVisitEngineerId(event.target.value)}
            >
              <option value="" className="bg-[#101113]">
                Leave unassigned
              </option>
              {engineerUsers.map((user) => (
                <option key={user.id} value={user.id} className="bg-[#101113]">
                  {UserLabel(user)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <FieldLabel>Visit Notes</FieldLabel>
            <Textarea value={visitNotes} onChange={(event) => setVisitNotes(event.target.value)} />
          </div>
          <Button disabled={isPending} onClick={() => startAction(handleVisitCreate)}>
            Schedule Visit
          </Button>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Add Note</div>
        <div className="mt-4 grid gap-3">
          <Textarea
            placeholder="Capture the latest call notes, next steps, or context for the team."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <Button disabled={isPending} onClick={() => startAction(handleNoteCreate)}>
            Save Note
          </Button>
        </div>
      </div>

      <MessageLine message={message} />
      <MessageLine message={errorMessage} error />
    </div>
  );
}

export function CustomerNotePanel({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startAction] = useTransition();

  async function handleSubmit() {
    setErrorMessage(null);
    setMessage(null);

    const result = await addCustomerNote({ customerId, note });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setNote("");
    setMessage(result.message);
    router.refresh();
  }

  return (
    <div className="grid gap-3">
      <Textarea
        placeholder="Add customer context, follow-ups, or project notes."
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      <Button disabled={isPending} onClick={() => startAction(handleSubmit)}>
        Add Customer Note
      </Button>
      <MessageLine message={message} />
      <MessageLine message={errorMessage} error />
    </div>
  );
}

export function SiteVisitMutationPanel({
  siteVisit,
  engineerUsers,
}: {
  siteVisit: {
    id: string;
    status: (typeof SITE_VISIT_STATUSES)[number];
    assignedEngineerId: string | null;
  };
  engineerUsers: AssignableUser[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(siteVisit.status);
  const [assignedUserId, setAssignedUserId] = useState(siteVisit.assignedEngineerId ?? "");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startAction] = useTransition();

  async function handleStatusUpdate() {
    setErrorMessage(null);
    setMessage(null);

    const result = await updateSiteVisitStatus({ siteVisitId: siteVisit.id, status });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setMessage(result.message);
    router.refresh();
  }

  async function handleAssignmentUpdate() {
    setErrorMessage(null);
    setMessage(null);

    const result = await assignSiteVisitEngineer({
      siteVisitId: siteVisit.id,
      userId: assignedUserId,
    });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setMessage(result.message);
    router.refresh();
  }

  async function handleNoteCreate() {
    setErrorMessage(null);
    setMessage(null);

    const result = await addSiteVisitNote({ siteVisitId: siteVisit.id, note });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setNote("");
    setMessage(result.message);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Visit Controls</div>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <FieldLabel>Status</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as (typeof SITE_VISIT_STATUSES)[number])
              }
            >
              {SITE_VISIT_STATUSES.map((item) => (
                <option key={item} value={item} className="bg-[#101113]">
                  {SITE_VISIT_STATUS_LABELS[item]}
                </option>
              ))}
            </select>
            <Button disabled={isPending} onClick={() => startAction(handleStatusUpdate)}>
              Update Visit Status
            </Button>
          </div>

          <div className="grid gap-2">
            <FieldLabel>Assigned Engineer</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={assignedUserId}
              onChange={(event) => setAssignedUserId(event.target.value)}
            >
              {engineerUsers.map((user) => (
                <option key={user.id} value={user.id} className="bg-[#101113]">
                  {UserLabel(user)}
                </option>
              ))}
            </select>
            <Button variant="secondary" disabled={isPending} onClick={() => startAction(handleAssignmentUpdate)}>
              Assign Engineer
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Visit Note</div>
        <div className="mt-4 grid gap-3">
          <Textarea
            placeholder="Add completion notes, reschedule context, or engineer observations."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <Button disabled={isPending} onClick={() => startAction(handleNoteCreate)}>
            Save Visit Note
          </Button>
        </div>
      </div>

      <MessageLine message={message} />
      <MessageLine message={errorMessage} error />
    </div>
  );
}
