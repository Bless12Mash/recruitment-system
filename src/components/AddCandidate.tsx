import { showToast } from "@/App";
import { candidateApi } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

enum ROLES {
    "Frontend Developer" = "Frontend Developer",
    "Backend Developer" = "Backend Developer",
    "Full Stack Developer" = "Full Stack Developer",
    "DevOps Engineer" = "DevOps Engineer",
    "UI/UX Designer" = "UI/UX Designer",
    "Product Manager" = "Product Manager"
}

enum LEVELS { "Junior" = "Junior", "Mid" = "Mid", "Senior" = "Senior", "Lead" = "Lead" }


export function AddCandidate() {
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        name: z.string().min(2, {
            message: "Please enter a valid name.",
        }),
        email: z.string()
            .nonempty("Please enter a valid email.")
            .email("Please enter a valid email.")
            .transform((value) => value.toLowerCase()),
        role: z.nativeEnum(ROLES, { message: 'Please select the candidate\'s role.' }),
        level: z.nativeEnum(LEVELS, { message: 'Please select the candidate\'s level.' }),
        location: z.string().min(2, {
            message: "Please enter a valid location.",
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            role: undefined,
            level: undefined,
            location: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const candidate = {
                name: values.name,
                email: values.email,
                role: values.role,
                level: values.level,
                location: values.location,
            };
            await candidateApi.saveCandidate(candidate)
            showToast(`Successfully saved candidate ${values.name}`, 'success')
            form.reset();
        } catch (error) {
            console.log(error)
            showToast('Error saving candidate.', 'error')
        }
        finally { setIsLoading(false) }

    }

    return (
        <div className="flex justify-center mt-4">
            {isLoading && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
                </div>
            )}
            {!isLoading && < Card className="w-5/6 ">
                <CardHeader>
                    <CardTitle>New candidate</CardTitle>
                    <CardDescription>Add a new candidate.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <FormControl>
                                                <Select {...field} onValueChange={(value) => form.setValue("role", ROLES[value as keyof typeof ROLES])}>
                                                    <SelectTrigger className="w-xl">
                                                        <SelectValue placeholder="role">{ }</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(ROLES).map(role => <SelectItem value={role}>{role}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Level</FormLabel>
                                            <FormControl>
                                                <Select {...field} onValueChange={(value) => form.setValue("level", LEVELS[value as keyof typeof LEVELS])}>
                                                    <SelectTrigger className="w-xl">
                                                        <SelectValue placeholder="level">{ }</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(LEVELS).map(level => <SelectItem value={level}>{level}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="location" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>}
        </div >
    );
}
