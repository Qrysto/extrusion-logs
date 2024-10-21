'use client';

import { useId, useMemo } from 'react';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { formBaseSchema, FullFormValues } from '@/lib/extrusionLogForm';
import { FortifiedDialogProps } from '@/components/DialogController';
import { patch } from '@/lib/api';
import { flashError, toast, confirm } from '@/lib/ui';
import { useTranslate } from '@/lib/intl/client';
import ExtrusionLogFormField from '@/components/ExtrusionLogFormField';
import {
  refreshSuggestionData,
  refreshAllExtrusionQueries,
} from '@/lib/client';
import { Check, TriangleAlert } from 'lucide-react';
import { useForm, DefaultValues } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/dateTime';
import { toMinutes } from '@/lib/utils';
import { ExtrusionLog } from '@/lib/types';
import { getLabel, MutableFields } from '@/lib/columns';

type FormValues<T extends MutableFields> = Pick<FullFormValues, T>;

interface EditExtrusionLogFieldProps<T extends MutableFields>
  extends FortifiedDialogProps {
  extrusionLog: ExtrusionLog;
  field: T;
}

export function EditExtrusionLogField<T extends MutableFields>({
  extrusionLog,
  field,
  open,
  onOpenChange,
  ...rest
}: EditExtrusionLogFieldProps<T>) {
  const __ = useTranslate();
  const formId = useId();
  const formSchema = useMemo(
    () => getFormSchema(extrusionLog, field, __),
    [extrusionLog, field, __]
  );
  const defaultValues = useMemo(
    () =>
      ({
        [field]:
          field === 'date'
            ? formatDate(extrusionLog.date)
            : extrusionLog[field],
      } as DefaultValues<FormValues<T>>),
    [field, extrusionLog]
  );
  const form = useForm<FormValues<T>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const {
    formState: { isDirty, isLoading, isSubmitting },
  } = form;

  async function onSubmit(values: FormValues<T>) {
    try {
      await patch(`/api/extrusion-logs/${extrusionLog.id}`, values);
    } catch (err: any) {
      flashError({ message: err?.message ? __(err.message) : String(err) });
      return;
    }
    onOpenChange(false);
    toast({
      title: __('Updated successfully!'),
    });
    refreshSuggestionData();
    refreshAllExtrusionQueries();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={async (open: boolean) => {
        if (!open && form.formState.isDirty) {
          const confirmed = await confirm({
            title: (
              <span className="flex items-center space-x-2 text-destructive">
                <TriangleAlert className="w-4 h-4" />
                <span>{__('Closing form')}</span>
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
        onOpenChange(false);
      }}
      {...rest}
    >
      <DialogContent className="flex flex-col max-w-xl px-0">
        <DialogHeader className="flex-shrink-0 px-6">
          <DialogTitle>
            {__('Edit %columnName%', { columnName: getLabel(field, __) })}
          </DialogTitle>
        </DialogHeader>

        <Form
          id={formId}
          form={form}
          onSubmit={onSubmit}
          className="px-6 py-2 space-y-6"
        >
          <ExtrusionLogFormField name={field} />
        </Form>

        <DialogFooter className="px-6">
          <Button
            type="submit"
            form={formId}
            disabled={!isDirty || isSubmitting || isLoading}
          >
            <Check className="mr-2 h-4 w-4" />
            {__('Submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getFormSchema<T extends MutableFields>(
  extrusionLog: ExtrusionLog,
  field: T,
  __: (text: string) => string
) {
  if (field !== 'endTime') {
    return formBaseSchema.pick({ [field]: true } as object);
  } else {
    const { startTime } = extrusionLog;
    return formBaseSchema.pick({ endTime: true }).refine(
      ({ endTime }) => {
        if (!startTime || !endTime) return true;
        const startMinutes = toMinutes(startTime);
        const endMinutes = toMinutes(endTime);
        if (endMinutes > startMinutes) return true;
        return endMinutes < 420; // 420 minutes == 7:00 am
      },
      {
        message: __('End time must not exceed 7:00 am of the following day'),
        path: ['endTime'],
      }
    );
  }
}
