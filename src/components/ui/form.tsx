'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useId,
  forwardRef,
  HTMLAttributes,
  ElementRef,
  ComponentPropsWithoutRef,
  HTMLProps,
  ComponentType,
} from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  useController,
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
  type UseFormReturn,
  type SubmitHandler,
  type Path,
  type ControllerRenderProps,
  type ControllerFieldState,
  type FormState,
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const Form = <TFieldValues extends FieldValues = FieldValues>({
  form,
  children,
  onSubmit,
  ...props
}: Omit<HTMLProps<HTMLFormElement>, 'form' | 'onSubmit'> & {
  form: UseFormReturn<TFieldValues>;
  children: ReactNode;
  onSubmit: SubmitHandler<TFieldValues>;
}) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
      <FormProvider {...form}>{children}</FormProvider>
    </form>
  );
};

type FormFieldContextValue = {
  name: string;
  field: ControllerRenderProps;
  fieldState: ControllerFieldState;
  id: string;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  {
    className,
    name,
    ...props
  }: HTMLAttributes<HTMLDivElement> & { name: TName },
  ref: React.Ref<HTMLDivElement>
) {
  const { field, fieldState } = useController({ name });
  const id = useId();

  return (
    <FormFieldContext.Provider value={{ id, name, field, fieldState }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormFieldContext.Provider>
  );
}
const ForwardedFormField = forwardRef(FormField);
ForwardedFormField.displayName = 'FormField';

// const FormField = <
//   TFieldValues extends FieldValues = FieldValues,
//   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
// >({
//   ...props
// }: ControllerProps<TFieldValues, TName>) => {
//   const { control } = useFormContext<TFieldValues>();

//   return (
//     <FormFieldContext.Provider value={{ name: props.name }}>
//       <Controller control={control} {...props} />
//     </FormFieldContext.Provider>
//   );
// };

function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }
  const { id, fieldState, field } = fieldContext;

  return {
    id,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    field,
    fieldState,
  };
}

// type FormItemContextValue = {
//   id: string;
// };

// const FormItemContext = createContext<FormItemContextValue>(
//   {} as FormItemContextValue
// );

const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const {
    fieldState: { error },
    formItemId,
  } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

type FieldRenderProps = ControllerRenderProps & {
  id: string;
  'aria-describedby': string;
  'aria-invalid': boolean;
};
type RenderProps<TFieldValues extends FieldValues> = {
  field: FieldRenderProps;
  fieldState: ControllerFieldState;
  formState: FormState<TFieldValues>;
};
type RenderFunc<TFieldValues extends FieldValues> = (
  props: RenderProps<TFieldValues>
) => ReactNode;

function FormControl<TFieldValues extends FieldValues = FieldValues>(props: {
  render: RenderFunc<TFieldValues>;
}): ReactNode;
function FormControl<TFieldValues extends FieldValues = FieldValues>(props: {
  Component: ComponentType<RenderProps<TFieldValues>>;
}): ReactNode;

function FormControl<TFieldValues extends FieldValues = FieldValues>({
  render,
  Component,
  ...rest
}: {
  render?: RenderFunc<TFieldValues>;
  Component?: ComponentType<RenderProps<TFieldValues>>;
}) {
  const { formState } = useFormContext<TFieldValues>();
  const { field, fieldState, formItemId, formDescriptionId, formMessageId } =
    useFormField();
  const renderProps = {
    field: {
      ...field,
      id: formItemId,
      'aria-describedby': !fieldState.error
        ? `${formDescriptionId}`
        : `${formDescriptionId} ${formMessageId}`,

      'aria-invalid': !!fieldState.error,
    },
    fieldState,
    formState,
    ...rest,
  };

  if (render) {
    return render(renderProps);
  }
  if (Component) {
    return <Component {...renderProps} {...rest} />;
  }
}

FormControl.displayName = 'FormControl';

const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const {
    fieldState: { error },
    formMessageId,
  } = useFormField();
  if (error) {
    console.log('field err', error, formMessageId);
  }
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export {
  useFormField,
  Form,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  ForwardedFormField as FormField,
  type RenderProps,
};
