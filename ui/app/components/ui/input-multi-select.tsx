import { Command as CommandPrimitive } from 'cmdk'
import { useCallback, useRef, useState, type KeyboardEvent } from 'react'

import { Square, SquareCheckBig } from 'lucide-react'
import { cn } from '~/lib/utils'
import { CommandGroup, CommandInput, CommandItem, CommandList } from './command'

export type Item = {
  title?: string | null
  id: string
}

type Props<T extends Item> = {
  items: T[]
  emptyMessage: string
  selectedItems: T[]
  onItemChange: (values: T[]) => void
  disabled?: boolean
  placeholder?: string
  renderItem?: (item: T) => JSX.Element
  renderMenu?: JSX.Element
  onSearch?: (search: string) => void
  searchValue?: string
}

export function InputMultiSelect<T extends Item>({
  items,
  placeholder,
  emptyMessage,
  selectedItems,
  onItemChange,
  disabled,
  renderItem,
  renderMenu,
  onSearch,
  searchValue,
}: Props<T>) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string>(searchValue ?? '')
  const searchTimerRef = useRef<number>()

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (!input) {
        return
      }

      // Keep the items displayed when the user is typing
      if (!isOpen) {
        setOpen(true)
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === 'Enter' && input.value !== '') {
        const itemSelected = items.find((item) => item.title === input.value)
        if (itemSelected) {
          onItemChange([...selectedItems, itemSelected])
        }
      }

      if (event.key === 'Escape') {
        input.blur()
      }
    },
    [isOpen, items, onItemChange, selectedItems],
  )

  const handleBlur = useCallback(() => {
    setOpen(false)
  }, [])

  const onItemSelect = useCallback(
    (selectedItem: T) => {
      const itemSelectedIndex = selectedItems.findIndex((item) => item.id === selectedItem.id)

      if (itemSelectedIndex !== -1) {
        const newItems = [...selectedItems]
        newItems.splice(itemSelectedIndex, 1)
        onItemChange(newItems)
        return
      }
      onItemChange([...selectedItems, selectedItem])
    },
    [onItemChange, selectedItems],
  )

  const onInputChange = (value: string) => {
    setInputValue(value)

    clearTimeout(searchTimerRef.current)
    searchTimerRef.current = window.setTimeout(() => {
      onSearch?.(value)
    }, 500)
  }

  return (
    <CommandPrimitive shouldFilter={!onSearch} onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={onInputChange}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          containerClassName="border rounded-md"
          className="text-base"
        />
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            'animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-white outline-none',
            isOpen ? 'block' : 'hidden',
          )}
        >
          <CommandList className="rounded-lg ring-1 ring-slate-200">
            {renderMenu ? (
              <CommandItem
                className="p-3 w-full border-b aria-selected:bg-white"
                onMouseDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
              >
                {renderMenu}
              </CommandItem>
            ) : null}

            {items.length > 0 ? (
              <CommandGroup>
                {items.map((item) => {
                  const isSelected = selectedItems.find((selectedItem) => selectedItem.id === item.id)
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                      onSelect={() => onItemSelect(item)}
                      className={cn('flex w-full items-center gap-2 border-b rounded-none py-4 cursor-pointer')}
                    >
                      {isSelected ? <SquareCheckBig className="w-5 mr-8" /> : <Square className="w-5 mr-8" />}
                      {renderItem ? renderItem(item) : item.title}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ) : null}
            <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">{emptyMessage}</CommandPrimitive.Empty>
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  )
}
