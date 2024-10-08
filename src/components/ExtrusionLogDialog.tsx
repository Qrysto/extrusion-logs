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
import { useTranslate } from '@/lib/intl/client';
import { post } from '@/lib/api';
import { format } from 'date-fns';
import { Form } from '@/components/ui/form';
import { timeFormat } from '@/lib/dateTime';
import { FullFormValues, formSchema } from '@/lib/extrusionLogForm';
import ExtrusionLogFormField from '@/components/ExtrusionLogFormField';
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
  const __ = useTranslate();
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
      flashError({ message: err?.message ? __(err.message) : String(err) });
      return;
    }
    onOpenChange(false);
    toast({
      title: __('Created successfully!'),
    });
    if (draft) {
      removeDraft(draft.id);
    }
    refreshSuggestionData();
    refreshAllExtrusionQueries();
  }

  const resetForm = async () => {
    const confirmed = await confirm({
      title: __('Reset form'),
      description: __('Are you sure you want to reset all form values?'),
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
            description: __(
              'Are you sure you want to close and discard all unsaved changes?'
            ),
            yesLabel: __('Close and discard form'),
            variant: 'destructive',
            noLabel: __('Go back'),
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
          {__('Create Extrusion Log')}
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col h-[90%] max-w-3xl px-0">
        <DialogHeader className="flex-shrink-0 px-6">
          <DialogTitle>{__('Create Extrusion Log')}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <Form
            id={formId}
            form={form}
            onSubmit={onSubmit}
            className="px-6 py-2 space-y-6"
          >
            <ExtrusionLogFormField name="employeeId" />

            <div className="flex gap-x-4">
              <ExtrusionLogFormField name="shift" />

              <ExtrusionLogFormField name="date" />

              <div className="flex-1">
                <ExtrusionLogFormField name="startTime" />
              </div>

              <div className="flex-1">
                <ExtrusionLogFormField name="endTime" />
              </div>
            </div>

            <ExtrusionLogFormField name="item" />

            <ExtrusionLogFormField name="customer" />

            <div className="flex gap-x-4">
              <div className="flex-[2_2_0]">
                <ExtrusionLogFormField name="dieCode" />
              </div>

              <div className="flex-1">
                <ExtrusionLogFormField name="dieNumber" />
              </div>
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField name="cavity" />

              <ExtrusionLogFormField name="productKgpm" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField name="billetType" />

              <ExtrusionLogFormField name="lotNumberCode" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField name="ingotRatio" />

              <ExtrusionLogFormField name="billetKgpm" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField name="billetLength" />

              <ExtrusionLogFormField name="billetQuantity" />

              <ExtrusionLogFormField name="billetWeight" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField name="orderLength" />

              <ExtrusionLogFormField name="ramSpeed" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField name="billetTemp" />

              <ExtrusionLogFormField name="outputTemp" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField name="result" />

              <ExtrusionLogFormField name="outputYield" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField name="productionQuantity" />

              <ExtrusionLogFormField name="productionWeight" />

              <ExtrusionLogFormField name="outputRate" />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField name="ngQuantity" />

              <ExtrusionLogFormField name="ngWeight" />

              <ExtrusionLogFormField name="ngPercentage" />
            </div>

            <ExtrusionLogFormField name="remark" />

            <div className="flex gap-x-4">
              <ExtrusionLogFormField name="code" />

              <ExtrusionLogFormField name="buttWeight" />
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
                        <span>{__('Delete draft')}</span>
                      </span>
                    ),
                    description: __(
                      'Are you sure you want to delete this draft?'
                    ),
                    yesLabel: __('Delete draft'),
                    variant: 'destructive',
                    noLabel: __('Go back'),
                  });
                  if (!confirmed) return;
                  removeDraft(draft.id);
                  toast({
                    title: __('Draft deleted successfully!'),
                    variant: 'destructive',
                  });
                  onOpenChange(false);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {__('Delete draft')}
              </Button>
            )}
          </div>

          <div className="space-x-4">
            <Button variant="secondary" onClick={resetForm}>
              <Power className="mr-2 h-4 w-4" />
              {__('Reset form')}
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
                  title: __('Draft saved successfully!'),
                });
                onOpenChange(false);
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              {__('Save draft')}
            </Button>

            <Button
              type="submit"
              form={formId}
              disabled={isSubmitting || isLoading}
            >
              <Check className="mr-2 h-4 w-4" />
              {__('Submit')}
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
