"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";

type Props = {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor: string;
    endCursor: string;
};
const LoadMore = ({
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage,
}: Props) => {
    const router = useRouter();

    const handleNavigation = (direction: string) => {
        const currentParams = new URLSearchParams(window.location.pathname);

        if (direction === "next" && hasNextPage) {
            currentParams.delete("startcursor");
            currentParams.set("endcursor", endCursor);
        } else if (direction === "first" && hasPreviousPage) {
            currentParams.delete("endcursor");
            currentParams.set("startcursor", startCursor);
        }
        const newSearchParams = currentParams.toString();
        const newPathname = `${window.location.pathname}?${newSearchParams}`;
        router.push(newPathname);
    };
    return (
        <div className='w-full flexCenter gap-5 mt-10'>
            {hasPreviousPage && (
                <Button
                    title='First Page'
                    handleClick={() => handleNavigation("first")}
                />
            )}

            {hasNextPage && (
                <Button
                    title='Next Page'
                    handleClick={() => handleNavigation("next")}
                />
            )}
        </div>
    );
};

export default LoadMore;
