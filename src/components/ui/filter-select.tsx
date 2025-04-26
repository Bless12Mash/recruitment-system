import React from 'react'
import { Button } from './button'
import { cn } from '../../lib/utils'

interface FilterSelectProps<T extends string> {
    options: T[]
    value: T | null
    onChange: (value: T | null) => void
    className?: string
}

export function FilterSelect<T extends string>({
    options,
    value,
    onChange,
    className
}: FilterSelectProps<T>) {
    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            <Button
                variant={value === null ? "default" : "outline"}
                size="sm"
                onClick={() => onChange(null)}
            >
                All
            </Button>
            {options.map((option) => (
                <Button
                    key={option}
                    variant={value === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange(option)}
                >
                    {option}
                </Button>
            ))}
        </div>
    )
}