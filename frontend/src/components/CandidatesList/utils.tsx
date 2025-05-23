import { CandidateLevel, CandidateProgress, CandidateStatus } from "@shared/enums";
import { Column, Table } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface SortableColumnHeaderProps {
    column: Column<any>;
    children: React.ReactNode;
}

export function SortableColumnHeader({ column, children }: SortableColumnHeaderProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {children}
            {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
        </Button>
    );
}

export const roleOptions = [
    { value: "Frontend Developer", label: "Frontend Developer" },
    { value: "Backend Developer", label: "Backend Developer" },
    { value: "Full Stack Developer", label: "Full Stack Developer" },
    { value: "DevOps Engineer", label: "DevOps Engineer" },
    { value: "UI/UX Designer", label: "UI/UX Designer" },
    { value: "Product Manager", label: "Product Manager" },
];

interface FilterInputsProps {
    table: Table<any>;
}

export function FilterInputs({ table }: FilterInputsProps) {
    return (
        <div className="flex gap-4 py-4">
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
            <Select
                value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
                onValueChange={(value) =>
                    table.getColumn("role")?.setFilterValue(value)
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                            {role.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                value={(table.getColumn("level")?.getFilterValue() as string) ?? ""}
                onValueChange={(value) =>
                    table.getColumn("level")?.setFilterValue(value)
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {Object.keys(CandidateLevel).map((level) => (
                        <SelectItem key={level.valueOf()} value={level.valueOf()}>
                            {level.valueOf()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
                onValueChange={(value) =>
                    table.getColumn("status")?.setFilterValue(value)
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.keys(CandidateStatus).map((status) => (
                        <SelectItem key={status.valueOf()} value={status.valueOf()}>
                            {status.valueOf()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                value={(table.getColumn("progress")?.getFilterValue() as string) ?? ""}
                onValueChange={(value) =>
                    table.getColumn("progress")?.setFilterValue(value)
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by progress" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Progress</SelectItem>
                    {Object.keys(CandidateProgress).map((progress) => (
                        <SelectItem key={progress.valueOf()} value={progress.valueOf()}>
                            {progress.valueOf()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

interface PaginationControlsProps {
    table: Table<any>;
    totalItems: number;
    isLoading?: boolean;
}

export function PaginationControls({ table, totalItems, isLoading }: PaginationControlsProps) {
    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                {totalItems.toLocaleString()} candidates total.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage() || isLoading}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage() || isLoading}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage() || isLoading}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage() || isLoading}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ArrowUpDown className="h-4 w-4 rotate-90" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function getProgressStyle(progress: string) {
    switch (progress) {
        case "HIRED":
            return "bg-green-100 text-green-800 ring-green-600/20";
        case "REJECTED":
            return "bg-red-100 text-red-800 ring-red-600/20";
        case "ON_HOLD":
            return "bg-yellow-100 text-yellow-800 ring-yellow-600/20";
        case "SHORTLISTED":
            return "bg-blue-100 text-blue-800 ring-blue-600/20";
        case "PENDING":
            return "bg-gray-100 text-gray-800 ring-gray-600/20";
        case "OFFERED":
            return "bg-purple-100 text-purple-800 ring-purple-600/20";
        case "OFFER_ACCEPTED":
            return "bg-emerald-100 text-emerald-800 ring-emerald-600/20";
        case "OFFER_REJECTED":
            return "bg-rose-100 text-rose-800 ring-rose-600/20";
        default:
            return "bg-gray-100 text-gray-800 ring-gray-600/20";
    }
}