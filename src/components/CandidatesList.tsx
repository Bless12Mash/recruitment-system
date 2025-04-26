import { useState } from "react";
import { Candidate } from "../types/interview";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    getPaginationRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
    SortableColumnHeader,
    FilterInputs,
    PaginationControls,
    roleOptions,
    levelOptions,
    getProgressStyle,
} from "./CandidatesList/utils";

interface CandidatesListProps {
    candidates: Candidate[]
    onCandidateClick: (candidate: Candidate) => void
}

export function CandidatesList({ candidates, onCandidateClick }: CandidatesListProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnSizing, setColumnSizing] = useState({})

    const columns: ColumnDef<Candidate>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <SortableColumnHeader column={column}>Name</SortableColumnHeader>
            ),
            enableResizing: true,
            size: 150,
        },
        {
            accessorKey: "role",
            header: ({ column }) => (
                <SortableColumnHeader column={column}>Role</SortableColumnHeader>
            ),
            cell: ({ row }) => roleOptions.find(role => role.value === row.getValue("role"))?.label,
            enableResizing: true,
            size: 180,
        },
        {
            accessorKey: "level",
            header: ({ column }) => (
                <SortableColumnHeader column={column}>Level</SortableColumnHeader>
            ),
            cell: ({ row }) => levelOptions.find(level => level.value === row.getValue("level"))?.label,
            enableResizing: true,
            size: 120,
        },
        {
            accessorKey: "progress",
            header: ({ column }) => (
                <SortableColumnHeader column={column}>Progress</SortableColumnHeader>
            ),
            cell: ({ row }) => {
                const progress = row.getValue("progress") as string;
                return (
                    <span className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        getProgressStyle(progress)
                    )}>
                        {progress}
                    </span>
                );
            },
            enableResizing: true,
            size: 140,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <SortableColumnHeader column={column}>Status</SortableColumnHeader>
            ),
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <span className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        status === "Open" ? "bg-green-100 text-green-800 ring-green-600/20" : "bg-red-100 text-red-800 ring-red-600/20"
                    )}>
                        {status}
                    </span>
                );
            },
            enableResizing: true,
            size: 120,
        },
        {
            accessorKey: "location",
            header: ({ column }) => (
                <SortableColumnHeader column={column}>Location</SortableColumnHeader>
            ),
        },
        {
            accessorKey: "createdBy",
            header: ({ column }) => (
                <SortableColumnHeader column={column}>Created By</SortableColumnHeader>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <SortableColumnHeader column={column}>Created At</SortableColumnHeader>
            ),
            cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => (
                <SortableColumnHeader column={column}>Updated At</SortableColumnHeader>
            ),
            cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleDateString(),
        },
    ];

    const table = useReactTable({
        data: candidates,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnSizingChange: setColumnSizing,
        state: {
            sorting,
            columnFilters,
            columnSizing,
        },
        enableColumnResizing: true,
        columnResizeMode: "onChange",
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="container mx-auto py-10">
            <FilterInputs table={table} />
            <div className="rounded-md border mt-4">
                <Table className="overflow-auto">
                    <TableCaption>A list of candidates.</TableCaption>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{
                                            width: header.getSize(),
                                            position: "relative"
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        {header.column.getCanResize() && (
                                            <div
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                className={`absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-200 opacity-0 hover:opacity-100
                                                    ${header.column.getIsResizing()
                                                        ? "bg-blue-500 opacity-100"
                                                        : ""
                                                    }`}
                                            />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => onCandidateClick(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <PaginationControls table={table} />
        </div>
    );
}