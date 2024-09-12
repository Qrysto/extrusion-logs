'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/lib/use-toast';
import {
  ExtrusionLogForm,
  getDefaultValues,
  FormValues,
  formSchema,
} from '@/components/ExtrusionLogForm';
import {
  refreshSuggestionData,
  refreshAllExtrusionQueries,
} from '@/lib/client';
import { post } from '@/lib/utils';

export default function AddExtrusionLog({
  employeeId,
}: {
  employeeId: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const defaultValues = getDefaultValues({ employeeId });
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: FormValues) {
    const finalValues = {
      ...values,
      ok: values.result === 'OK',
      result: undefined,
    };
    try {
      await post('/api/create-extrusion-log', finalValues);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: err?.message,
      });
      return;
    }
    form.reset(getDefaultValues({ employeeId }));
    setDialogOpen(false);
    toast({
      title: 'Extrusion log has been created',
    });
    refreshSuggestionData();
    refreshAllExtrusionQueries();
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (open) {
          form.reset(defaultValues);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="mr-2" />
          Create extrusion log
        </Button>
      </DialogTrigger>

      <ExtrusionLogForm
        heading="New Extrusion Log"
        form={form}
        onSubmit={onSubmit}
        saveForm={undefined}
        resetForm={() => {
          // TODO: add confirmation
          form.reset(getDefaultValues({ employeeId }));
        }}
      />
    </Dialog>
  );
}
