import { ComponentProps } from 'react';
import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from './command';
import { Input } from './input';
import { Command as CommandPrimitive } from 'cmdk';
import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { Skeleton } from './skeleton';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type AutoCompleteProps = ComponentProps<typeof Input> & {
  options: string[];
  emptyMessage?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onOptionSelected?: (value: string) => void;
  isLoading?: boolean;
};

export const AutoComplete = ({
  options,
  emptyMessage = 'No results found',
  value,
  onValueChange,
  onOptionSelected,
  isLoading = false,
  onChange,
  onFocus,
  onBlur,
  className,
  ...rest
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setOpen] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === 'Enter' && input.value !== '') {
        const optionToSelect = options.find((option) => option === input.value);
        if (optionToSelect) {
          onValueChange?.(optionToSelect);
        }
      }

      if (event.key === 'Escape') {
        input.blur();
      }
    },
    [isOpen, options, onValueChange]
  );

  const handleSelectOption = useCallback(
    (selectedOption: string) => {
      onValueChange?.(selectedOption);
      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 0);
    },
    [onValueChange]
  );

  return (
    <CommandPrimitive onKeyDown={handleKeyDown} tabIndex={undefined}>
      <div>
        <CommandInput
          ref={inputRef}
          tabIndex={0}
          value={value}
          onValueChange={(value) => {
            if (!isLoading) {
              onValueChange?.(value);
            }
            // onChange?.(evt);
          }}
          onBlur={(evt) => {
            setOpen(false);
            onBlur?.(evt);
          }}
          onFocus={(evt) => {
            setOpen(true);
            onFocus?.(evt);
          }}
          className={cn('text-base', className)}
          {...rest}
        />
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            'animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-popover text-popover-foreground outline-none',
            isOpen ? 'block' : 'hidden'
          )}
        >
          <CommandList scrollAreaClassName="rounded-md border">
            {isLoading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {options.length > 0 && !isLoading
              ? options.map((option) => {
                  // const isSelected = value === option;
                  return (
                    <CommandItem
                      key={option}
                      value={option}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => {
                        handleSelectOption(option);
                        onOptionSelected?.(option);
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 cursor-pointer'
                      )}
                    >
                      {/* {isSelected && <Check className="w-4" />} */}
                      {option}
                    </CommandItem>
                  );
                })
              : null}
            {!isLoading ? (
              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
