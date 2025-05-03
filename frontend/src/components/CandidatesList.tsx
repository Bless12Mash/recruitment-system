import { useState, useEffect } from "react";
import { Candidate } from "../types/interview";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    PaginationState,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
    SortableColumnHeader,
    FilterInputs,
    PaginationControls,
    roleOptions,
    getProgressStyle,
} from "./CandidatesList/utils";
import { fetchPaginatedCandidates } from "@/lib/api";
import { CandidateLevel } from "@shared/enums";

interface CandidatesListProps {
    onCandidateClick: (candidate: Candidate) => void
}

export function CandidatesList({ onCandidateClick }: CandidatesListProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnSizing, setColumnSizing] = useState({})
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [data, setData] = useState<{ items: Candidate[], total: number }>({ items: [], total: 0 })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const sortField = sorting[0]?.id
                const sortOrder = sorting[0]?.desc ? "DESC" : "ASC"

                const filters: Record<string, string> = {}
                columnFilters.forEach(filter => {
                    filters[filter.id] = filter.value as string
                })


                const result = await fetchPaginatedCandidates(
                    { page: pageIndex + 1, pageSize },
                    sortField ? { field: sortField, order: sortOrder } : undefined,
                    Object.keys(filters).length > 0 ? filters : undefined
                )
                setData({ items: result.items, total: result.total })
            } catch (error) {
                console.error('Error fetching candidates:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [pageIndex, pageSize, sorting, columnFilters])

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
            cell: ({ row }) => Object.keys(CandidateLevel).find(level => level.valueOf() === row.getValue("level"))?.valueOf(),
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
                        status === "OPEN" ? "bg-green-100 text-green-800 ring-green-600/20" : "bg-red-100 text-red-800 ring-red-600/20"
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
        data: data.items,
        columns,
        pageCount: Math.ceil(data.total / pageSize),
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnSizingChange: setColumnSizing,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        state: {
            sorting,
            columnFilters,
            columnSizing,
            pagination: { pageIndex, pageSize },
        },
        enableColumnResizing: true,
        columnResizeMode: "onChange",
    })

    return (
        <div className="container mx-auto">
            <FilterInputs table={table} />
            <div className="rounded-md border mt-4 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                    </div>
                )}
                <Table className="overflow-auto">
                    <TableCaption>A list of candidates.</TableCaption>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="text-center"
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
            <PaginationControls
                table={table}
                totalItems={data.total}
                isLoading={isLoading}
            />
        </div>
    );
}