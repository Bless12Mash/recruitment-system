import { ColumnDef } from "@tanstack/react-table"
import { Candidate } from "../types/interview"
import { DataTable } from "./ui/data-table"
import { Button } from "./ui/button"
import { ArrowUpDown } from "lucide-react"
import { formatDate } from "../lib/utils"

interface CandidatesListProps {
    candidates: Candidate[]
    onCandidateClick: (candidate: Candidate) => void
}

export function CandidatesList({ candidates, onCandidateClick }: CandidatesListProps) {
    const columns: ColumnDef<Candidate>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "role",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            filterFn: (row, id, value) => {
                return value === "" || row.getValue(id) === value
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            filterFn: (row, id, value) => {
                return value === "" || row.getValue(id) === value
            },
        },
        {
            accessorKey: "level",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Level
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            filterFn: (row, id, value) => {
                return value === "" || row.getValue(id) === value
            },
        },
        {
            accessorKey: "createdBy",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created By
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => formatDate(row.getValue("createdAt")),
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Updated
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => formatDate(row.getValue("updatedAt")),
        },
    ]

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

    return (
        <div className="container mx-auto py-10">
            <DataTable
                columns={columns}
                data={candidates}
                filterColumn={["status", "level", "role"]}
                filterOptions={{
                    status: statusOptions,
                    level: levelOptions,
                    role: roleOptions,
                }}
                onRowClick={(row) => onCandidateClick(row.original)}
            />
        </div>
    )
}