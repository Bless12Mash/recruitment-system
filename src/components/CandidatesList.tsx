import { Candidate } from "../types/interview";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "./ui/table";

interface CandidatesListProps {
    candidates: Candidate[]
    onCandidateClick: (candidate: Candidate) => void
}

export function CandidatesList({ candidates, onCandidateClick }: CandidatesListProps) {
    const columns = ["name", "role", "level", "status", "createdBy", "createdAt", "updatedAt"];

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
            <Table>
                <TableCaption>A list of candidates.</TableCaption>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column} className="text-left">
                                {column.charAt(0).toUpperCase() + column.slice(1)}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {candidates.map((candidate) => (
                        <TableRow
                            key={candidate.id}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => onCandidateClick(candidate)}
                        >
                            <td>{candidate.name}</td>
                            <td>{roleOptions.find(role => role.value === candidate.role)?.label}</td>
                            <td>{levelOptions.find(level => level.value === candidate.level)?.label}</td>
                            <td>{statusOptions.find(status => status.value === candidate.status)?.label}</td>
                            <td>{candidate.createdBy}</td>
                            <td>{new Date(candidate.createdAt).toLocaleDateString()}</td>
                            <td>{new Date(candidate.updatedAt).toLocaleDateString()}</td>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}