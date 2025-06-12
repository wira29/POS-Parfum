import React, { ReactNode } from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  noHover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  noHover = false,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={clsx(
        "w-full rounded-xl bg-white p-4 transition duration-200 ease-in-out",
        noHover && "hover:scale-125",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
