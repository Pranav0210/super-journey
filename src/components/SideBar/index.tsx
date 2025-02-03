import packagejson from "../../../package.json";
import LetsTransportLogo from "../../assets/icons/logo.svg?react";
import SignoutIcon from "../../assets/icons/signout.svg?react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import cn from "classnames";
import { useMutation } from "@tanstack/react-query";
import { logout } from "./api";
import { ConfirmModal } from "../ConfirmModal";
import { useState } from "react";
import { SidebarProps } from "@/types";
 
const SideBar = ({
  menu,
  footer,
  containerClassNames,
  variant
}: SidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { mutate: mutateLogout } = useMutation({
    mutationFn: logout,
    mutationKey: ["logout"],
    onSuccess: () => {
      navigate("/login");
    },
  });
  return (
    <div className="h-full w-full flex">
      <div className={cn(containerClassNames, {
        "bg-pantoneGreen": variant == 'supply',
        "bg-primaryIndigo": variant == 'demand'
      },
        "flex grow flex-col shadow-[4px_0px_8px_0px_rgba(0,0,0,0.12)] text-white px-4 font-poppins h-full w-[15%] overflow-x-hidden")}>
        <nav className="flex flex-1 flex-col pb-4 text-left w-full mx-auto max-w-md rounded-2xl overflow-y-auto">
          <Link to="/my-loads" className="text-white hover:text-white">
            <div className="px-2 py-3 flex justify-center border-b-[1px] border-borderGray">
              <LetsTransportLogo className="w-[10rem]" />
            </div>
          </Link>
          {menu.map((section) => {
            return (
              <div
                className={cn(
                  "py-4 flex flex-col gap-2 border-b-[1px] border-borderGray",
                )}
              >
                {section.map((item) => {
                  return (
                    <Link
                      to={item.path}
                      className="text-white hover:text-white"
                    >
                      <div
                        className={cn(
                          {
                            "bg-navyLight":
                              item.path == location.pathname.split("/")[1] && variant == 'demand',
                            "bg-cedarChest":
                              item.path == location.pathname.split("/")[1] && variant == 'supply',
                          },
                          {
                            "hover:bg-cedarChest": variant == 'supply',
                            "hover:bg-navyLight": variant == 'demand'
                          },
                          "hover:cursor-pointer px-4 py-2 rounded-lg font-normal text-xs flex gap-2 items-center",
                        )}
                      >
                        {item.icon}
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
        <div className="">
          <div
            onClick={() => setIsModalOpen(true)}
            className={cn({
              "hover:bg-cedarChest": variant == 'supply',
              "hover:bg-navyLight": variant == 'demand'
            },"hover:cursor-pointer px-4 py-2 my-4 rounded-lg font-normal text-xs flex gap-2 items-center")}
          >
            <SignoutIcon className="w-5 h-5" />
            Sign Out
          </div>
          <div className="border-t-[1px] border-borderGray py-2 text-gray text-xs leading-5 text-center">
            {footer} {packagejson.version}
          </div>
        </div>
      </div>
      <div className="w-[85%]">
        <Outlet />
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onConfirm={() => {
          mutateLogout();
          navigate("/login");
        }}
        title="Confirm Action"
        description="Are you sure you want to logout?"
        leftButtonClassName={variant == 'supply' && "hover:border-cedarChest"}
        rightButtonClassName={variant == 'supply' && "bg-cedarChest hover:bg-terraCotta hover:border-terraCotta"}
      />
    </div>
  );
};

export default SideBar;
