import { ComponentProps } from 'react';
import { FormControl } from './form';
import { Input } from './input';
import { ToggleGroup } from './toggle-group';
import { DatePicker } from './date-picker';
import { TimePicker } from './time-picker';

export function FormInput(props: ComponentProps<typeof Input>) {
  return (
    <FormControl render={({ field }) => <Input {...field} {...props} />} />
  );
}

export function FormToggleGroup(props: ComponentProps<typeof ToggleGroup>) {
  return (
    <FormControl
      render={({ field: { value, onChange, ...fieldRest } }) => (
        <ToggleGroup
          value={value}
          onValueChange={onChange}
          {...fieldRest}
          {...props}
        />
      )}
    />
  );
}

export function FormDatePicker(
  props: Omit<ComponentProps<typeof DatePicker>, 'date' | 'onDateChange'>
) {
  return (
    <FormControl
      render={({ field: { value, onChange, ...fieldRest } }) => {
        if (value !== null && !(value instanceof Date)) {
          throw new Error(
            'FormDatePicker should be used within <FormField> of a Date field'
          );
        }
        return (
          <DatePicker
            date={value}
            onDateChange={onChange}
            {...fieldRest}
            {...props}
          />
        );
      }}
    />
  );
}

export function FormTimePicker(
  props: Omit<ComponentProps<typeof TimePicker>, 'value' | 'onChange'>
) {
  return (
    <FormControl
      render={({ field: { value, onChange, ...fieldRest } }) => {
        return (
          <TimePicker
            value={value}
            onChange={onChange}
            {...fieldRest}
            {...props}
          />
        );
      }}
    />
  );
}
