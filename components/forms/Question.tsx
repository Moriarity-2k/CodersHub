"use client";

import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { QuestionsSchema } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";

interface Props {
    mongoUserId: string;
    type?: string;
    questionDetails?: string;
}

const Question = ({ mongoUserId, type, questionDetails }: Props) => {
    const { mode } = useTheme();

    const editorRef = useRef(null);

    const router = useRouter();
    const pathname = usePathname();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const parsedQuestionDetails =
        questionDetails && JSON.parse(questionDetails || "");
    const groupedTags = parsedQuestionDetails?.tags.map((tag: any) => tag.name);
    // 1. Define your form.
    const form = useForm<z.infer<typeof QuestionsSchema>>({
        resolver: zodResolver(QuestionsSchema),
        defaultValues: {
            title: parsedQuestionDetails?.title || "",
            explanation: parsedQuestionDetails?.content || "",
            tags: groupedTags || [],
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
        setIsSubmitting(true);
        try {
            if (type === "Edit") {
                await editQuestion({
                    questionId: parsedQuestionDetails._id,
                    title: values.title,
                    content: values.explanation,
                    path: pathname,
                });

                router.push(`/question/${parsedQuestionDetails._id}`);
            } else {
                await createQuestion({
                    title: values.title,
                    content: values.explanation,
                    tags: values.tags,
                    author: JSON.parse(mongoUserId),
                    path: pathname,
                });
                router.push("/");
            }
        } catch (err) {
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleKeyDown(
        e: React.KeyboardEvent<HTMLInputElement>,
        field: any,
    ) {
        if (e.key === "Enter" && field.name === "tags") {
            e.preventDefault();

            //   console.log("Field is : ", field, e.target.value);
            // note: Here the field is the object given by shadcn , it contains fields like onBlur , onChange , ref , value (of whatever type you have given in formValidation)

            const tagInput = e.target as HTMLInputElement;
            const tagValue = tagInput.value.trim();

            if (tagValue !== "") {
                if (tagValue.length > 15) {
                    return form.setError("tags", {
                        type: "required",
                        message: "Must be less than 15 charecters",
                    });
                }

                if (!field.value.includes(tagValue as never)) {
                    form.setValue("tags", [...field.value, tagValue]);
                    //   e.target.value = "";
                    tagInput.value = "";
                    form.clearErrors("tags");
                }
            } else {
                form.trigger();
            }
        }
    }

    function handleTagRemove(tag: string, field: any) {
        const newTags = field.value.filter((x: string) => x !== tag);
        form.setValue("tags", newTags);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-10"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col ">
                            <FormLabel className=" paragraph-semibold text-dark400_light800 ">
                                Question Title{" "}
                                <span className="text-primary-500">*</span>{" "}
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <Input
                                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Be as descriptive as possible for the other devs
                                to understand
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="explanation"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className=" paragraph-semibold text-dark400_light800 ">
                                Detailed Explanation of the Question{" "}
                                <span className="text-primary-500">*</span>{" "}
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                {/* Editor */}
                                <Editor
                                    apiKey={
                                        process.env
                                            .NEXT_PUBLIC_TINY_EDITOR_APIKEY
                                    }
                                    onInit={(evt, editor) => {
                                        // @ts-ignore
                                        return (editorRef.current = editor);
                                    }}
                                    initialValue={
                                        parsedQuestionDetails?.content || ""
                                    }
                                    onBlur={field.onBlur}
                                    onEditorChange={(content) =>
                                        field.onChange(content)
                                    }
                                    init={{
                                        height: 350,
                                        menubar: false,
                                        plugins: [
                                            "advlist",
                                            "autolink",
                                            "lists",
                                            "link",
                                            "image",
                                            "charmap",
                                            "preview",
                                            "anchor",
                                            "searchreplace",
                                            "visualblocks",
                                            "codesample",
                                            "fullscreen",
                                            "insertdatetime",
                                            "media",
                                            "table",
                                        ],

                                        toolbar:
                                            "undo redo | blocks | " +
                                            "codesample | bold italic forecolor | alignleft aligncenter " +
                                            "alignright alignjustify | bullist numlist",
                                        content_style:
                                            "body { font-family:Inter; font-size:16px }",

                                        skin:
                                            mode === "dark"
                                                ? "oxide-dark"
                                                : "oxide",
                                        content_css:
                                            mode === "dark" ? "dark" : "light",
                                    }}
                                />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Write about the answer you are expecting , the
                                methods that you have tried with a breif
                                explanation
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col ">
                            <FormLabel className=" paragraph-semibold text-dark400_light800 ">
                                Tags <span className="text-primary-500">*</span>{" "}
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <>
                                    <Input
                                        disabled={type === "Edit"}
                                        className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                                        // {...field}
                                        onKeyDown={(e) =>
                                            handleKeyDown(e, field)
                                        }
                                        placeholder="Add Tags ..."
                                    />
                                    {field.value.length > 0 && (
                                        <div className="flex-start mt-2.5 gap-2.5">
                                            {field.value.map(
                                                (tag: any): any => {
                                                    return (
                                                        <Badge
                                                            key={tag}
                                                            className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                                                            onClick={() => {
                                                                if (
                                                                    type !==
                                                                    "Edit"
                                                                )
                                                                    return handleTagRemove(
                                                                        tag,
                                                                        field,
                                                                    );
                                                            }}
                                                        >
                                                            {tag}
                                                            {type !==
                                                                "Edit" && (
                                                                <Image
                                                                    src="/assets/icons/close.svg"
                                                                    alt="Close icon"
                                                                    width={12}
                                                                    height={12}
                                                                    className=" cursor-pointer object-contain invert-0 dark:invert"
                                                                />
                                                            )}
                                                        </Badge>
                                                    );
                                                },
                                            )}
                                        </div>
                                    )}
                                </>
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Tags help us to categorize the problem , for
                                better reach and faster results
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <Button
                    className="primary-gradient w-fit !text-light-900"
                    disabled={isSubmitting}
                    type="submit"
                >
                    {isSubmitting ? (
                        <>{type === "Edit" ? "Editing ..." : "Posting ..."}</>
                    ) : (
                        <>
                            {type === "Edit"
                                ? "Edit Question"
                                : "Ask a Question"}
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default Question;
