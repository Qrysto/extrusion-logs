'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TriangleAlert } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { confirm, flashError } from '@/lib/ui';
import { toast } from '@/lib/ui';
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
import { post } from '@/lib/api';

export default function AddExtrusionLog({
  employeeId,
}: {
  employeeId: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const defaultValues = getDefaultValues({ employeeId });
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: FormValues) {
    try {
      await post('/api/create-extrusion-log', values);
    } catch (err: any) {
      flashError({ message: err?.message || String(err) });
      return;
    }
    form.reset(getDefaultValues({ employeeId }));
    setDialogOpen(false);
    toast({
      title: 'Created successfully!',
    });
    refreshSuggestionData();
    refreshAllExtrusionQueries();
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={async (open) => {
        if (!open && form.formState.isDirty) {
          const confirmed = await confirm({
            title: (
              <span className="flex items-center space-x-2 text-destructive">
                <TriangleAlert className="w-4 h-4" />
                <span>Closing form</span>
              </span>
            ),
            description:
              'Are you sure you want to close and discard all unsaved changes?',
            yesLabel: 'Close and discard form',
            variant: 'destructive',
            noLabel: 'Go back',
          });
          if (!confirmed) return;
        }
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
        resetForm={async () => {
          const confirmed = await confirm({
            title: 'Reset form',
            description: 'Are you sure you want to reset all form values?',
          });
          if (confirmed) {
            form.reset(getDefaultValues({ employeeId }));
          }
        }}
      />
    </Dialog>
  );
}
