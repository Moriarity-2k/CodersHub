import { SidebarLink } from "@/types";

export const themes = [
    { value: "light", label: "Light", icon: "assets/icons/light.svg" },
    { value: "dark", label: "Dark", icon: "assets/icons/dark.svg" },
    { value: "system", label: "System", icon: "assets/icons/system.svg" },
];

export const sidebarLinks: SidebarLink[] = [
    {
        imgURL: "/assets/icons/home.svg",
        route: "/",
        label: "Home",
    },
    {
        imgURL: "/assets/icons/users.svg",
        route: "/community",
        label: "Community",
    },
    {
        imgURL: "/assets/icons/star.svg",
        route: "/collection",
        label: "Collections",
    },

    {
        imgURL: "/assets/icons/tag.svg",
        route: "/tags",
        label: "Tags",
    },
    {
        imgURL: "/assets/icons/user.svg",
        route: "/profile",
        label: "Profile",
    },
    {
        imgURL: "assets/icons/question.svg",
        route: "/ask-question",
        label: "Ask a question",
    },
    //   {
    //     imgURL: "assets/icons/phone.svg",
    //     route: "/contact",
    //     label: "Contact Me",
    //   },
];

export const BADGE_CRITERIA = {
    QUESTION_COUNT: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },

    ANSWER_COUNT: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },

    QUESTION_UPVOTES: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },

    ANSWER_UPVOTES: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },

    TOTAL_VIEWS: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
};
