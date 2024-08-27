'use client';

import { z } from 'zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { ReactNode, ComponentProps } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from '@/components/ui/date-picker';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const formSchema = z.object({
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

  ok: z.boolean(),
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

const timeFormat = 'HH:mm';

export default function ExtrusionLogForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // @ts-ignore
    defaultValues: getDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('submit', values);
    return await fetch('/api/create-extrusion-log', {
      method: 'POST',
      body: JSON.stringify(values),
    });
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="shift"
          label="Shift"
          render={({ field }) => (
            <ToggleGroup
              type="single"
              value={field.value}
              onValueChange={field.onChange}
              ref={field.ref}
            >
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="night">Night</ToggleGroupItem>
            </ToggleGroup>
          )}
        />

        <ExtrusionFormItem
          name="date"
          label="Date"
          render={({ field }) => (
            <div>
              <DatePicker date={field.value} onDateChange={field.onChange} />
            </div>
          )}
        />

        <ExtrusionFormItem
          name="startTime"
          label="Start time"
          className="flex-1"
          render={({ field }) => <Input type="time" {...field} />}
        />

        <ExtrusionFormItem
          name="endTime"
          label="End time"
          className="flex-1"
          render={({ field }) => <Input type="time" {...field} />}
        />
      </div>

      <ExtrusionFormItem
        name="item"
        label="Item"
        render={({ field }) => <Input {...field} />}
      />

      <ExtrusionFormItem
        name="customer"
        label="Customer"
        render={({ field }) => <Input {...field} />}
      />

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="dieCode"
          label="Die code"
          className="flex-[2_2_0]"
          render={({ field }) => <Input {...field} />}
        />

        <ExtrusionFormItem
          name="dieNumber"
          label="Die number"
          className="flex-1"
          render={({ field }) => (
            <Input type="number" min={0} step={1} {...field} />
          )}
        />
      </div>

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="cavity"
          label="Cavity"
          render={({ field }) => (
            <Input type="number" min={0} step={1} {...field} />
          )}
        />

        <ExtrusionFormItem
          name="productKgpm"
          label="Product Kg/m"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />
      </div>

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="billetType"
          label="Billet type"
          render={({ field }) => <Input {...field} />}
        />

        <ExtrusionFormItem
          name="lotNumberCode"
          label="Lot number"
          render={({ field }) => <Input {...field} />}
        />
      </div>

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="ingotRatio"
          label="Ingot ratio (%)"
          render={({ field }) => (
            <Input type="number" min={0} max={100} step={1} {...field} />
          )}
        />

        <ExtrusionFormItem
          name="billetKgpm"
          label="Billet Kg/m"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />
      </div>

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="billetLength"
          label="Billet length (mm)"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />

        <ExtrusionFormItem
          name="billetQuantity"
          label="Billet quantity"
          render={({ field }) => (
            <Input type="number" min={0} step={1} {...field} />
          )}
        />

        <ExtrusionFormItem
          name="billetWeight"
          label="Billet weight (g)"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />
      </div>

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="orderLength"
          label="Order length (mm)"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />

        <ExtrusionFormItem
          name="ramSpeed"
          label="Ram speed"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />
      </div>

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="billetTemp"
          label="Billet temperature"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />

        <ExtrusionFormItem
          name="outputTemp"
          label="Output temperature"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />
      </div>

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="ok"
          label="Result"
          render={({ field }) => (
            <ToggleGroup
              ref={field.ref}
              type="single"
              value={field.value}
              onValueChange={field.onChange}
            >
              <ToggleGroupItem value="true">OK</ToggleGroupItem>
              <ToggleGroupItem value="false">NG</ToggleGroupItem>
            </ToggleGroup>
          )}
        />

        <ExtrusionFormItem
          name="outputYield"
          label="Yield (%)"
          render={({ field }) => (
            <Input type="number" min={0} max={100} step={1} {...field} />
          )}
        />
      </div>

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="productionQuantity"
          label="Production quantity"
          render={({ field }) => (
            <Input type="number" min={0} step={1} {...field} />
          )}
        />

        <ExtrusionFormItem
          name="productionWeight"
          label="Production weight (g)"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />

        <ExtrusionFormItem
          name="outputRate"
          label="Output rate (kg/h)"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />
      </div>

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="ngQuantity"
          label="NG quantity"
          render={({ field }) => (
            <Input type="number" min={0} step={1} {...field} />
          )}
        />

        <ExtrusionFormItem
          name="ngWeight"
          label="NG weight (g)"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />

        <ExtrusionFormItem
          name="ngPercentage"
          label="NG Percentage (%)"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />
      </div>

      <ExtrusionFormItem
        name="remark"
        label="Remark"
        render={({ field }) => <Input {...field} />}
      />

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="code"
          label="Code"
          render={({ field }) => <Input {...field} />}
        />

        <ExtrusionFormItem
          name="buttWeight"
          label="Butt weight (g)"
          render={({ field }) => (
            <Input type="number" min={0} step="any" {...field} />
          )}
        />
      </div>

      <Button type="submit">Submit</Button>
    </Form>
  );
}

function ExtrusionFormItem({
  name,
  label,
  render,
  ...props
}: ComponentProps<typeof FormItem> & {
  name: string;
  label: ReactNode;
  render: ComponentProps<typeof FormField>['render'];
}) {
  return (
    <FormItem {...props}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <FormField name={name} render={render} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

async function getDefaultValues() {
  const now = new Date();
  return {
    date: now,
    shift: now.getHours() >= 8 && now.getHours() < 16 ? 'day' : 'night',
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

    ok: null,
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
  };
}
