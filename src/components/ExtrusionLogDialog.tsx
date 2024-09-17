'use client';

import { useForm } from 'react-hook-form';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
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
import { useId, ReactNode, ComponentProps } from 'react';
import { Form, FormField, FormLabel } from '@/components/ui/form';
import {
  FormInput,
  FormAutoComplete,
  FormToggleGroup,
  FormDatePicker,
  FormTimePicker,
} from '@/components/ui/form-adapters';
import { timeFormat } from '@/lib/dateTime';
import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  shiftItems,
  resultItems,
  FullFormValues,
  formSchema,
} from '@/lib/extrusionLogForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSuggestionData } from '@/lib/client';

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
  const { data } = useSuggestionData();
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
            <FormItem name="employeeId" label="Employee ID">
              <FormInput />
            </FormItem>

            <div className="flex gap-x-4">
              <FormItem name="shift" label="Shift">
                <FormToggleGroup type="single" items={shiftItems} />
              </FormItem>

              <FormItem name="date" label="Date">
                <div>
                  <FormDatePicker />
                </div>
              </FormItem>

              <FormItem name="startTime" label="Start time" className="flex-1">
                <FormTimePicker />
              </FormItem>

              <FormItem name="endTime" label="End time" className="flex-1">
                <FormTimePicker />
              </FormItem>
            </div>

            <FormItem name="item" label="Item">
              <FormAutoComplete options={data?.itemList || []} />
            </FormItem>

            <FormItem name="customer" label="Customer">
              <FormAutoComplete options={data?.customerList || []} />
            </FormItem>

            <div className="flex gap-x-4">
              <FormItem
                name="dieCode"
                label="Die code"
                className="flex-[2_2_0]"
              >
                <FormAutoComplete options={data?.dieCodeList || []} />
              </FormItem>

              <FormItem name="dieNumber" label="Die number" className="flex-1">
                <FormInput />
              </FormItem>
            </div>

            <div className="flex gap-x-4">
              <FormItem name="cavity" label="Cavity">
                <FormInput />
              </FormItem>

              <FormItem name="productKgpm" label="Product Kg/m">
                <FormInput step="any" />
              </FormItem>
            </div>

            <div className="flex gap-x-4">
              <FormItem name="billetType" label="Billet type">
                <FormAutoComplete options={data?.billetTypeList || []} />
              </FormItem>

              <FormItem name="lotNumberCode" label="Lot number">
                <FormAutoComplete options={data?.lotNoList || []} />
              </FormItem>
            </div>

            <div className="flex gap-x-4">
              <FormItem name="ingotRatio" label="Ingot ratio (%)">
                <FormInput max={100} />
              </FormItem>

              <FormItem name="billetKgpm" label="Billet Kg/m">
                <FormInput step="any" />
              </FormItem>
            </div>

            <div className="flex gap-x-4">
              <FormItem name="billetLength" label="Billet length (mm)">
                <FormInput step="any" />
              </FormItem>

              <FormItem name="billetQuantity" label="Billet quantity">
                <FormInput />
              </FormItem>

              <FormItem name="billetWeight" label="Billet weight (g)">
                <FormInput step="any" />
              </FormItem>
            </div>

            <div className="flex gap-x-4">
              <FormItem name="orderLength" label="Order length (mm)">
                <FormInput step="any" />
              </FormItem>

              <FormItem name="ramSpeed" label="Ram speed">
                <FormInput step="any" />
              </FormItem>
            </div>

            <div className="flex gap-x-4">
              <FormItem name="billetTemp" label="Billet temperature">
                <FormInput step="any" />
              </FormItem>

              <FormItem name="outputTemp" label="Output temperature">
                <FormInput step="any" />
              </FormItem>
            </div>

            <div className="flex gap-x-4">
              <FormItem name="result" label="Result">
                <FormToggleGroup type="single" items={resultItems} />
              </FormItem>

              <FormItem name="outputYield" label="Yield (%)">
                <FormInput max={100} />
              </FormItem>
            </div>

            <div className="flex gap-x-4">
              <FormItem name="productionQuantity" label="Production quantity">
                <FormInput />
              </FormItem>

              <FormItem name="productionWeight" label="Production weight (g)">
                <FormInput step="any" />
              </FormItem>

              <FormItem name="outputRate" label="Output rate (kg/h)">
                <FormInput step="any" />
              </FormItem>
            </div>

            <div className="flex gap-x-4">
              <FormItem name="ngQuantity" label="NG quantity">
                <FormInput />
              </FormItem>

              <FormItem name="ngWeight" label="NG weight (g)">
                <FormInput step="any" />
              </FormItem>

              <FormItem name="ngPercentage" label="NG Percentage (%)">
                <FormInput step="any" />
              </FormItem>
            </div>

            <FormItem name="remark" label="Remark">
              <FormInput />
            </FormItem>

            <div className="flex gap-x-4">
              <FormItem name="code" label="Code">
                <FormAutoComplete options={data?.codeList || []} />
              </FormItem>

              <FormItem name="buttWeight" label="Butt weight (g)">
                <FormInput step="any" />
              </FormItem>
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

function FormItem({
  name,
  label,
  children,
  ...rest
}: {
  name: string;
  label: ReactNode;
  children: ReactNode;
} & ComponentProps<typeof FormField>) {
  return (
    <FormField name={name} {...rest}>
      <FormLabel>{label}</FormLabel>
      {children}
    </FormField>
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
