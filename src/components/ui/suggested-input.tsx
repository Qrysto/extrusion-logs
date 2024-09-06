'use client';

import { useState, useMemo, ComponentProps, ChangeEvent } from 'react';
import { Input } from './input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface SuggestedInputProps extends ComponentProps<typeof Input> {
  suggestions?: string[];
}

export function SuggestedInput({
  suggestions = [],
  value,
  onChange,
  onFocus,
  onBlur,
  ...rest
}: SuggestedInputProps) {
  const [open, setOpen] = useState(false);
  const filteredSuggestions = useMemo(
    () => suggestions.filter((s) => value && s.includes(String(value))),
    [value, suggestions]
  );

  return (
    <>
      <Input
        value={value}
        onChange={onChange}
        onFocus={(evt) => {
          console.log('focus');
          setOpen(true);
          onFocus?.(evt);
        }}
        onBlur={(evt) => {
          console.log('blur', evt);
          setOpen(false);
          onBlur?.(evt);
        }}
        {...rest}
      />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuContent>
          {!filteredSuggestions.length && (
            <DropdownMenuLabel>No results found</DropdownMenuLabel>
          )}
          {filteredSuggestions.map((suggestion) => (
            <DropdownMenuItem
              key={suggestion}
              onSelect={() => {
                onChange?.({
                  target: { value: suggestion },
                } as ChangeEvent<HTMLInputElement>);
              }}
            >
              {suggestion}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
