import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Table as TableInstance } from "@tanstack/react-table";
import { Candidate } from "../../types/interview";

export const statusOptions = [
    { label: "Open", value: "Open" },
    { label: "Closed", value: "Closed" },
];

export const levelOptions = [
    { label: "Junior", value: "Junior" },
    { label: "Mid", value: "Mid" },
    { label: "Senior", value: "Senior" },
    { label: "Lead", value: "Lead" },
];

export const roleOptions = [
    { label: "Frontend Developer", value: "Frontend Developer" },
    { label: "Backend Developer", value: "Backend Developer" },
    { label: "Full Stack Developer", value: "Full Stack Developer" },
    { label: "DevOps Engineer", value: "DevOps Engineer" },
    { label: "UI/UX Designer", value: "UI/UX Designer" },
    { label: "Product Manager", value: "Product Manager" },
];

export const progressOptions = [
    { label: "Hired", value: "Hired" },
    { label: "Rejected", value: "Rejected" },
    { label: "On Hold", value: "On Hold" },
    { label: "Shortlisted", value: "Shortlisted" },
    { label: "Pending", value: "Pending" },
    { label: "Offered", value: "Offered" },
    { label: "Offer Accepted", value: "Offer Accepted" },
    { label: "Offer Rejected", value: "Offer Rejected" },
];

export const getProgressStyle = (progress: string) => {
    switch (progress) {
        case "Hired":
        case "Offer Accepted":
            return "bg-green-100 text-green-800 ring-green-600/20";
        case "Rejected":
        case "Offer Rejected":
            return "bg-red-100 text-red-800 ring-red-600/20";
        case "On Hold":
            return "bg-yellow-100 text-yellow-800 ring-yellow-600/20";
        case "Shortlisted":
            return "bg-blue-100 text-blue-800 ring-blue-600/20";
        case "Pending":
            return "bg-gray-100 text-gray-800 ring-gray-600/20";
        case "Offered":
            return "bg-purple-100 text-purple-800 ring-purple-600/20";
        default:
            return "bg-gray-100 text-gray-800 ring-gray-600/20";
    }
};

export const SortableColumnHeader = ({ column, children }: { column: any, children: React.ReactNode }) => {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {children}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
};

interface FilterInputsProps {
    table: TableInstance<Candidate>
}

export const FilterInputs = ({ table }: FilterInputsProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
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
            </div>
            <FilterDropdowns table={table} />
        </div>
    );
};

const FilterDropdowns = ({ table }: FilterInputsProps) => {
    return (
        <div className="flex items-center gap-4">
            <FilterSelect
                value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
                onChange={(value) => table.getColumn("role")?.setFilterValue(value)}
                options={roleOptions}
                placeholder="All Roles"
            />
            <FilterSelect
                value={(table.getColumn("level")?.getFilterValue() as string) ?? ""}
                onChange={(value) => table.getColumn("level")?.setFilterValue(value)}
                options={levelOptions}
                placeholder="All Levels"
            />
            <FilterSelect
                value={(table.getColumn("progress")?.getFilterValue() as string) ?? ""}
                onChange={(value) => table.getColumn("progress")?.setFilterValue(value)}
                options={progressOptions}
                placeholder="All Progress"
            />
            <FilterSelect
                value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
                onChange={(value) => table.getColumn("status")?.setFilterValue(value)}
                options={statusOptions}
                placeholder="All Status"
            />
        </div>
    );
};

interface FilterSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string; }[];
    placeholder: string;
}

const FilterSelect = ({ value, onChange, options, placeholder }: FilterSelectProps) => {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-9 rounded-md border border-input px-3"
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export const PaginationControls = ({ table }: FilterInputsProps) => {
    return (
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
    );
};