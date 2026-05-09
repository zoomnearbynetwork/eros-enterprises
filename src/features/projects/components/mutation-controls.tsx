"use client";

import { useRouter } from "next/navigation";
import { startTransition, useMemo, useState, useTransition } from "react";

import {
  addAmcNote,
  addProjectNote,
  createAmcPlan,
  createProject,
  updateAmcDates,
  updateAmcStatus,
  updateProjectAssignments,
  updateProjectProgress,
  updateProjectStage,
} from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AMC_STATUSES,
  AMC_STATUS_LABELS,
  PROJECT_STAGES,
  PROJECT_STAGE_LABELS,
} from "@/features/crm/constants";
import { formatDateInput } from "@/features/billing/utils";

type UserOption = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  role: {
    name: string;
  };
};

type CustomerOption = {
  id: string;
  customerNumber: string;
  legalName: string;
  primaryContactName: string | null;
};

type QuotationOption = {
  id: string;
  quotationNumber: string;
  title: string | null;
  customerId: string | null;
  totalAmount: number;
  customer: {
    legalName: string;
  } | null;
  lead: {
    name: string;
  } | null;
};

type ProjectOption = {
  id: string;
  projectNumber: string;
  title: string;
  customerId: string;
  customer: {
    legalName: string;
  };
};

type ServiceOption = {
  id: string;
  code: string;
  name: string;
};

function FieldLabel({ children }: { children: string }) {
  return <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">{children}</label>;
}

function MessageLine({ message, error = false }: { message: string | null; error?: boolean }) {
  if (!message) {
    return null;
  }

  return <p className={`text-sm ${error ? "text-rose-300" : "text-emerald-300"}`}>{message}</p>;
}

function userLabel(user: UserOption) {
  return `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`;
}

