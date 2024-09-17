import { ReactNode, ComponentProps } from 'react';
import { FormField, FormLabel } from '@/components/ui/form';
import {
  FormInput,
  FormAutoComplete,
  FormToggleGroup,
  FormDatePicker,
  FormTimePicker,
} from '@/components/ui/form-adapters';
import { getLabel } from '@/app/(protected)/dashboard/columns';
import { MutableFields, SuggestionData } from '@/lib/types';

const shiftItems = [
  { value: 'DAY', label: 'Day' },
  { value: 'NIGHT', label: 'Night' },
];

const resultItems = [
  { value: 'OK', label: 'OK' },
  { value: 'NG', label: 'NG' },
];

export default function ExtrusionLogField<T extends MutableFields>({
  field,
  data,
}: {
  field: T;
  data?: SuggestionData;
}) {
  switch (field) {
    case 'date':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <div>
            <FormDatePicker />
          </div>
        </FormItem>
      );
    case 'shift':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormToggleGroup type="single" items={shiftItems} />
        </FormItem>
      );
    case 'employeeId':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput />
        </FormItem>
      );
    case 'item':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormAutoComplete options={data?.itemList || []} />
        </FormItem>
      );
    case 'customer':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormAutoComplete options={data?.customerList || []} />
        </FormItem>
      );
    case 'dieCode':
      return (
        <FormItem name={field} label={getLabel(field)} className="flex-[2_2_0]">
          <FormAutoComplete options={data?.dieCodeList || []} />
        </FormItem>
      );
    case 'dieNumber':
      return (
        <FormItem name={field} label={getLabel(field)} className="flex-1">
          <FormInput />
        </FormItem>
      );
    case 'cavity':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput />
        </FormItem>
      );
    case 'productKgpm':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'billetType':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormAutoComplete options={data?.billetTypeList || []} />
        </FormItem>
      );
    case 'billetKgpm':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'billetLength':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'billetQuantity':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput />
        </FormItem>
      );
    case 'billetWeight':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'ingotRatio':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput max={100} />
        </FormItem>
      );
    case 'lotNumberCode':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormAutoComplete options={data?.lotNoList || []} />
        </FormItem>
      );
    case 'ramSpeed':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'billetTemp':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'outputTemp':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'orderLength':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'outputRate':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'productionQuantity':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput />
        </FormItem>
      );
    case 'productionWeight':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'result':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormToggleGroup type="single" items={resultItems} />
        </FormItem>
      );
    case 'outputYield':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput max={100} />
        </FormItem>
      );
    case 'ngQuantity':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput />
        </FormItem>
      );
    case 'ngWeight':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'ngPercentage':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'remark':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput />
        </FormItem>
      );
    case 'buttWeight':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormInput step="any" />
        </FormItem>
      );
    case 'code':
      return (
        <FormItem name={field} label={getLabel(field)}>
          <FormAutoComplete options={data?.codeList || []} />
        </FormItem>
      );
    case 'startTime':
      return (
        <FormItem name={field} label={getLabel(field)} className="flex-1">
          <FormTimePicker />
        </FormItem>
      );
    case 'endTime':
      return (
        <FormItem name={field} label={getLabel(field)} className="flex-1">
          <FormTimePicker />
        </FormItem>
      );
  }
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
