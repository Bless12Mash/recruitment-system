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

export const levelOptions = [
    { value: "Junior", label: "Junior" },
    { value: "Mid", label: "Mid" },
    { value: "Senior", label: "Senior" },
    { value: "Lead", label: "Lead" },
];

export const progressOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Shortlisted", label: "Shortlisted" },
    { value: "On Hold", label: "On Hold" },
    { value: "Offered", label: "Offered" },
    { value: "Offer Accepted", label: "Offer Accepted" },
    { value: "Offer Rejected", label: "Offer Rejected" },
    { value: "Hired", label: "Hired" },
    { value: "Rejected", label: "Rejected" },
];

export const statusOptions = [
    { value: "Open", label: "Open" },
    { value: "Closed", label: "Closed" },
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
                    {levelOptions.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                            {level.label}
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
                    {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                            {status.label}
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
                    {progressOptions.map((progress) => (
                        <SelectItem key={progress.value} value={progress.value}>
                            {progress.label}
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
        case "Hired":
            return "bg-green-100 text-green-800 ring-green-600/20";
        case "Rejected":
            return "bg-red-100 text-red-800 ring-red-600/20";
        case "On Hold":
            return "bg-yellow-100 text-yellow-800 ring-yellow-600/20";
        case "Shortlisted":
            return "bg-blue-100 text-blue-800 ring-blue-600/20";
        case "Pending":
            return "bg-gray-100 text-gray-800 ring-gray-600/20";
        case "Offered":
            return "bg-purple-100 text-purple-800 ring-purple-600/20";
        case "Offer Accepted":
            return "bg-emerald-100 text-emerald-800 ring-emerald-600/20";
        case "Offer Rejected":
            return "bg-rose-100 text-rose-800 ring-rose-600/20";
        default:
            return "bg-gray-100 text-gray-800 ring-gray-600/20";
    }
}