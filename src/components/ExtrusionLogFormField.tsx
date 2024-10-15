import { ComponentProps } from 'react';
import { FormField, FormLabel } from '@/components/ui/form';
import {
  FormInput,
  FormAutoComplete,
  FormToggleGroup,
  FormDatePicker,
  FormTimePicker,
} from '@/components/ui/form-adapters';
import { getLabel } from '@/lib/columns';
import { MutableFields } from '@/lib/types';
import { useSuggestionData } from '@/lib/client';
import { useTranslate } from '@/lib/intl/client';

// const shiftItems = [
//   { value: 'DAY', label: 'Day' },
//   { value: 'NIGHT', label: 'Night' },
// ];

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
  const __ = useTranslate();
  return (
    <FormField name={name} {...rest}>
      <FormLabel>{getLabel(name, __)}</FormLabel>
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
      return <FormTimePicker className="justify-start" />;
    // case 'shift':
    //   return <FormToggleGroup type="single" items={shiftItems} />;
    case 'result':
      return (
        <FormToggleGroup
          type="single"
          items={resultItems}
          className="justify-start"
        />
      );
    // case 'item':
    //   return <FormAutoComplete options={data?.itemList || []} />;
    // case 'customer':
    //   return <FormAutoComplete options={data?.customerList || []} />;
    case 'dieCode':
      return <FormAutoComplete options={data?.dieCodeList || []} />;
    case 'billetType':
      return <FormAutoComplete options={data?.billetTypeList || []} />;
    case 'lotNumberCode':
      return <FormAutoComplete options={data?.lotNoList || []} />;
    case 'coolingMethod':
      return <FormAutoComplete options={data?.coolingMethodList || []} />;
    // case 'code':
    //   return <FormAutoComplete options={data?.codeList || []} />;
    case 'ingotRatio':
    // case 'outputYield':
    // case 'ngPercentage':
    //   return <FormInput max={100} />;
    case 'ngQuantity':
    // case 'employeeId':
    case 'subNumber':
    // case 'cavity':
    // case 'productKgpm':
    // case 'billetKgpm':
    case 'billetLength':
    case 'billetQuantity':
    // case 'billetWeight':
    case 'ramSpeed':
    case 'billetTemp':
    case 'outputTemp':
    case 'orderLength':
    // case 'outputRate':
    case 'productionQuantity':
    // case 'productionWeight':
    // case 'ngWeight':
    case 'remark':
    case 'buttLength':
    case 'dieTemp':
    case 'containerTemp':
    case 'pressure':
    case 'pullerMode':
    case 'pullerSpeed':
    case 'pullerForce':
    case 'extrusionCycle':
    case 'extrusionLength':
    case 'segments':
    case 'coolingMode':
    case 'startButt':
    case 'endButt':
      return <FormInput />;
  }
}
