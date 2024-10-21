import {
  ComponentProps,
  RefCallback,
  useState,
  useRef,
  useCallback,
  type KeyboardEvent,
} from 'react';
import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from './command';
import { Input } from './input';
import { Command as CommandPrimitive } from 'cmdk';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

type AutoCompleteProps = ComponentProps<typeof Input> & {
  options: string[];
  emptyMessage?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  isLoading?: boolean;
  inputRef?: RefCallback<HTMLElement | undefined>;
};

export const AutoComplete = ({
  options,
  emptyMessage = 'No results found',
  value,
  onValueChange,
  isLoading = false,
  onChange,
  onFocus,
  onBlur,
  className,
  inputRef,
  onKeyDown,
  ...rest
}: AutoCompleteProps) => {
  const internalInputRef = useRef<HTMLInputElement>();
  const cmdListRef = useRef<HTMLDivElement>();
  const [isOpen, setOpen] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        if (cmdListRef.current) {
          const optionElements = Array.from(
            cmdListRef.current?.children.item(0)?.children || []
          );
          const selectedOptionEl = optionElements.find(
            (el) => el.getAttribute('data-selected') === 'true'
          );
          const selectedValue = selectedOptionEl?.getAttribute('data-value');
          if (selectedValue) {
            onValueChange?.(selectedValue);
          }
        }
      }

      if (event.key === 'Escape') {
        event.currentTarget?.blur?.();
      }

      onKeyDown?.(event);
    },
    [isOpen, options, onValueChange]
  );

  const handleSelectOption = useCallback(
    (selectedOption: string) => {
      onValueChange?.(selectedOption);
      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        internalInputRef?.current?.blur();
      }, 0);
    },
    [onValueChange]
  );

  return (
    <CommandPrimitive>
      <div>
        <CommandInput
          ref={(el) => {
            internalInputRef.current = el || undefined;
            inputRef?.(el);
          }}
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
          onKeyDown={handleKeyDown}
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
          <CommandList
            scrollAreaClassName="rounded-md border"
            ref={(el) => {
              cmdListRef.current = el || undefined;
            }}
          >
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
                      onSelect={() => handleSelectOption(option)}
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
