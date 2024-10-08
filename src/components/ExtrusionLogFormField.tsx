import { ComponentProps } from 'react';
import { FormField, FormLabel } from '@/components/ui/form';
import {
  FormInput,
  FormAutoComplete,
  FormToggleGroup,
  FormDatePicker,
  FormTimePicker,
} from '@/components/ui/form-adapters';
import { getLabel } from '@/app/[locale]/(protected)/dashboard/columns';
import { MutableFields } from '@/lib/types';
import { useSuggestionData } from '@/lib/client';

const shiftItems = [
  { value: 'DAY', label: 'Day' },
  { value: 'NIGHT', label: 'Night' },
];

const resultItems = [
  { value: 'OK', label: 'OK' },
  { value: 'NG', label: 'NG' },
];

export default function ExtrusionLogFormField<T extends MutableFields>({
  name,
  ...rest
}: {
  name: T;
} & ComponentProps<typeof FormField>) {
  return (
    <FormField name={name} {...rest}>
      <FormLabel>{getLabel(name)}</FormLabel>
      <Field name={name} />
    </FormField>
  );
}

function Field<T extends MutableFields>({ name }: { name: T }) {
  const { data } = useSuggestionData();
  switch (name) {
    case 'date':
      return (
        <div>
          <FormDatePicker />
        </div>
      );
    case 'startTime':
    case 'endTime':
      return <FormTimePicker />;
    case 'shift':
      return <FormToggleGroup type="single" items={shiftItems} />;
    case 'result':
      return <FormToggleGroup type="single" items={resultItems} />;
    case 'item':
      return <FormAutoComplete options={data?.itemList || []} />;
    case 'customer':
      return <FormAutoComplete options={data?.customerList || []} />;
    case 'dieCode':
      return <FormAutoComplete options={data?.dieCodeList || []} />;
    case 'billetType':
      return <FormAutoComplete options={data?.billetTypeList || []} />;
    case 'lotNumberCode':
      return <FormAutoComplete options={data?.lotNoList || []} />;
    case 'code':
      return <FormAutoComplete options={data?.codeList || []} />;
    case 'ingotRatio':
    case 'outputYield':
    case 'ngPercentage':
      return <FormInput max={100} />;
    case 'ngQuantity':
    case 'employeeId':
    case 'dieNumber':
    case 'cavity':
    case 'productKgpm':
    case 'billetKgpm':
    case 'billetLength':
    case 'billetQuantity':
    case 'billetWeight':
    case 'ramSpeed':
    case 'billetTemp':
    case 'outputTemp':
    case 'orderLength':
    case 'outputRate':
    case 'productionQuantity':
    case 'productionWeight':
    case 'ngWeight':
    case 'remark':
    case 'buttWeight':
      return <FormInput />;
  }
}
