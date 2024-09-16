'use client';

import { z } from 'zod';
import { format } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';
import { useId, ReactNode, ComponentProps } from 'react';
import { Form, FormField, FormLabel } from '@/components/ui/form';
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
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Power, Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSuggestionData } from '@/lib/client';

export const formSchema = z.object({
  employeeId: z.string().nullable(),
  date: z.date().nullable(),
  shift: z.enum(['day', 'night']).nullable(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),

  item: z.string().nullable(),
  customer: z.string().nullable(),
  dieCode: z.string().nullable(),
  dieNumber: z.coerce
    .number()
    .min(0, 'Cannot be negative')
    .int('Has to be integer')
    .nullable(),
  cavity: z.coerce.number().min(0).int().nullable(),
  productKgpm: z.coerce.number().min(0).nullable(),
  billetType: z.string().nullable(),
  lotNumberCode: z.string().nullable(),
  ingotRatio: z.coerce.number().min(0).nullable(),
  billetKgpm: z.coerce.number().min(0).nullable(),
  billetLength: z.coerce.number().min(0).nullable(),
  billetQuantity: z.coerce.number().min(0).int().nullable(),
  billetWeight: z.coerce.number().min(0).nullable(),
  orderLength: z.coerce.number().min(0).nullable(),
  ramSpeed: z.coerce.number().min(0).nullable(),
  billetTemp: z.coerce.number().min(0).nullable(),
  outputTemp: z.coerce.number().min(0).nullable(),

  ok: z.boolean().nullable(),
  outputYield: z.coerce.number().min(0).nullable(),
  productionQuantity: z.coerce.number().min(0).int().nullable(),
  productionWeight: z.coerce.number().min(0).nullable(),
  remark: z.string().nullable(),
  outputRate: z.coerce.number().min(0).nullable(),
  ngQuantity: z.coerce.number().min(0).int().nullable(),
  ngWeight: z.coerce.number().min(0).nullable(),
  ngPercentage: z.coerce.number().min(0).nullable(),
  code: z.string().nullable(),
  buttWeight: z.coerce.number().min(0).nullable(),
});

export type FormValues = z.infer<typeof formSchema>;

interface ExtrusionLogFormProps {
  heading: ReactNode;
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  saveForm?: () => void;
  resetForm?: () => void;
}

export function ExtrusionLogForm({
  heading,
  form,
  onSubmit,
  saveForm,
  resetForm,
}: ExtrusionLogFormProps) {
  const formId = useId();
  const { data } = useSuggestionData();
  const {
    formState: { isDirty, isLoading, isSubmitting },
  } = form;

  return (
    <DialogContent className="flex flex-col h-[90%] max-w-3xl px-0">
      <DialogHeader className="flex-shrink-0 px-6">
        <DialogTitle>{heading}</DialogTitle>
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
            <FormItem name="dieCode" label="Die code" className="flex-[2_2_0]">
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
            <FormItem name="ok" label="Result">
              <FormOkToggleGroup type="single" items={resultItems} />
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
          {!!resetForm && (
            <Button variant="secondary" onClick={resetForm}>
              <Power className="mr-2 h-4 w-4" />
              Reset form
            </Button>
          )}
        </div>

        <div>
          {!!saveForm && (
            <Button
              variant="secondary"
              className="mr-4"
              disabled={!isDirty}
              onClick={saveForm}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          )}
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

    ok: null,
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

const shiftItems = [
  { value: 'day', label: 'Day' },
  { value: 'night', label: 'Night' },
];

const resultItems = [
  { value: 'OK', label: 'OK' },
  { value: 'NG', label: 'NG' },
];
