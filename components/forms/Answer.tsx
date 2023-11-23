"use client";

import { AnswerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

interface Props {
    question: string;
    questionId: string;
    authorId: string;
}

const Answer = ({ question, questionId, authorId }: Props) => {
    const pathname = usePathname();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittingAi, setIsSubmittingAi] = useState(false);

    const { mode } = useTheme();
    const editorRef = useRef(null);

    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: {
            answer: "",
        },
    });

    const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
        setIsSubmitting(true);

        try {
            await createAnswer({
                content: values.answer,
                author: JSON.parse(authorId),
                path: pathname,
                question: JSON.parse(questionId),
            });

            form.reset();
            if (editorRef.current) {
                const editor = editorRef.current as any;

                editor.setContent("");
            }
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <h4 className="paragraph-semibold text-dark400_light800">
                    Write You Answer Here
                </h4>
            </div>
            <Form {...form}>
                <form
                    className="mt-6 flex w-full flex-col gap-10"
                    onSubmit={form.handleSubmit(handleCreateAnswer)}
                >
                    <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-3">
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
                                                mode === "dark"
                                                    ? "dark"
                                                    : "light",
                                        }}
                                    />
                                </FormControl>

                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="primary-gradient w-fit text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "SUbmitting ..." : "SUbmit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Answer;
