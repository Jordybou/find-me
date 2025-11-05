import { useNavigate } from "react-router-dom"

type ReturnMenuProps = {
    to?: string; //target route (Default = Menu)
    label?: string; //text button
    className?: string; //optionnal additional class
}

export default function ReturnMenu({ to = "/", label = "Menu", className = "" }: ReturnMenuProps) {
    const navigate = useNavigate();

    const handleClick = () => navigate(to);

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={label}
            className={[
                "inline-flex items-center gap-1",
                "rounded-lg border border-sky-300",
                "bg-sky-100 text-sky-800",
                "px-3 py-1 text-sm font-medium",
                "hover:bg-sky-200 active:bg-sky-300",
                "transition",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
                "[color:#1E40AF]",
                className,
            ].join(" ")} //use '.join' for create a className
        >
            {/* left arrow icon */}
            <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Icon: Arrow Left */}
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
            </svg>
            <span>{label}</span>
        </button>
    );
}