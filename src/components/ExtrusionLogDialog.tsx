'use client';

import { useId } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { FortifiedDialogProps } from '@/components/DialogController';
import { Button } from '@/components/ui/button';
import { TriangleAlert, Trash2, Plus, Power, Check, Save } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { confirm, flashError, toast } from '@/lib/ui';
import { addDraft, updateDraft, removeDraft } from '@/lib/drafts';
import { Draft } from '@/lib/types';
import {
  refreshSuggestionData,
  refreshAllExtrusionQueries,
} from '@/lib/client';
import { post } from '@/lib/api';
import { format } from 'date-fns';
import { Form } from '@/components/ui/form';
import { timeFormat } from '@/lib/dateTime';
import { FullFormValues, formSchema } from '@/lib/extrusionLogForm';
import ExtrusionLogField from '@/components/ExtrusionLogField';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ExtrusionLogDialog({
  employeeId = '',
  open,
  onOpenChange,
  draft,
  ...rest
}: {
  employeeId?: string;
  draft?: Draft;
} & FortifiedDialogProps) {
  const defaultValues = draft || getDefaultValues({ employeeId });
  const formId = useId();
  const form = useForm<FullFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const {
    formState: { isLoading, isSubmitting },
  } = form;

  async function onSubmit(values: FullFormValues) {
    try {
      await post('/api/extrusion-logs', values);
    } catch (err: any) {
      flashError({ message: err?.message || String(err) });
      return;
    }
    onOpenChange(false);
    toast({
      title: 'Created successfully!',
    });
    if (draft) {
      removeDraft(draft.id);
    }
    refreshSuggestionData();
    refreshAllExtrusionQueries();
  }

  const resetForm = async () => {
    const confirmed = await confirm({
      title: 'Reset form',
      description: 'Are you sure you want to reset all form values?',
    });
    if (confirmed) {
      form.reset(getDefaultValues({ employeeId }));
    }
  };

  return (
    <Dialog
      open={open}
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
        onOpenChange(open);
      }}
      {...rest}
    >
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="mr-2" />
          Create extrusion log
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col h-[90%] max-w-3xl px-0">
        <DialogHeader className="flex-shrink-0 px-6">
          <DialogTitle>Create Extrusion Log</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <Form
            id={formId}
            form={form}
            onSubmit={onSubmit}
            className="px-6 py-2 space-y-6"
          >
            <ExtrusionLogField field="employeeId" />

            <div className="flex gap-x-4">
              <ExtrusionLogField field="shift" />

              <ExtrusionLogField field="date" />

              <ExtrusionLogField field="startTime" />

              <ExtrusionLogField field="endTime" />
            </div>

            <ExtrusionLogField field="item" />

            <ExtrusionLogField field="customer" />

            <div className="flex gap-x-4">
              <ExtrusionLogField field="dieCode" />

              <ExtrusionLogField field="dieNumber" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogField field="cavity" />

              <ExtrusionLogField field="productKgpm" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogField field="billetType" />

              <ExtrusionLogField field="lotNumberCode" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogField field="ingotRatio" />

              <ExtrusionLogField field="billetKgpm" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogField field="billetLength" />

              <ExtrusionLogField field="billetQuantity" />

              <ExtrusionLogField field="billetWeight" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogField field="orderLength" />

              <ExtrusionLogField field="ramSpeed" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogField field="billetTemp" />

              <ExtrusionLogField field="outputTemp" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogField field="result" />

              <ExtrusionLogField field="outputYield" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogField field="productionQuantity" />

              <ExtrusionLogField field="productionWeight" />

              <ExtrusionLogField field="outputRate" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogField field="ngQuantity" />

              <ExtrusionLogField field="ngWeight" />

              <ExtrusionLogField field="ngPercentage" />
            </div>

            <ExtrusionLogField field="remark" />

            <div className="flex gap-x-4">
              <ExtrusionLogField field="code" />

              <ExtrusionLogField field="buttWeight" />
            </div>
          </Form>
        </ScrollArea>

        <DialogFooter className="px-6 sm:justify-between flex-shrink-0">
          <div>
            {!!draft && (
              <Button
                variant="destructive"
                onClick={async () => {
                  const confirmed = await confirm({
                    title: (
                      <span className="flex items-center space-x-2 text-destructive">
                        <TriangleAlert className="w-4 h-4" />
                        <span>Delete draft</span>
                      </span>
                    ),
                    description: 'Are you sure you want to delete this draft?',
                    yesLabel: 'Delete draft',
                    variant: 'destructive',
                    noLabel: 'Go back',
                  });
                  if (!confirmed) return;
                  removeDraft(draft.id);
                  toast({
                    title: 'Draft deleted successfully!',
                    variant: 'destructive',
                  });
                  onOpenChange(false);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete draft
              </Button>
            )}
          </div>

          <div className="space-x-4">
            <Button variant="secondary" onClick={resetForm}>
              <Power className="mr-2 h-4 w-4" />
              Reset form
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                const values = form.getValues();
                if (draft) {
                  updateDraft(draft.id, values);
                } else {
                  addDraft(values);
                }
                toast({
                  title: 'Draft saved successfully!',
                });
                onOpenChange(false);
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>

            <Button
              type="submit"
              form={formId}
              disabled={isSubmitting || isLoading}
            >
              <Check className="mr-2 h-4 w-4" />
              Submit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getDefaultValues<T extends object>({
  employeeId,
}: {
  employeeId: string;
}) {
  const now = new Date();

  return {
    employeeId,
    date: now,
    shift: now.getHours() >= 8 && now.getHours() < 20 ? 'DAY' : 'NIGHT',
    startTime: null,
    endTime: format(now, timeFormat),

    item: null,
    customer: null,
    dieCode: null,
    dieNumber: null,
    cavity: null,
    productKgpm: null,
    billetType: null,
    lotNumberCode: null,
    ingotRatio: null,
    billetKgpm: null,
    billetLength: null,
    billetQuantity: null,
    billetWeight: null,
    orderLength: null,
    ramSpeed: null,
    billetTemp: null,
    outputTemp: null,

    result: null,
    outputYield: null,
    productionQuantity: null,
    productionWeight: null,
    remark: null,
    outputRate: null,
    ngQuantity: null,
    ngWeight: null,
    ngPercentage: null,
    code: null,
    buttWeight: null,
  } as T;
}