export function ProjectCreateForm({
  customers,
  acceptedQuotations,
  managers,
  engineers,
}: {
  customers: CustomerOption[];
  acceptedQuotations: QuotationOption[];
  managers: UserOption[];
  engineers: UserOption[];
}) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [quotationId, setQuotationId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(formatDateInput(new Date()));
  const [targetCompletionDate, setTargetCompletionDate] = useState("");
  const [projectManagerId, setProjectManagerId] = useState(managers[0]?.id ?? "");
  const [siteEngineerId, setSiteEngineerId] = useState(engineers[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startAction] = useTransition();

  const filteredQuotations = useMemo(
    () =>
      customerId
        ? acceptedQuotations.filter((quotation) => !quotation.customerId || quotation.customerId === customerId)
        : acceptedQuotations,
    [acceptedQuotations, customerId],
  );

  function handleQuotationChange(nextQuotationId: string) {
    setQuotationId(nextQuotationId);

    const quotation = acceptedQuotations.find((item) => item.id === nextQuotationId);

    if (!quotation) {
      return;
    }

    if (quotation.customerId) {
      setCustomerId(quotation.customerId);
    }

    if (!title) {
      setTitle(quotation.title || `Project for ${quotation.customer?.legalName ?? quotation.lead?.name ?? "accepted quotation"}`);
    }
  }

  async function handleSubmit() {
    setErrorMessage(null);
    setMessage(null);

    const result = await createProject({
      customerId,
      quotationId: quotationId || undefined,
      title,
      description,
      startDate,
      targetCompletionDate,
      projectManagerId: projectManagerId || undefined,
      siteEngineerId: siteEngineerId || undefined,
    });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setMessage(result.message);

    startTransition(() => {
      router.push(`/dashboard/projects/${result.data.projectId}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <FieldLabel>Customer</FieldLabel>
          <select
            className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            value={customerId}
            onChange={(event) => setCustomerId(event.target.value)}
          >
            <option value="" className="bg-[#101113]">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id} className="bg-[#101113]">
                {customer.customerNumber} | {customer.legalName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <FieldLabel>Accepted Quotation</FieldLabel>
          <select
            className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            value={quotationId}
            onChange={(event) => handleQuotationChange(event.target.value)}
          >
            <option value="" className="bg-[#101113]">Create from customer only</option>
            {filteredQuotations.map((quotation) => (
              <option key={quotation.id} value={quotation.id} className="bg-[#101113]">
                {quotation.quotationNumber} | {quotation.customer?.legalName ?? quotation.lead?.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2 md:col-span-2">
          <FieldLabel>Project Title</FieldLabel>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>

        <div className="grid gap-2 md:col-span-2">
          <FieldLabel>Description</FieldLabel>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Capture scope, site context, or delivery notes."
          />
        </div>

        <div className="grid gap-2">
          <FieldLabel>Start Date</FieldLabel>
          <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </div>

        <div className="grid gap-2">
          <FieldLabel>Target Completion</FieldLabel>
          <Input
            type="date"
            value={targetCompletionDate}
            onChange={(event) => setTargetCompletionDate(event.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <FieldLabel>Project Manager</FieldLabel>
          <select
            className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            value={projectManagerId}
            onChange={(event) => setProjectManagerId(event.target.value)}
          >
            <option value="" className="bg-[#101113]">Leave unassigned</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id} className="bg-[#101113]">
                {userLabel(manager)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <FieldLabel>Site Engineer</FieldLabel>
          <select
            className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            value={siteEngineerId}
            onChange={(event) => setSiteEngineerId(event.target.value)}
          >
            <option value="" className="bg-[#101113]">Leave unassigned</option>
            {engineers.map((engineer) => (
              <option key={engineer.id} value={engineer.id} className="bg-[#101113]">
                {userLabel(engineer)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} onClick={() => startAction(handleSubmit)}>
          Create Project
        </Button>
        <MessageLine message={message} />
        <MessageLine message={errorMessage} error />
      </div>
    </div>
  );
}

export function ProjectMutationPanel({
  project,
  managers,
  engineers,
}: {
  project: {
    id: string;
    stage: (typeof PROJECT_STAGES)[number];
    progressPercent: number;
    projectManagerId: string | null;
    siteEngineerId: string | null;
  };
  managers: UserOption[];
  engineers: UserOption[];
}) {
  const router = useRouter();
  const [stage, setStage] = useState(project.stage);
  const [progressPercent, setProgressPercent] = useState(String(project.progressPercent));
  const [projectManagerId, setProjectManagerId] = useState(project.projectManagerId ?? "");
  const [siteEngineerId, setSiteEngineerId] = useState(project.siteEngineerId ?? "");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startAction] = useTransition();

  async function handleStageUpdate() {
    setErrorMessage(null);
    setMessage(null);

    const result = await updateProjectStage({ projectId: project.id, stage });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setMessage(result.message);
    router.refresh();
  }

  async function handleProgressUpdate() {
    setErrorMessage(null);
    setMessage(null);

    const result = await updateProjectProgress({
      projectId: project.id,
      progressPercent: Number(progressPercent),
    });

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

    const result = await updateProjectAssignments({
      projectId: project.id,
      projectManagerId: projectManagerId || undefined,
      siteEngineerId: siteEngineerId || undefined,
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

    const result = await addProjectNote({
      projectId: project.id,
      note,
    });

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
        <div className="text-sm font-medium text-white">Project Stage</div>
        <div className="mt-4 grid gap-3">
          <select
            className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            value={stage}
            onChange={(event) => setStage(event.target.value as (typeof PROJECT_STAGES)[number])}
          >
            {PROJECT_STAGES.map((item) => (
              <option key={item} value={item} className="bg-[#101113]">
                {PROJECT_STAGE_LABELS[item]}
              </option>
            ))}
          </select>
          <Button disabled={isPending} onClick={() => startAction(handleStageUpdate)}>
            Update Stage
          </Button>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Progress</div>
        <div className="mt-4 grid gap-3">
          <Input
            type="number"
            min="0"
            max="100"
            value={progressPercent}
            onChange={(event) => setProgressPercent(event.target.value)}
          />
          <Button variant="secondary" disabled={isPending} onClick={() => startAction(handleProgressUpdate)}>
            Update Progress
          </Button>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Assignments</div>
        <div className="mt-4 grid gap-3">
          <div className="grid gap-2">
            <FieldLabel>Project Manager</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={projectManagerId}
              onChange={(event) => setProjectManagerId(event.target.value)}
            >
              <option value="" className="bg-[#101113]">Leave unassigned</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id} className="bg-[#101113]">
                  {userLabel(manager)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <FieldLabel>Site Engineer</FieldLabel>
            <select
              className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
              value={siteEngineerId}
              onChange={(event) => setSiteEngineerId(event.target.value)}
            >
              <option value="" className="bg-[#101113]">Leave unassigned</option>
              {engineers.map((engineer) => (
                <option key={engineer.id} value={engineer.id} className="bg-[#101113]">
                  {userLabel(engineer)}
                </option>
              ))}
            </select>
          </div>
          <Button variant="secondary" disabled={isPending} onClick={() => startAction(handleAssignmentUpdate)}>
            Save Assignments
          </Button>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Project Note</div>
        <div className="mt-4 grid gap-3">
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Capture execution notes, blockers, or next actions."
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

export function AmcCreateForm({
  customers,
  projects,
  services,
}: {
  customers: CustomerOption[];
  projects: ProjectOption[];
  services: ServiceOption[];
}) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [projectId, setProjectId] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(formatDateInput(new Date()));
  const [endDate, setEndDate] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startAction] = useTransition();

  const filteredProjects = useMemo(
    () => projects.filter((project) => !customerId || project.customerId === customerId),
    [customerId, projects],
  );

  function handleProjectChange(nextProjectId: string) {
    setProjectId(nextProjectId);

    const project = projects.find((item) => item.id === nextProjectId);

    if (!project) {
      return;
    }

    setCustomerId(project.customerId);

    if (!title) {
      setTitle(`AMC for ${project.title}`);
    }
  }

  async function handleSubmit() {
    setErrorMessage(null);
    setMessage(null);

    const result = await createAmcPlan({
      customerId,
      projectId: projectId || undefined,
      serviceId: serviceId || undefined,
      title,
      description,
      startDate,
      endDate,
      renewalDate,
    });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setMessage(result.message);

    startTransition(() => {
      router.push(`/dashboard/amc/${result.data.amcPlanId}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <FieldLabel>Customer</FieldLabel>
          <select
            className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            value={customerId}
            onChange={(event) => setCustomerId(event.target.value)}
          >
            <option value="" className="bg-[#101113]">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id} className="bg-[#101113]">
                {customer.customerNumber} | {customer.legalName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <FieldLabel>Project</FieldLabel>
          <select
            className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            value={projectId}
            onChange={(event) => handleProjectChange(event.target.value)}
          >
            <option value="" className="bg-[#101113]">Link later or leave standalone</option>
            {filteredProjects.map((project) => (
              <option key={project.id} value={project.id} className="bg-[#101113]">
                {project.projectNumber} | {project.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <FieldLabel>Service</FieldLabel>
          <select
            className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            value={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
          >
            <option value="" className="bg-[#101113]">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id} className="bg-[#101113]">
                {service.code} | {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <FieldLabel>AMC Title</FieldLabel>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>

        <div className="grid gap-2 md:col-span-2">
          <FieldLabel>Description</FieldLabel>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Capture maintenance coverage, exclusions, and service scope."
          />
        </div>

        <div className="grid gap-2">
          <FieldLabel>Start Date</FieldLabel>
          <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </div>

        <div className="grid gap-2">
          <FieldLabel>End Date</FieldLabel>
          <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </div>

        <div className="grid gap-2">
          <FieldLabel>Renewal Date</FieldLabel>
          <Input type="date" value={renewalDate} onChange={(event) => setRenewalDate(event.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} onClick={() => startAction(handleSubmit)}>
          Create AMC Plan
        </Button>
        <MessageLine message={message} />
        <MessageLine message={errorMessage} error />
      </div>
    </div>
  );
}

export function AmcMutationPanel({
  plan,
}: {
  plan: {
    id: string;
    effectiveStatus: (typeof AMC_STATUSES)[number];
    startDate: Date;
    endDate: Date;
    renewalDate: Date;
  };
}) {
  const router = useRouter();
  const [status, setStatus] = useState(plan.effectiveStatus);
  const [startDate, setStartDate] = useState(formatDateInput(plan.startDate));
  const [endDate, setEndDate] = useState(formatDateInput(plan.endDate));
  const [renewalDate, setRenewalDate] = useState(formatDateInput(plan.renewalDate));
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startAction] = useTransition();

  async function handleStatusUpdate() {
    setErrorMessage(null);
    setMessage(null);

    const result = await updateAmcStatus({
      amcPlanId: plan.id,
      status,
    });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setMessage(result.message);
    router.refresh();
  }

  async function handleDatesUpdate() {
    setErrorMessage(null);
    setMessage(null);

    const result = await updateAmcDates({
      amcPlanId: plan.id,
      startDate,
      endDate,
      renewalDate,
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

    const result = await addAmcNote({
      amcPlanId: plan.id,
      note,
    });

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
        <div className="text-sm font-medium text-white">AMC Status</div>
        <div className="mt-4 grid gap-3">
          <select
            className="h-10 rounded-3xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            value={status}
            onChange={(event) => setStatus(event.target.value as (typeof AMC_STATUSES)[number])}
          >
            {AMC_STATUSES.map((item) => (
              <option key={item} value={item} className="bg-[#101113]">
                {AMC_STATUS_LABELS[item]}
              </option>
            ))}
          </select>
          <Button disabled={isPending} onClick={() => startAction(handleStatusUpdate)}>
            Update AMC Status
          </Button>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">Renewal Dates</div>
        <div className="mt-4 grid gap-3">
          <div className="grid gap-2">
            <FieldLabel>Start Date</FieldLabel>
            <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <FieldLabel>End Date</FieldLabel>
            <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <FieldLabel>Renewal Date</FieldLabel>
            <Input type="date" value={renewalDate} onChange={(event) => setRenewalDate(event.target.value)} />
          </div>
          <Button variant="secondary" disabled={isPending} onClick={() => startAction(handleDatesUpdate)}>
            Save Dates
          </Button>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm font-medium text-white">AMC Note</div>
        <div className="mt-4 grid gap-3">
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Capture maintenance history, escalations, or renewal context."
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
