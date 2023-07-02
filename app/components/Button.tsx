import { AnyTxtRecord } from "dns";
import Image from "next/image";
import { MouseEventHandler } from "react";

type Props = {
    title: string;
    LeftIcon?: any;
    RightIcon?: any;
    handleClick?: MouseEventHandler;
    isSubmitting?: boolean;
    type?: "button" | "submit";
    bgColor?: string;
    textColor?: string;
};
const Button = ({
    title,
    LeftIcon,
    RightIcon,
    handleClick,
    isSubmitting,
    type,
    bgColor,
    textColor,
}: Props) => {
    return (
        <button
            type={type}
            disabled={isSubmitting}
            className={`flexCenter gap-3 px-4 py-3 rounded-xl text-sm font-medium max-md:w-full
            ${isSubmitting ? "bg-black/50" : bgColor || "bg-primary-purple"}
            ${textColor || "text-white"}
            `}
            onClick={handleClick}
        >
            {LeftIcon && (
                <Image src={LeftIcon} width={14} height={14} alt='Left' />
            )}
            {title}
            {RightIcon && (
                <Image src={RightIcon} width={14} height={14} alt='Right' />
            )}
        </button>
    );
};

export default Button;
