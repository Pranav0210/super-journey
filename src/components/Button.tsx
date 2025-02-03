import { ButtonProps } from "../types";
import cn from "classnames";

const Button = ({
  title,
  onClick,
  Icon,
  className,
  iconClassName = "",
  disabled,
  tooltip = "",
  isIconRight = false,
  titleClassName = "",
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={cn(
        `text-textcolor-dark py-2 px-4 fill fill-current active:bg-silver-tree rounded-md disabled:bg-chineseWhite disabled:text-white ${className}`,
        {
          "opacity-50": disabled,
        },
      )}
    >
      <div className="flex items-center justify-center">
        {!isIconRight && (
          <div className="relative  ">
            {/* {icon} */}
            {Icon && (
              <Icon
                className={cn(`w-5 h-5 text-white fill-white ${iconClassName}`)}
              />
            )}
          </div>
        )}
        <span className={titleClassName}>{title}</span>
        {isIconRight && (
          <div className="relative capitalize ">
            {/* {icon} */}
            {Icon && (
              <Icon className={cn("w-5 h-5 text-white", iconClassName)} />
            )}
          </div>
        )}
      </div>
    </button>
  );
};

export default Button;
