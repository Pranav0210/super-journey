import React, { FC, ReactNode } from "react";
import HomeIcon from "../assets/icons/home.svg?react";
import ArrowLeft from "../assets/icons/arrow_left.svg?react";
import ArrowRight from "../assets/icons/chevron-right.svg?react";
import { Link } from "react-router-dom";
import classNames from "classnames";

export type PageLayoutProps = {
  name?: ReactNode;
  crumbs: { name: ReactNode; path?: string }[];
  children: ReactNode;
  showLeftArrow?: boolean;
  showCrumbs?: boolean;
  rightIcon?: ReactNode;
};

const PageLayout: FC<PageLayoutProps> = ({
  name,
  crumbs,
  children,
  showLeftArrow = true,
  showCrumbs = true,
  rightIcon,
}) => {
  return (
    <>
      <div
        className="hidden sm:flex justify-between items-center"
        id="breadcrumb"
      >
        <div className="card transition duration-600 ease-in-out flex flex-col rounded">
          <div className="flex items-center">
            {showLeftArrow && crumbs.length > 1 && (
              <Link to={crumbs[crumbs.length - 2].path || ""}>
                <ArrowLeft className="mr-6" />
              </Link>
            )}
            <h1 className="text-2xl font-semibold text-mine-shaft-black dark:text-bodyBg px-4">
              {name || crumbs[crumbs.length - 1].name}
            </h1>
            {rightIcon}
          </div>
        </div>
        <div className="card transition duration-300 ease-in-out flex flex-col rounded">
          <div className="card-body p-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <Link
                    to="/"
                    className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    {showCrumbs && <HomeIcon className="h-5 w-5" />}
                  </Link>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    {showCrumbs &&
                      crumbs?.map((item, index) => (
                        <React.Fragment key={index}>
                          <ArrowRight className="w-5 h-5" />
                          <div
                            className={classNames(
                              "ms-1 text-xs font-normal md:ms",
                              {
                                "text-emperor dark:text-wild-sand ":
                                  crumbs.length - 1 > index,
                                "text-primary": crumbs.length - 1 === index,
                              },
                            )}
                          >
                            {item.path ? (
                              <Link to={item.path}>{item.name}</Link>
                            ) : (
                              item.name
                            )}
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default PageLayout;
