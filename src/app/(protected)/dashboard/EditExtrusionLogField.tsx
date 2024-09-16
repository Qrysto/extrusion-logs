'use client';

import { format } from 'date-fns';
import { useState, useId, ReactNode, ComponentProps } from 'react';
import { Form, FormField, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormInput,
  FormAutoComplete,
  FormToggleGroup,
  FormOkToggleGroup,
  FormDatePicker,
  FormTimePicker,
} from '@/components/ui/form-adapters';
import { timeFormat } from '@/lib/dateTime';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { columnLabels, MutableFields } from './columns';
import {
  formSchema,
  FormValues as WholeFormValues,
} from '@/components/ExtrusionLogForm';
import { patch } from '@/lib/api';
import { flashError, toast } from '@/lib/ui';
import {
  refreshSuggestionData,
  refreshAllExtrusionQueries,
} from '@/lib/client';
import { Check } from 'lucide-react';
import { useForm, DefaultValues } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useSuggestionData } from '@/lib/client';
import { ExtrusionLog, SuggestionData } from '@/lib/types';

type FormValues<T extends MutableFields> = Pick<WholeFormValues, T>;

export type EditingState<T extends MutableFields> = {
  extrusionLogId: number;
  field: T;
  initialValue: ExtrusionLog[T];
  removeDialog: () => void;
};

