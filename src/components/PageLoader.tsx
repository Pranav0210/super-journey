import Loader from "@/assets/icons/loading.svg?react";
import cn from "classnames";

const PageLoader = ({ classNames }: {
    classNames?: string
}) => {
    return (
        <div className="inset-0 flex absolute z-50 bg-pantoneGreen/40 justify-center items-center">
            <Loader className={cn(classNames, "top-[50%] left-[50%] h-24 w-24 text-terraCotta")} />
        </div>
    )
}

export default PageLoader