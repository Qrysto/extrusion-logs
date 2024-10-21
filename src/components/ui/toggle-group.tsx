'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { toggleVariants } from '@/components/ui/toggle';

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: 'default',
  variant: 'default',
});

const ToggleGroupRoot = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('flex items-center justify-center gap-1', className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroupRoot.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupStyledItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupStyledItem.displayName = ToggleGroupPrimitive.Item.displayName;

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupRoot>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupRoot> &
    VariantProps<typeof toggleVariants> & { items: ToggleGroupItem[] }
>(({ items, ...rest }, ref) => (
  <ToggleGroupRoot ref={ref} {...rest}>
    {items.map(({ value, label }) => (
      <ToggleGroupStyledItem
        key={value}
        value={value}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            rest.onValueChange?.(value);
          }
        }}
      >
        {label}
      </ToggleGroupStyledItem>
    ))}
  </ToggleGroupRoot>
));
ToggleGroup.displayName = 'ToggleGroup';

type ToggleGroupItem = {
  value: any;
  label: React.ReactNode;
};

export {
  ToggleGroup,
  ToggleGroupRoot,
  ToggleGroupStyledItem,
  type ToggleGroupItem,
};
