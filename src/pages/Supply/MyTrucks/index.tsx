import { Link, useNavigate } from "react-router-dom";
import NoLoadsImage from "@/assets/icons/no_loads_illustration.svg?react";
import Loader from "@/assets/icons/loading.svg?react";
import PinDrop from "@/assets/icons/pin_drop.svg?react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronsUp, ClockIcon, PenIcon, Trash2, TruckIcon } from "lucide-react";
import dayjs from "dayjs";
import cn from "classnames";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTruck, getMyTrucks } from "./api";
import Button from "@/components/Button";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/Toast/toastProvider";
import { ConfirmModal } from "@/components/ConfirmModal";

const MyTrucks = () => {
  const navigate = useNavigate();
  const [cacheTrucksData, setCacheTrucksData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [deletingTruckId, setDeletingTruckId] = useState("");
  const [skeletons, setSkeletons] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [showToast, setShowToast] = useState(false);
  // const [toastMsg, setToastMsg] = useState("");
  // const [toastClassNames, setToastClassNames] = useState("");

  // const triggerToast = () => {
  //   setShowToast(true);
  //   setTimeout(() => setShowToast(false), 3000);
  // };

  const queryClient = useQueryClient();

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: trucksData,
    isLoading,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ["getMyTrucks"],
    queryFn: () => getMyTrucks(pageNo),
  });

  const { mutate: mutateDelete, isPending: isDeletingTruck } = useMutation({
    mutationFn: (itemId: string) => deleteTruck(itemId),
    onSuccess(data) {
      queryClient.invalidateQueries(["getMyTrucks"]);
      setCacheTrucksData(cacheTrucksData.filter((item) => item.id !== data.id));
      setDeletingTruckId("");
      showToast({ message: "Deleted truck successfully!", type: "success" });
      // setToastMsg("Deleted truck successfully");
      // setToastClassNames("bg-verifiedGreen justify-center left-[50%]");
      // triggerToast();
    },
    onError(error) {
      // console.log(error)
      // showToast({ message: error.response.data.message, type: "error" });
    },
  });

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10;

    if (isAtBottom && trucksData?.meta.totalPages >= pageNo && !isFetching) {
      setSkeletons(6 - (cacheTrucksData.length % 6));
      setPageNo((prev) => prev + 1);
      console.log(isAtBottom, isFetching, pageNo);
      queryClient.invalidateQueries(["getMyTrucks"]);
    }
  };

  const { showToast } = useToast();

  // useEffect(() => console.log('skeletons', skeletons), [skeletons])

  useEffect(() => {
    if (trucksData) {
      if (pageNo !== 1)
        setCacheTrucksData([...cacheTrucksData, ...trucksData?.data]);
      else setCacheTrucksData(trucksData?.data);
    }
    setSkeletons(0);
  }, [trucksData]);

  return (
    <div
      className="relative h-full overflow-y-scroll overflow-x-hidden font-poppins"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {/* {showToast && <Toast message={toastMsg} classNames={toastClassNames} />} */}
      <div className="border-b-[1px] border-borderGray p-4 flex flex-grow items-center sticky top-0 z-10 bg-white">
        <span className="text-xl font-semibold flex gap-4 items-center"> <TruckIcon className="stroke-[1.5px] h-8 w-8" />My Trucks</span>
        <Link to="/add-truck" className="ml-auto">
          <div className="bg-cedarChest hover:bg-terraCotta hover:cursor-pointer text-white items-center flex rounded-md text-xs px-2 py-2">
            + Post New Truck
          </div>
        </Link>
      </div>
      {isLoading ? (
        <div className="p-6 grid grid-cols-3 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="border shadow rounded-md p-4 max-w-sm w-full mx-auto"
            >
              <div className="animate-pulse justify-center flex flex-col space-x-4">
                <div className="rounded-lg self-center mb-4 bg-pantoneGreen h-10 w-40"></div>
                <div className="rounded-lg bg-pantoneGreen h-10 mx-auto"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-4 bg-pantoneGreen rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-4 bg-pantoneGreen rounded"></div>
                      <div className="h-4 bg-pantoneGreen rounded"></div>
                    </div>
                    <div className="h-4 bg-pantoneGreen rounded"></div>
                    <div className="h-4 bg-pantoneGreen rounded"></div>
                  </div>
                </div>
                <div className="h-6 mt-10 bg-pantoneGreen rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : cacheTrucksData.length > 0 || isFetching ? (
        <div className="p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cacheTrucksData.map((truckItem) => {
            return (
              <Card className={cn("w-[380px]")}>
                <CardHeader>
                  <CardTitle>{truckItem.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2">
                    <ClockIcon />
                    {"Expires: " +
                      dayjs(truckItem.expirationTime).format(
                        "DD-MM-YYYY,  hh:mm A",
                      )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none mb-2">
                        Trip Start & End Location
                      </p>
                      <p className="text-sm text-muted-foreground flex gap-2 items-center">
                        <PinDrop className="w-4 h-4 text-terraCotta" />
                        {truckItem.pickupPoint}
                      </p>
                      <p className="text-sm text-muted-foreground flex gap-2 items-center">
                        <PinDrop className="w-4 h-4 text-verifiedGreen" />
                        {truckItem.dropPoint}
                      </p>
                    </div>
                  </div>
                  {/**
                   * This block below is not functional right now because of object format. However we must achieve this.
                   */}
                  <div>
                    {truckItem.truck_spec?.map((item, index) => (
                      <div
                        key={index}
                        className="mb-4 grid grid-cols-[25px_1fr] items-start text-left last:mb-0 last:pb-0"
                      >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-pantoneGreen" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {item}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* <div className="grid grid-cols-[25px_1fr] items-start text-left">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-pantoneGreen" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {truckItem.bodyType + " - " + (truckItem.tonnage ?? 15) + " Tn"}
                      </p>
                    </div>
                  </div> */}
                  <div className="grid grid-cols-[25px_1fr] items-start text-left">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-pantoneGreen" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {truckItem.regnNo}
                      </p>
                    </div>
                  </div>
                  {/* <div className=" grid grid-cols-[25px_1fr] items-start text-left">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-pantoneGreen" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {truckItem.tires + " Tires" + " - " + (truckItem.length ?? 22) + " ft"}
                      </p>
                    </div>
                  </div> */}
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-start text-left">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-pantoneGreen" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {"Min Price ₹" + truckItem.fare}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-4 justify-center">
                  <Button
                    title={<PenIcon className="w-4 h-4 text-white" />}
                    className="w-fit !px-2 bg-cedarChest hover:bg-[#e07160] border-cedarChest hover:border-cedarChest"
                    onClick={() => {
                      navigate(`/add-truck?id=${truckItem.id}`);
                    }}
                  />
                  <Button
                    title={
                      truckItem.id === deletingTruckId ? (
                        <Loader className="w-4 h-4 bg-cedarChest" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-white" />
                      )
                    }
                    className="w-fit !px-2 bg-cedarChest hover:bg-terraCotta border-terraCotta hover:border-terraCotta"
                    onClick={() => {
                      setDeletingTruckId(truckItem.id);
                      setIsModalOpen(true);
                    }}
                  />
                </CardFooter>
              </Card>
            );
          })}
          {Array.from({ length: skeletons }).map((_, index) => (
            <div
              key={index}
              className="border shadow rounded-md p-4 max-w-sm w-full"
            >
              <div className="animate-pulse justify-center flex flex-col space-x-4 opacity-70">
                <div className="rounded-lg self-center mb-4 bg-pantoneGreen h-10 w-40"></div>
                <div className="rounded-lg bg-pantoneGreen h-10 mx-auto"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-4 bg-pantoneGreen rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-4 bg-pantoneGreen rounded"></div>
                      <div className="h-4 bg-pantoneGreen rounded"></div>
                    </div>
                    <div className="h-4 bg-pantoneGreen rounded"></div>
                    <div className="h-4 bg-pantoneGreen rounded"></div>
                  </div>
                </div>
                <div className="h-6 mt-10 bg-pantoneGreen rounded"></div>
              </div>
            </div>
          ))}
          <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 bg-pantoneGreen text-white p-3 rounded-full shadow-lg hover:border-pantoneLight hover:bg-pantoneLight focus:outline-none"
          >
            <ChevronsUp />
          </button>
        </div>
      ) : (
        <div className="absolute top-0 -z-10 h-full w-full items-center flex flex-col justify-center">
          <NoLoadsImage />
          <span className="text-md m-4">
            Post trucks to see them listed here.
          </span>
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDeletingTruckId("");
        }}
        onConfirm={() => {
          mutateDelete(deletingTruckId);
          setDeletingTruckId("");
        }}
        title="Confirm Action"
        leftButtonClassName="hover:border-cedarChest"
        rightButtonClassName="bg-cedarChest hover:bg-terraCotta hover:border-terraCotta"
        description="Are you sure you want to delete this truck? This cannot be undone."
      />
    </div>
  );
};

export default MyTrucks;
