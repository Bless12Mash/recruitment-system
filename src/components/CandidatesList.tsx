import { useState } from "react";
import { Candidate } from "../types/interview";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidatesListProps {
    candidates: Candidate[]
    onCandidateClick: (candidate: Candidate) => void
}

export function CandidatesList({ candidates, onCandidateClick }: CandidatesListProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const statusOptions = [
        { label: "Open", value: "Open" },
        { label: "Closed", value: "Closed" },
    ]

    const levelOptions = [
        { label: "Junior", value: "Junior" },
        { label: "Mid", value: "Mid" },
        { label: "Senior", value: "Senior" },
        { label: "Lead", value: "Lead" },
    ]

    const roleOptions = [
        { label: "Frontend Developer", value: "Frontend Developer" },
        { label: "Backend Developer", value: "Backend Developer" },
        { label: "Full Stack Developer", value: "Full Stack Developer" },
        { label: "DevOps Engineer", value: "DevOps Engineer" },
        { label: "UI/UX Designer", value: "UI/UX Designer" },
        { label: "Product Manager", value: "Product Manager" },
    ]

    const progressOptions = [
        { label: "Hired", value: "Hired" },
        { label: "Rejected", value: "Rejected" },
        { label: "On Hold", value: "On Hold" },
        { label: "Shortlisted", value: "Shortlisted" },
        { label: "Pending", value: "Pending" },
        { label: "Offered", value: "Offered" },
        { label: "Offer Accepted", value: "Offer Accepted" },
        { label: "Offer Rejected", value: "Offer Rejected" },
    ]

    const columns: ColumnDef<Candidate>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "role",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Role
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => roleOptions.find(role => role.value === row.getValue("role"))?.label,
        },
        {
            accessorKey: "level",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Level
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => levelOptions.find(level => level.value === row.getValue("level"))?.label,
        },
        {
            accessorKey: "progress",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Progress
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const progress = row.getValue("progress") as string
                return (
                    <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                        {
                            "bg-green-50 text-green-700": progress === "Hired" || progress === "Offer Accepted",
                            "bg-red-50 text-red-700": progress === "Rejected" || progress === "Offer Rejected",
                            "bg-yellow-50 text-yellow-700": progress === "On Hold",
                            "bg-blue-50 text-blue-700": progress === "Shortlisted",
                            "bg-gray-50 text-gray-700": progress === "Pending",
                            "bg-purple-50 text-purple-700": progress === "Offered",
                        }
                    )}>
                        {progress}
                    </span>
                )
            }
        },
        {
            accessorKey: "location",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Location
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => statusOptions.find(status => status.value === row.getValue("status"))?.label,
        },
        {
            accessorKey: "createdBy",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Created By
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Created At
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Updated At
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleDateString(),
        },
    ]

    const table = useReactTable({
        data: candidates,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center gap-4 py-4 flex-wrap">
                <Input
                    placeholder="Filter by name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Input
                    placeholder="Filter by location..."
                    value={(table.getColumn("location")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("location")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <select
                    value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("role")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm h-9 rounded-md border border-input px-3"
                >
                    <option value="">All Roles</option>
                    {roleOptions.map((role) => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
                <select
                    value={(table.getColumn("level")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("level")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm h-9 rounded-md border border-input px-3"
                >
                    <option value="">All Levels</option>
                    {levelOptions.map((level) => (
                        <option key={level.value} value={level.value}>
                            {level.label}
                        </option>
                    ))}
                </select>
                <select
                    value={(table.getColumn("progress")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("progress")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm h-9 rounded-md border border-input px-3"
                >
                    <option value="">All Progress</option>
                    {progressOptions.map((progress) => (
                        <option key={progress.value} value={progress.value}>
                            {progress.label}
                        </option>
                    ))}
                </select>
                <select
                    value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("status")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm h-9 rounded-md border border-input px-3"
                >
                    <option value="">All Status</option>
                    {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </div>
            <Table>
                <TableCaption>A list of candidates.</TableCaption>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
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
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}