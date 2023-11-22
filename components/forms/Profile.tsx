"use client";

import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProfileSchema } from "@/lib/validations";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";

interface Props {
    clerkId: string;
    user: string;
}

const Profile = ({ clerkId, user }: Props) => {
    const parsedUser = JSON.parse(user);
    const router = useRouter();
    const pathname = usePathname();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            name: parsedUser.name || "",
            username: parsedUser.username || "",
            portfolioWebsite: parsedUser.portfolioWebsite || "",
            location: parsedUser.location || "",
            bio: parsedUser.bio || "",
        },
    });

    async function onSubmit(values: z.infer<typeof ProfileSchema>) {
        setIsSubmitting(true);

        try {
            // update User

            await updateUser({
                clerkId,
                updateData: {
                    name: values.name,
                    username: values.username,
                    portfolioWebsite: values.portfolioWebsite,
                    location: values.location,
                    bio: values.bio,
                },
                path: pathname,
            });

            router.back();
        } catch (err) {
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-9 flex w-full gap-9 flex-col"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Name <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min--[56px] border"
                                    placeholder="your name"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Username{" "}
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min--[56px] border"
                                    placeholder="your username"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="portfolioWebsite"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Portfolio Link
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min--[56px] border"
                                    placeholder="portfoli"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Location
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min--[56px] border"
                                    placeholder="where are you from"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                BIO
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min--[56px] border"
                                    placeholder="Tell the community about yourself ..."
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="mt-7 flex justify-end">
                    <Button
                        disabled={isSubmitting}
                        type="submit"
                        className="primary-gradient w-fit"
                    >
                        {isSubmitting ? "saving ..." : "save"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default Profile;
