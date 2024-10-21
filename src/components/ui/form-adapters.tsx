import { ComponentProps, MutableRefObject } from 'react';
import { FormControl } from './form';
import { Input } from './input';
import { AutoComplete } from './autocomplete';
import { ToggleGroup } from './toggle-group';
import { DatePicker } from './date-picker';
import { TimePicker } from './time-picker';

export function FormInput({
  inputRef,
  ...rest
}: ComponentProps<typeof Input> & {
  inputRef?: MutableRefObject<HTMLElement | undefined>;
}) {
  return (
    <FormControl
      render={({ field: { ref, ...fieldRest } }) => (
        <Input
          ref={(el) => {
            if (inputRef) {
              inputRef.current = el as HTMLElement;
            }
            if (ref) {
              ref(el);
            }
          }}
          {...fieldRest}
          {...rest}
        />
      )}
    />
  );
}

export function FormAutoComplete({
  inputRef,
  ...rest
}: Omit<ComponentProps<typeof AutoComplete>, 'inputRef'> & {
  inputRef?: MutableRefObject<HTMLElement | undefined>;
}) {
  return (
    <FormControl
      render={({ field: { ref, onChange, ...fieldRest } }) => (
        <AutoComplete
          inputRef={(el) => {
            if (inputRef) {
              inputRef.current = el as HTMLElement;
            }
            if (ref) {
              ref(el);
            }
          }}
          {...fieldRest}
          onValueChange={onChange}
          {...rest}
        />
      )}
    />
  );
}

export function FormToggleGroup({
  inputRef,
  ...rest
}: ComponentProps<typeof ToggleGroup> & {
  inputRef?: MutableRefObject<HTMLElement | undefined>;
}) {
  return (
    <FormControl
      render={({ field: { ref, value, onChange, ...fieldRest } }) => (
        <ToggleGroup
          value={value}
          onValueChange={onChange}
          ref={(el) => {
            if (inputRef) {
              inputRef.current = el as HTMLElement;
            }
            if (ref) {
              ref(el);
            }
          }}
          {...fieldRest}
          {...rest}
        />
      )}
    />
  );
}

export function FormDatePicker({
  inputRef,
  ...rest
}: Omit<
  ComponentProps<typeof DatePicker>,
  'date' | 'onDateChange' | 'inputRef'
> & {
  inputRef?: MutableRefObject<HTMLElement | undefined>;
}) {
  return (
    <FormControl
      render={({ field: { ref, value, onChange, ...fieldRest } }) => {
        if (value !== null && !(typeof value === 'string')) {
          throw new Error(
            'FormDatePicker should be used within <FormField> of a Date field'
          );
        }
        return (
          <DatePicker
            date={value}
            onDateChange={onChange}
            inputRef={(el) => {
              if (inputRef) {
                inputRef.current = el as HTMLElement;
              }
              if (ref) {
                ref(el);
              }
            }}
            {...fieldRest}
            {...rest}
          />
        );
      }}
    />
  );
}

export function FormTimePicker({
  inputRef,
  ...rest
}: Omit<ComponentProps<typeof TimePicker>, 'value' | 'onChange'> & {
  inputRef?: MutableRefObject<HTMLElement | undefined>;
}) {
  return (
    <FormControl
      render={({ field: { ref, value, onChange, ...fieldRest } }) => {
        return (
          <TimePicker
            value={value}
            onChange={onChange}
            ref={(el) => {
              if (inputRef) {
                inputRef.current = el as HTMLElement;
              }
              if (ref) {
                ref(el);
              }
            }}
            {...fieldRest}
            {...rest}
          />
        );
      }}
    />
  );
}
