"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientStepSchema, type ClientStepValues } from "@/lib/validations/proposal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface StepClientProps {
  defaultValues: Partial<ClientStepValues>;
  onNext: (data: ClientStepValues) => void;
}

export function StepClient({ defaultValues, onNext }: StepClientProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ClientStepValues>({
    resolver: zodResolver(clientStepSchema) as any,
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100">
          <Users className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-0.5">Client information</h2>
          <p className="text-sm text-gray-500">The person or company you're sending this to.</p>
        </div>
      </div>

      <Input
        label="Client name *"
        placeholder="Jane Smith"
        hint="The person or company you're sending this to"
        error={errors.client_name?.message}
        {...register("client_name")}
      />
      <Input
        label="Client email"
        type="email"
        placeholder="jane@acmecorp.com"
        hint="Used to pre-fill the shareable proposal page"
        error={errors.client_email?.message}
        {...register("client_email")}
      />
      <Input
        label="Company name"
        placeholder="Acme Corp"
        error={errors.client_company?.message}
        {...register("client_company")}
      />

      <div className="flex justify-end pt-2">
        <Button type="submit">Next: Project details →</Button>
      </div>
    </form>
  );
}