export function EditExtrusionLogForm<T extends MutableFields>({
  removeDialog,
  extrusionLogId,
  field,
  initialValue,
}: EditingState<T>) {
  const formId = useId();
  const [open, setOpen] = useState(true);
  const { data } = useSuggestionData();
  const form = useForm<FormValues<T>>({
    resolver: zodResolver(formSchema.pick({ [field]: true } as object)),
    defaultValues: {
      [field]: initialValue,
    } as DefaultValues<FormValues<T>>,
  });
  const {
    formState: { isDirty, isLoading, isSubmitting },
  } = form;

  async function onSubmit(values: FormValues<T>) {
    try {
      await patch(`/api/extrusion-logs/${extrusionLogId}`, values);
    } catch (err: any) {
      flashError({ message: err?.message || String(err) });
      return;
    }
    removeDialog();
    toast({
      title: 'Updated successfully!',
    });
    refreshSuggestionData();
    refreshAllExtrusionQueries();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => {
        setOpen(open);
        if (!open) {
          setTimeout(removeDialog, 150);
        }
      }}
    >
      <DialogContent className="flex flex-col max-w-xl px-0">
        <DialogHeader className="flex-shrink-0 px-6">
          <DialogTitle>Edit {columnLabels[field]}</DialogTitle>
        </DialogHeader>

        <Form
          id={formId}
          form={form}
          onSubmit={onSubmit}
          className="px-6 py-2 space-y-6"
        >
          <Field field={field} data={data} />
        </Form>

        <DialogFooter className="px-6">
          <Button
            type="submit"
            form={formId}
            disabled={!isDirty || isSubmitting || isLoading}
          >
            <Check className="mr-2 h-4 w-4" />
            Submit
          </Button>
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

function Field<T extends MutableFields>({
  field,
  data,
}: {
  field: T;
  data?: SuggestionData;
}) {
  switch (field) {
    case 'date':
      return (
        <FormItem name="date" label="Date">
          <div>
            <FormDatePicker />
          </div>
        </FormItem>
      );
    case 'shift':
      return (
        <FormItem name="shift" label="Shift">
          <FormToggleGroup type="single" items={shiftItems} />
        </FormItem>
      );
    case 'employeeId':
      return (
        <FormItem name="employeeId" label="Employee ID">
          <FormInput />
        </FormItem>
      );
    case 'item':
      return (
        <FormItem name="item" label="Item">
          <FormAutoComplete options={data?.itemList || []} />
        </FormItem>
      );
    case 'customer':
      return (
        <FormItem name="customer" label="Customer">
          <FormAutoComplete options={data?.customerList || []} />
        </FormItem>
      );
    case 'dieCode':
      return (
        <FormItem name="dieCode" label="Die code" className="flex-[2_2_0]">
          <FormAutoComplete options={data?.dieCodeList || []} />
        </FormItem>
      );
    case 'dieNumber':
      return (
        <FormItem name="dieNumber" label="Die number" className="flex-1">
          <FormInput />
        </FormItem>
      );
    case 'cavity':
      return (
        <FormItem name="cavity" label="Cavity">
          <FormInput />
        </FormItem>
      );
    case 'productKgpm':
      return (
        <FormItem name="productKgpm" label="Product Kg/m">
          <FormInput step="any" />
        </FormItem>
      );
    case 'billetType':
      return (
        <FormItem name="billetType" label="Billet type">
          <FormAutoComplete options={data?.billetTypeList || []} />
        </FormItem>
      );
    case 'billetKgpm':
      return (
        <FormItem name="billetKgpm" label="Billet Kg/m">
          <FormInput step="any" />
        </FormItem>
      );
    case 'billetLength':
      return (
        <FormItem name="billetLength" label="Billet length (mm)">
          <FormInput step="any" />
        </FormItem>
      );
    case 'billetQuantity':
      return (
        <FormItem name="billetQuantity" label="Billet quantity">
          <FormInput />
        </FormItem>
      );
    case 'billetWeight':
      return (
        <FormItem name="billetWeight" label="Billet weight (g)">
          <FormInput step="any" />
        </FormItem>
      );
    case 'ingotRatio':
      return (
        <FormItem name="ingotRatio" label="Ingot ratio (%)">
          <FormInput max={100} />
        </FormItem>
      );
    case 'lotNumberCode':
      return (
        <FormItem name="lotNumberCode" label="Lot number">
          <FormAutoComplete options={data?.lotNoList || []} />
        </FormItem>
      );
    case 'ramSpeed':
      return (
        <FormItem name="ramSpeed" label="Ram speed">
          <FormInput step="any" />
        </FormItem>
      );
    case 'billetTemp':
      return (
        <FormItem name="billetTemp" label="Billet temperature">
          <FormInput step="any" />
        </FormItem>
      );
    case 'outputTemp':
      return (
        <FormItem name="outputTemp" label="Output temperature">
          <FormInput step="any" />
        </FormItem>
      );
    case 'orderLength':
      return (
        <FormItem name="orderLength" label="Order length (mm)">
          <FormInput step="any" />
        </FormItem>
      );
    case 'outputRate':
      return (
        <FormItem name="outputRate" label="Output rate (kg/h)">
          <FormInput step="any" />
        </FormItem>
      );
    case 'productionQuantity':
      return (
        <FormItem name="productionQuantity" label="Production quantity">
          <FormInput />
        </FormItem>
      );
    case 'productionWeight':
      return (
        <FormItem name="productionWeight" label="Production weight (g)">
          <FormInput step="any" />
        </FormItem>
      );
    case 'ok':
      return (
        <FormItem name="ok" label="Result">
          <FormOkToggleGroup type="single" items={resultItems} />
        </FormItem>
      );
    case 'outputYield':
      return (
        <FormItem name="outputYield" label="Yield (%)">
          <FormInput max={100} />
        </FormItem>
      );
    case 'ngQuantity':
      return (
        <FormItem name="ngQuantity" label="NG quantity">
          <FormInput />
        </FormItem>
      );
    case 'ngWeight':
      return (
        <FormItem name="ngWeight" label="NG weight (g)">
          <FormInput step="any" />
        </FormItem>
      );
    case 'ngPercentage':
      return (
        <FormItem name="ngPercentage" label="NG Percentage (%)">
          <FormInput step="any" />
        </FormItem>
      );
    case 'remark':
      return (
        <FormItem name="remark" label="Remark">
          <FormInput />
        </FormItem>
      );
    case 'buttWeight':
      return (
        <FormItem name="buttWeight" label="Butt weight (g)">
          <FormInput step="any" />
        </FormItem>
      );
    case 'code':
      return (
        <FormItem name="code" label="Code">
          <FormAutoComplete options={data?.codeList || []} />
        </FormItem>
      );
    case 'startTime':
      return (
        <FormItem name="startTime" label="Start time" className="flex-1">
          <FormTimePicker />
        </FormItem>
      );
    case 'endTime':
      return (
        <FormItem name="endTime" label="End time" className="flex-1">
          <FormTimePicker />
        </FormItem>
      );
  }
}

export function getDefaultValues<T extends object>({
  employeeId,
}: {
  employeeId: string;
}) {
  const now = new Date();

  return {
    employeeId,
    date: now,
    shift: now.getHours() >= 8 && now.getHours() < 20 ? 'day' : 'night',
    startTime: '',
    endTime: format(now, timeFormat),

    item: '',
    customer: '',
    dieCode: '',
    dieNumber: null,
    cavity: null,
    productKgpm: null,
    billetType: '',
    lotNumberCode: '',
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
    remark: '',
    outputRate: null,
    ngQuantity: null,
    ngWeight: null,
    ngPercentage: null,
    code: '',
    buttWeight: null,
  } as T;
}

const shiftItems = [
  { value: 'day', label: 'Day' },
  { value: 'night', label: 'Night' },
];

const resultItems = [
  { value: 'OK', label: 'OK' },
  { value: 'NG', label: 'NG' },
];
