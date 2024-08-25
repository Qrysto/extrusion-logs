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
import { DatePicker, dateFormat } from '@/components/ui/date-picker';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const formSchema = z.object({
  date: z.date(),
  shift: z.enum(['day', 'night']),
  startTime: z.string(),
  endTime: z.string(),

  item: z.string(),
  customer: z.string(),
  dieCode: z.string(),
  dieNumber: z.number().min(0).int(),
  cavity: z.number().min(0).int(),
  productKgpm: z.number().min(0),
  billetType: z.string(),
  lotNo: z.string(),
  ingotRatio: z.number().int(),
  billetKgpm: z.number(),
  billetLength: z.number().int(),
  billetQuantity: z.number().int(),
  billetWeight: z.number(),
  orderLength: z.number().int(),
  ramSpeed: z.number(),
  billetTemp: z.number().int(),
  outputTemp: z.number().int(),

  productionQuantity: z.number().int(),
  productionWeight: z.number(),
  yield: z.number().int(),
  ok: z.enum(['OK', 'NG']),
  remark: z.string(),
  outputRate: z.number(),
  ngQuantity: z.number().int(),
  ngWeight: z.number(),
  ngPercentage: z.number().int(),
  code: z.string(),
  buttWeight: z.number(),
});

const timeFormat = 'H:m:s';

function onSubmit(values: z.infer<typeof formSchema>) {
  console.log('submit', values);
}

export default function ExtrusionLogForm() {
  const now = new Date();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: now,
      shift: now.getHours() >= 8 && now.getHours() < 16 ? 'day' : 'night',
      endTime: format(now, timeFormat),
    },
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="date"
          label="Date"
          render={({ field }) => (
            <div>
              <DatePicker
                dateStr={field.value ? format(field.value, dateFormat) : null}
                onDateChange={field.onChange}
              />
            </div>
          )}
        />

        <ExtrusionFormItem
          name="shift"
          label="Shift"
          render={({ field }) => (
            <ToggleGroup
              type="single"
              value={field.value}
              onValueChange={field.onChange}
            >
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="night">Night</ToggleGroupItem>
            </ToggleGroup>
          )}
        />
      </div>

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="startTime"
          label="Start time"
          className="flex-1"
          render={({ field }) => <Input type="time" step="1" {...field} />}
        />

        <ExtrusionFormItem
          name="endTime"
          label="End time"
          className="flex-1"
          render={({ field }) => <Input type="time" step="1" {...field} />}
        />
      </div>

      <ExtrusionFormItem
        name="item"
        label="Item"
        render={({ field }) => <Input placeholder="Enter item" {...field} />}
      />

      <ExtrusionFormItem
        name="customer"
        label="Customer"
        render={({ field }) => (
          <Input placeholder="Enter customer name" {...field} />
        )}
      />

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="dieCode"
          label="Die code"
          className="flex-[2_2_0]"
          render={({ field }) => (
            <Input placeholder="Enter die code" {...field} />
          )}
        />

        <ExtrusionFormItem
          name="dieNumber"
          label="Die number"
          className="flex-1"
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              step={1}
              placeholder="Enter die number"
              {...field}
            />
          )}
        />
      </div>

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="cavity"
          label="Cavity"
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              step={1}
              placeholder="Enter cavity"
              {...field}
            />
          )}
        />

        <ExtrusionFormItem
          name="productKgpm"
          label="Product Kg/m"
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              placeholder="Enter product kg/m"
              {...field}
            />
          )}
        />
      </div>

      <ExtrusionFormItem
        name="billetType"
        label="Billet type"
        render={({ field }) => (
          <Input placeholder="Enter billet type" {...field} />
        )}
      />

      <ExtrusionFormItem
        name="lotNo"
        label="Lot number"
        render={({ field }) => (
          <Input placeholder="Enter lot number" {...field} />
        )}
      />

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="ingotRatio"
          label="Ingot ratio (%)"
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              max={100}
              step={1}
              placeholder="Enter ingot ratio"
              {...field}
            />
          )}
        />

        <ExtrusionFormItem
          name="billetKgpm"
          label="Billet Kg/m"
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              placeholder="Enter billet kg/m"
              {...field}
            />
          )}
        />
      </div>

      <div className="flex gap-x-4">
        <ExtrusionFormItem
          name="billetLength"
          label="Billet length (mm)"
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              step={1}
              placeholder="Enter billet length"
              {...field}
            />
          )}
        />

        <ExtrusionFormItem
          name="billetQuantity"
          label="Billet quantity"
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              step={1}
              placeholder="Enter billet quantity"
              {...field}
            />
          )}
        />

        <ExtrusionFormItem
          name="billetWeight"
          label="Billet weight (g)"
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              placeholder="Enter billet weight"
              {...field}
            />
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
