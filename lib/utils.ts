import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date): string => {
    const now = new Date();

    const diffInMillis: number = +now - +createdAt;

    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    const secondsAgo = Math.floor(diffInMillis / second);
    const minutesAgo = Math.floor(diffInMillis / minute);
    const hoursAgo = Math.floor(diffInMillis / hour);
    const daysAgo = Math.floor(diffInMillis / day);
    const weeksAgo = Math.floor(diffInMillis / week);
    const monthsAgo = Math.floor(diffInMillis / month);
    const yearsAgo = Math.floor(diffInMillis / year);

    if (secondsAgo < 60) {
        return `${secondsAgo} ${secondsAgo === 1 ? "second" : "seconds"} ago`;
    } else if (minutesAgo < 60) {
        return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
    } else if (hoursAgo < 24) {
        return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
    } else if (daysAgo < 7) {
        return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
    } else if (weeksAgo < 4) {
        return `${weeksAgo} ${weeksAgo === 1 ? "week" : "weeks"} ago`;
    } else if (monthsAgo < 12) {
        return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
    } else {
        return `${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago`;
    }
};

export const formatDivideNumber = (num: number): string => {
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1)}M`;
    } else if (num >= 1_000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return String(num);
};

export function getJoinedDate(date: Date): string {
    const month = date.toLocaleString("default", { month: "long" });

    const year = date.getFullYear();

    return `${month} ${year}`;
}

interface UrlQueryParams {
    params: string;
    key: string;
    value: string | null;
}

export const forUrlQuery = ({ params, key, value }: UrlQueryParams) => {
    const currentUrl = qs.parse(params);

    currentUrl[key] = value;

    return qs.stringifyUrl(
        {
            url: window.location.pathname,
            query: currentUrl,
        },
        {
            skipNull: true,
        },
    );
};

interface RemoveUrlQueryParams {
    params: string;
    keysToRemove: string[];
}

export const removeKeysFromQuery = ({
    params,
    keysToRemove,
}: RemoveUrlQueryParams) => {
    const currentUrl = qs.parse(params);

    keysToRemove.forEach((key) => delete currentUrl[key]);

    return qs.stringifyUrl(
        {
            url: window.location.pathname,
            query: currentUrl,
        },
        {
            skipNull: true,
        },
    );
};

interface BadgeParam {
    criteria: {
        type: keyof typeof BADGE_CRITERIA;
        count: number;
    }[];
}

export const assignBadge = (params: BadgeParam) => {
    const badgeCounts: BadgeCounts = {
        GOLD: 0,
        SILVER: 0,
        BRONZE: 0,
    };

    const { criteria } = params;

    criteria.forEach((item) => {
        const { type, count } = item;
        const badgeLevels: any = BADGE_CRITERIA[type];

        Object.keys(badgeLevels).forEach((level: any) => {
            if (count >= badgeLevels[level]) {
                badgeCounts[level as keyof BadgeCounts] += 1;
            }
        });
    });

    return badgeCounts;
};
