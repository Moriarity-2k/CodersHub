"use client";

import React from "react";
import { Button } from "../ui/button";
import { forUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    pageNumber: number;
    isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
    const router = useRouter();
    const searchparams = useSearchParams();

    const handleNavigation = (direction: string) => {
        const nextPageNumber =
            direction === "prev" ? pageNumber - 1 : pageNumber + 1;

        const newUrl = forUrlQuery({
            params: searchparams.toString(),
            key: "page",
            value: nextPageNumber.toString(),
        });

        router.push(newUrl);
    };

    if (!isNext && pageNumber === 1) return null;

    return (
        <div className="flex w-full items-center justify-center gap-2">
            <Button
                disabled={pageNumber === 1}
                onClick={() => handleNavigation("prev")}
                className="light-border-2 border btn flex min-h-[36px] items-center justify-center gap-2"
            >
                <p className="body-medium text-dark200_light800">Prev</p>
            </Button>

            <div className="bg-primary-500 flex justify-center items-center rounded-md px-3.5 py-2">
                <p className="body-semibold text-light-900">{pageNumber}</p>
            </div>

            <Button
                disabled={!isNext}
                onClick={() => handleNavigation("next")}
                className="light-border-2"
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
