import {
  ComponentProps,
  MutableRefObject,
  useCallback,
  KeyboardEvent,
} from 'react';
import { FormField, FormLabel } from '@/components/ui/form';
import {
  FormInput,
  FormAutoComplete,
  FormToggleGroup,
  FormDatePicker,
  FormTimePicker,
} from '@/components/ui/form-adapters';
import { getLabel, getColumnUnit } from '@/lib/columns';
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
  inputRef,
  nextRef,
  ...rest
}: {
  name: T;
  inputRef?: MutableRefObject<HTMLElement | undefined>;
  nextRef?: MutableRefObject<HTMLElement | undefined>;
} & ComponentProps<typeof FormField>) {
  const __ = useTranslate();
  const unit = getColumnUnit(name);
  return (
    <FormField name={name} {...rest}>
      <FormLabel>
        {getLabel(name, __)}
        {unit ? <span> ({unit})</span> : null}
      </FormLabel>
      <Field name={name} inputRef={inputRef} nextRef={nextRef} />
    </FormField>
  );
}

function Field<T extends MutableFields>({
  name,
  inputRef,
  nextRef,
}: {
  name: T;
  inputRef?: MutableRefObject<HTMLElement | undefined>;
  nextRef?: MutableRefObject<HTMLElement | undefined>;
}) {
  const { data } = useSuggestionData();
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (!nextRef) return;
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        nextRef.current?.focus();
      }
    },
    [nextRef]
  );

  switch (name) {
    case 'date':
      return (
        <div>
          <FormDatePicker inputRef={inputRef} onKeyDown={handleKeyDown} />
        </div>
      );
    case 'startTime':
    case 'endTime':
      return (
        <FormTimePicker
          className="justify-start"
          inputRef={inputRef}
          onKeyDown={handleKeyDown}
        />
      );
    // case 'shift':
    //   return <FormToggleGroup type="single" items={shiftItems} />;
    case 'result':
      return (
        <FormToggleGroup
          type="single"
          items={resultItems}
          className="justify-start"
          inputRef={inputRef}
          onKeyDown={handleKeyDown}
        />
      );
    // case 'item':
    //   return <FormAutoComplete options={data?.itemList || []} />;
    // case 'customer':
    //   return <FormAutoComplete options={data?.customerList || []} />;
    case 'dieCode':
      return (
        <FormAutoComplete
          options={data?.dieCodeList || []}
          inputRef={inputRef}
          onKeyDown={handleKeyDown}
        />
      );
    case 'billetType':
      return (
        <FormAutoComplete
          options={data?.billetTypeList || []}
          inputRef={inputRef}
          onKeyDown={handleKeyDown}
        />
      );
    case 'lotNumberCode':
      return (
        <FormAutoComplete
          options={data?.lotNoList || []}
          inputRef={inputRef}
          onKeyDown={handleKeyDown}
        />
      );
    case 'coolingMethod':
      return (
        <FormAutoComplete
          options={data?.coolingMethodList || []}
          inputRef={inputRef}
          onKeyDown={handleKeyDown}
        />
      );
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
    case 'beforeSewing':
    case 'afterSewing':
      return <FormInput inputRef={inputRef} onKeyDown={handleKeyDown} />;
  }
}
