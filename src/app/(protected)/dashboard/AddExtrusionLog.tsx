'use client';

import { z } from 'zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import {
  useId,
  ReactNode,
  ComponentProps,
  useState,
  ComponentType,
} from 'react';
import { Form, FormField, FormLabel, FormMessage } from '@/components/ui/form';
import {
  FormInput,
  FormAutoComplete,
  FormToggleGroup,
  FormDatePicker,
  FormTimePicker,
} from '@/components/ui/form-adapters';
import { timeFormat } from '@/lib/dateTime';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Power, Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import {
  useSuggestionData,
  refreshSuggestionData,
  refreshAllExtrusionQueries,
} from '@/lib/client';
import { post } from '@/lib/utils';

const formSchema = z.object({
  employeeId: z.string(),
  date: z.date(),
  shift: z.enum(['day', 'night']),
  startTime: z.string(),
  endTime: z.string(),

  item: z.string(),
  customer: z.string(),
  dieCode: z.string(),
  dieNumber: z.coerce
    .number()
    .min(0, 'Cannot be negative')
    .int('Has to be integer'),
  cavity: z.coerce.number().min(0).int(),
  productKgpm: z.coerce.number().min(0),
  billetType: z.string(),
  lotNumberCode: z.string(),
  ingotRatio: z.coerce.number().min(0),
  billetKgpm: z.coerce.number().min(0),
  billetLength: z.coerce.number().min(0),
  billetQuantity: z.coerce.number().min(0).int(),
  billetWeight: z.coerce.number().min(0),
  orderLength: z.coerce.number().min(0),
  ramSpeed: z.coerce.number().min(0),
  billetTemp: z.coerce.number().min(0),
  outputTemp: z.coerce.number().min(0),

  result: z.enum(['OK', 'NG']),
  outputYield: z.coerce.number().min(0),
  productionQuantity: z.coerce.number().min(0).int(),
  productionWeight: z.coerce.number().min(0),
  remark: z.string(),
  outputRate: z.coerce.number().min(0),
  ngQuantity: z.coerce.number().min(0).int(),
  ngWeight: z.coerce.number().min(0),
  ngPercentage: z.coerce.number().min(0),
  code: z.string(),
  buttWeight: z.coerce.number().min(0),
});

export default function AddExtrusionLog({
  employeeId,
}: {
  employeeId: string;
}) {
  const formId = useId();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues({ employeeId }),
  });
  const {
    formState: { isDirty, isLoading, isSubmitting },
  } = form;
  const { data } = useSuggestionData();

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
      title: 'Extrusion log has been added',
    });
    refreshSuggestionData();
    refreshAllExtrusionQueries();
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="mr-2" />
          Add extrusion log
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col max-h-[90%] max-w-3xl px-0">
        <DialogHeader className="flex-shrink-0 px-6">
          <DialogTitle>New Extrusion Log</DialogTitle>
        </DialogHeader>

        <Form
          id={formId}
          form={form}
          onSubmit={onSubmit}
          className="overflow-auto px-6 py-2 space-y-6"
        >
          <FormItem name="employeeId" label="Employee ID">
            <FormInput />
          </FormItem>

          <div className="flex gap-x-4">
            <FormItem name="shift" label="Shift">
              <FormToggleGroup type="single" items={shiftItems} />
            </FormItem>

            <FormItem name="date" label="Date">
              <FormDatePicker />
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

        <DialogFooter className="px-6 sm:justify-between">
          <div>
            <Button
              variant="secondary"
              onClick={() => {
                // TODO: add confirmation
                form.reset(getDefaultValues({ employeeId }));
              }}
            >
              <Power className="mr-2 h-4 w-4" />
              Reset form
            </Button>
          </div>

          <div>
            <Button variant="secondary" className="mr-4" disabled={!isDirty}>
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
