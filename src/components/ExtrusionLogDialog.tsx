'use client';

import { useId, useRef, useMemo } from 'react';
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
import { mutableFields } from '@/lib/columns';
import { Draft, ExtrusionLog, FullFormValues } from '@/lib/types';
import {
  refreshSuggestionData,
  refreshAllExtrusionQueries,
  useAccount,
} from '@/lib/client';
import { useTranslate } from '@/lib/intl/client';
import { post, patch } from '@/lib/api';
// import { format } from 'date-fns';
import { Form } from '@/components/ui/form';
import { formatDate } from '@/lib/dateTime';
import { nullToUndefined } from '@/lib/utils';
import { refineFormSchema } from '@/lib/extrusionLogForm';
import ExtrusionLogFormField from '@/components/ExtrusionLogFormField';
import { ScrollArea } from '@/components/ui/scroll-area';
import { machinesWith8To8Shift } from '@/lib/const';

export default function ExtrusionLogDialog({
  open,
  onOpenChange,
  fromDraft,
  fromExtrusionLog,
  editId,
  ...rest
}: {
  fromDraft?: Draft;
  fromExtrusionLog?: ExtrusionLog;
  editId?: number;
} & FortifiedDialogProps) {
  const __ = useTranslate();
  const account = useAccount();
  const defaultValues = useMemo(
    () =>
      (fromDraft && nullToUndefined(fromDraft)) ||
      duplicateExtrusionLog(fromExtrusionLog) ||
      getDefaultValues(),
    [fromDraft, fromExtrusionLog]
  );
  const formId = useId();
  const shiftStartsAt8 = machinesWith8To8Shift.includes(account.username);
  const formSchema = refineFormSchema(shiftStartsAt8);
  const form = useForm<FullFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const {
    formState: { isLoading, isSubmitting, isDirty },
  } = form;

  async function onSubmit(values: FullFormValues) {
    if (editId && !isDirty) {
      // Do nothing if it's an edit and no changes were made
      return;
    }

    const action = editId
      ? patch(`/api/extrusion-logs/${editId}`, values)
      : post('/api/extrusion-logs', values);
    try {
      await action;
    } catch (err: any) {
      flashError({ message: err?.message ? __(err.message) : String(err) });
      return;
    }
    onOpenChange(false);
    toast({
      title: editId ? __('Edited successfully!') : __('Created successfully!'),
    });
    if (fromDraft) {
      removeDraft(fromDraft.id);
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
      form.reset(getDefaultValues());
    }
  };

  const inputRefs = Array(mutableFields.size + 1)
    .fill(null)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    .map(() => useRef<HTMLElement>());
  let currentIndex = 0;
  const formIndex = () => ({
    inputRef: inputRefs[currentIndex],
    nextRef: inputRefs[++currentIndex],
  });

  return (
    <Dialog
      open={open}
      onOpenChange={async (open) => {
        if (!open && isDirty) {
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
          <DialogTitle>
            {editId ? __('Edit Extrusion Log') : __('Create Extrusion Log')}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <Form
            id={formId}
            form={form}
            onSubmit={onSubmit}
            className="px-6 py-2 space-y-8"
          >
            <ExtrusionLogFormField name="date" {...formIndex()} />

            <div className="flex gap-x-4">
              <ExtrusionLogFormField
                name="dieCode"
                className="flex-[2_2_0]"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="subNumber"
                className="flex-1"
                {...formIndex()}
              />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField
                name="billetType"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="ingotRatio"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="lotNumberCode"
                className="flex-1"
                {...formIndex()}
              />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField
                name="dieTemp"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="billetTemp"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="containerTemp"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="outputTemp"
                className="flex-1"
                {...formIndex()}
              />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField
                name="ramSpeed"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="pressure"
                className="flex-1"
                {...formIndex()}
              />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField
                name="pullerMode"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="pullerSpeed"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="pullerForce"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="extrusionCycle"
                className="flex-1"
                {...formIndex()}
              />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField
                name="billetLength"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="billetQuantity"
                className="flex-1"
                {...formIndex()}
              />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField
                name="orderLength"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                {...formIndex()}
                name="extrusionLength"
                className="flex-1"
              />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField
                name="segments"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="productionQuantity"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="ngQuantity"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="buttLength"
                className="flex-1"
                {...formIndex()}
              />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField
                name="coolingMethod"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="coolingMode"
                className="flex-1"
                {...formIndex()}
              />
            </div>

            <div className="flex gap-x-4">
              <ExtrusionLogFormField
                name="startButt"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="beforeSewing"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="afterSewing"
                className="flex-1"
                {...formIndex()}
              />

              <ExtrusionLogFormField
                name="endButt"
                className="flex-1"
                {...formIndex()}
              />
            </div>

            <div className="flex gap-x-4">
              <div className="flex-1">
                <ExtrusionLogFormField
                  name="startTime"
                  className="flex-1"
                  {...formIndex()}
                />
              </div>

              <div className="flex-1">
                <ExtrusionLogFormField
                  name="endTime"
                  className="flex-1"
                  {...formIndex()}
                />
              </div>

              <ExtrusionLogFormField
                name="result"
                className="flex-1"
                {...formIndex()}
              />
            </div>

            <ExtrusionLogFormField name="remark" {...formIndex()} />
          </Form>
        </ScrollArea>

        <DialogFooter className="px-6 sm:justify-between flex-shrink-0">
          <div>
            {!!fromDraft && (
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
                  removeDraft(fromDraft.id);
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

            {!editId && (
              <Button
                variant="secondary"
                onClick={() => {
                  const values = form.getValues();
                  if (fromDraft) {
                    updateDraft(fromDraft.id, values);
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
            )}

            <Button
              type="submit"
              form={formId}
              disabled={isSubmitting || isLoading}
              ref={(el) => {
                inputRefs[currentIndex].current = el || undefined;
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              {editId ? __('Submit changes') : __('Submit')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getDefaultValues() {
  const productionDate = new Date();
  if (productionDate.getHours() < 7) {
    productionDate.setDate(productionDate.getDate() - 1);
  }
  return {
    date: formatDate(productionDate) || undefined,
  } as FullFormValues;
}

function duplicateExtrusionLog(extrusionLog?: ExtrusionLog) {
  if (!extrusionLog) return undefined;
  const {
    billetLength,
    billetQuantity,
    billetTemp,
    billetType,
    buttLength,
    containerTemp,
    coolingMethod,
    coolingMode,
    date,
    dieCode,
    dieTemp,
    endButt,
    endTime,
    extrusionCycle,
    extrusionLength,
    ingotRatio,
    lotNumberCode,
    ngQuantity,
    orderLength,
    outputTemp,
    pressure,
    productionQuantity,
    pullerForce,
    pullerMode,
    pullerSpeed,
    ramSpeed,
    remark,
    result,
    segments,
    startButt,
    startTime,
    subNumber,
    beforeSewing,
    afterSewing,
  } = extrusionLog;
  const defaultValues = {
    billetQuantity,
    billetType,
    coolingMethod,
    coolingMode,
    dieCode,
    endTime,
    extrusionCycle,
    lotNumberCode,
    ngQuantity,
    productionQuantity,
    pullerMode,
    remark,
    result,
    segments,
    startTime,
    subNumber,
    date: formatDate(date),
    billetLength: billetLength !== null ? parseFloat(billetLength) : undefined,
    billetTemp: billetTemp !== null ? parseFloat(billetTemp) : undefined,
    buttLength: buttLength !== null ? parseFloat(buttLength) : undefined,
    containerTemp:
      containerTemp !== null ? parseFloat(containerTemp) : undefined,
    dieTemp: dieTemp !== null ? parseFloat(dieTemp) : undefined,
    endButt: endButt !== null ? parseFloat(endButt) : undefined,
    extrusionLength:
      extrusionLength !== null ? parseFloat(extrusionLength) : undefined,
    ingotRatio: ingotRatio !== null ? parseFloat(ingotRatio) : undefined,
    orderLength: orderLength !== null ? parseFloat(orderLength) : undefined,
    outputTemp: outputTemp !== null ? parseFloat(outputTemp) : undefined,
    pressure: pressure !== null ? parseFloat(pressure) : undefined,
    pullerForce: pullerForce !== null ? parseFloat(pullerForce) : undefined,
    pullerSpeed: pullerSpeed !== null ? parseFloat(pullerSpeed) : undefined,
    ramSpeed: ramSpeed !== null ? parseFloat(ramSpeed) : undefined,
    startButt: startButt !== null ? parseFloat(startButt) : undefined,
    beforeSewing: beforeSewing !== null ? parseFloat(beforeSewing) : undefined,
    afterSewing: afterSewing !== null ? parseFloat(afterSewing) : undefined,
  } as FullFormValues;
  console.log(defaultValues);
  console.log(nullToUndefined(defaultValues));

  return nullToUndefined(defaultValues);
}
