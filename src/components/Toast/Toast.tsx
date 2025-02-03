import cn from "classnames";

const Toast = ({
  message,
  type,
  classNames,
}: {
  message: string;
  type: string;
  classNames?: string;
}) => {
  return (
    <div
      className={cn(
        classNames,
        `absolute top-5 left-1/2 -translate-x-1/2 justify-center px-8 py-2 rounded-full text-white z-[1000] ${
          type === "success"
            ? "bg-green-600"
            : type === "error"
              ? "bg-red-700"
              : "bg-navyLight"
        } hover:opacity-100`,
      )}
    >
      <span>{message}</span>
    </div>
  );
};

export default Toast;
