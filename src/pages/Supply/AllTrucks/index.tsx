import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import cn from "classnames";
import { Button } from "@/components/ui/button";
import PhoneIcon from "@/assets/icons/phone.svg?react";
import PinDrop from "@/assets/icons/pin_drop.svg?react";
import { BusFrontIcon, ChevronsUp, ClockIcon } from "lucide-react";
import NoLoadsImage from "@/assets/icons/no_loads_illustration.svg?react";
import { CardProps } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getContact, getTrucks } from "./api";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useToast } from "@/components/Toast/toastProvider";
import Loader from "@/assets/icons/loading.svg?react";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const AllLoads = ({ className, ...props }: CardProps) => {
  const [visibleList, setVisibleList] = useState([]);
  const [skeletons, setSkeletons] = useState(0);
  // const [showToast, setShowToast] = useState(false);
  // const [toastMsg, setToastMsg] = useState("");
  // const [toastClassNames, setToastClassNames] = useState("");
  const [loaderId, setLoaderId] = useState("");
  const [mapState, setMapState] = useState(new Map());
  const [pageNo, setPageNo] = useState(1);
  const [cacheLoadsData, setCacheLoadsData] = useState([]);

  const handleAddOrUpdate = (key, value) => {
    setMapState((prevMap) => {
      const newMap = new Map(prevMap); // Create a new Map based on the current state
      newMap.set(key, value); // Add or update the key-value pair
      return newMap;
    });
  };

  // const handleClear = () => {
  //   setMapState(new Map()); // Reset the state to an empty Map
  // };
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // const triggerToast = () => {
  //   setShowToast(true);
  //   setTimeout(() => setShowToast(false), 3000);
  // };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10;

    if (isAtBottom && !isFetching) {
      setSkeletons(6 - (cacheLoadsData?.length % 6));
      setPageNo((prev) => prev + 1);
      queryClient.invalidateQueries();
    }
  };

  const {
    data: loadsData,
    isLoading,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["getLoads"],
    queryFn: () => getTrucks(pageNo),
  });

  const { mutate: mutateGetContact, isPending: isGettingContact } = useMutation(
    {
      mutationKey: ["getContact"],
      mutationFn: (loadId) => getContact(loadId),
      onSuccess(data, variable) {
        const loadId = variable;
        handleAddOrUpdate(`${loadId}`, data?.data?.contact);
      },
    },
  );

  // useEffect(() => console.log('skeletons', skeletons), [skeletons])

  useEffect(() => {
    if (loadsData) {
      if (pageNo !== 1)
        setCacheLoadsData([...cacheLoadsData, ...loadsData?.data]);
      else setCacheLoadsData(loadsData?.data);
    }
    setSkeletons(0);
  }, [isFetched, loadsData]);

  console.log("list", visibleList);
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="relative h-full overflow-y-scroll overflow-x-hidden font-poppins"
    >
      <div className="border-b-[1px] border-borderGray p-4 flex flex-grow items-center sticky z-10 top-0 bg-white">
        <span className="text-xl font-semibold flex gap-4 items-center"><div className="ml-2 relative flex items-center">
          <BusFrontIcon className="stroke-[1.5px] h-8 w-8" />
          <BusFrontIcon
            className="absolute right-3 top-0 stroke-[1.5px] h-8 w-8"
            style={{
              clipPath: 'inset(0 40% 0 0)',
            }}
          />
        </div>Trucks Bazaar</span>
        {/* <Link to="/add-load" className="ml-auto">
          <div className="bg-cedarChest hover:bg-terraCotta hover:cursor-pointer text-white items-center flex rounded-md text-xs px-2 py-2">
            + Post New Load
          </div>
        </Link> */}
      </div>
      {/* {showToast && <Toast message={toastMsg} classNames={toastClassNames} />} */}

      {isLoading ? (
        <div className="p-6 grid xs:grid-cols-2 md:grid-cols-3 gap-6 ">
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
      ) : cacheLoadsData?.length > 0 || isFetching ? (
        <div className="p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cacheLoadsData?.map((truckItem, truckIndex) => {
            return (
              <Card className={cn("w-[380px]", className)} {...props}>
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
                    {truckItem.load_spec?.map((item, index) => (
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
                <CardFooter>
                  <Button
                    className="w-full bg-cedarChest hover:bg-terraCotta hover:border-terraCotta"
                    onClick={() => {
                      if (
                        visibleList.length < 5 &&
                        !visibleList.includes(truckIndex)
                      ) {
                        const newList = [...visibleList, truckIndex];
                        mutateGetContact(truckItem.id);
                        setLoaderId(truckItem.id);
                        setVisibleList(newList);
                      } else if (
                        visibleList.length === 5 &&
                        !visibleList.includes(truckIndex)
                      ) {
                        showToast({
                          message: "Only 5 views allowed for free.",
                          type: "error",
                        });
                      } else if (visibleList.includes(truckIndex)) {
                        navigator.clipboard.writeText(
                          mapState.get(truckItem.id),
                        );

                        showToast({
                          message: "Copied to clipboard!",
                          type: "success",
                        });
                      }
                    }}
                  >
                    {isGettingContact && loaderId == truckItem.id ? (
                      <Loader className="h-4 w-4 bg-cedarChest" />
                    ) : (
                      <>
                        <PhoneIcon />{" "}
                        {visibleList.includes(truckIndex)
                          ? mapState.get(truckItem.id)
                          : "Show Contact"}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
          <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 bg-pantoneGreen text-white p-3 rounded-full shadow-lg hover:border-pantoneLight hover:bg-pantoneLight focus:outline-none"
          >
            <ChevronsUp />
          </button>
          {Array.from({ length: skeletons }).map((_, index) => (
            <div
              key={index}
              className="border shadow rounded-md p-4 max-w-sm w-full"
            >
              <div className="animate-pulse justify-center flex flex-col space-x-4">
                <div className="rounded-lg self-center mb-4 bg-pantoneGreen opacity-60 h-10 w-40"></div>
                <div className="rounded-lg bg-pantoneGreen opacity-60 h-10 mx-auto"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-4 bg-pantoneGreen opacity-60 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-4 bg-pantoneGreen opacity-60 rounded"></div>
                      <div className="h-4 bg-pantoneGreen opacity-60 rounded"></div>
                    </div>
                    <div className="h-4 bg-pantoneGreen opacity-60 rounded"></div>
                    <div className="h-4 bg-pantoneGreen opacity-60 rounded"></div>
                  </div>
                </div>
                <div className="h-6 mt-10 bg-pantoneGreen opacity-60 rounded"></div>
              </div>
            </div>
          ))}
          {/* <ScrollToTopButton containerId="scrollable-container" /> */}
        </div>
      ) : (
        <div className="absolute top-0 -z-10 h-full w-full items-center flex flex-col justify-center">
          <NoLoadsImage />
          <span className="text-md m-4">
            Trucks Bazar empty! <br />
            You'll see cards when someone posts a truck.
          </span>
        </div>
      )}
      <ScrollToTopButton containerId="scrollable-container" />
    </div>
  );
};

export default AllLoads;
