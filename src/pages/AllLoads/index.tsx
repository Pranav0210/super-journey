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
import { ClockIcon } from "lucide-react";
import NoLoadsImage from "../../assets/icons/no_loads_illustration.svg?react";
import { CardProps } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getContact, getLoads } from "./api";
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
  const [pageNo, setPageNo] = useState(1);
  const [cacheLoadsData, setCacheLoadsData] = useState([]);
  const [mapState, setMapState] = useState(new Map());

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
    queryFn: () => getLoads(pageNo),
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
        <span className="text-xl font-semibold">Loads Bazaar</span>
        <Link to="/add-load" className="ml-auto">
          <div className="bg-primaryIndigo hover:bg-navyLight hover:cursor-pointer text-white items-center flex rounded-md text-xs px-2 py-2">
            + Post New Load
          </div>
        </Link>
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
                <div className="rounded-lg self-center mb-4 bg-cloudyBlue h-10 w-40"></div>
                <div className="rounded-lg bg-cloudyBlue h-10 mx-auto"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-4 bg-cloudyBlue rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-4 bg-cloudyBlue rounded"></div>
                      <div className="h-4 bg-cloudyBlue rounded"></div>
                    </div>
                    <div className="h-4 bg-cloudyBlue rounded"></div>
                    <div className="h-4 bg-cloudyBlue rounded"></div>
                  </div>
                </div>
                <div className="h-6 mt-10 bg-cloudyBlue rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : cacheLoadsData?.length > 0 || isFetching ? (
        <div id="scrollable-container" className="p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cacheLoadsData?.map((loadItem, loadIndex) => {
            return (
              <Card className={cn("w-[380px]", className)} {...props}>
                <CardHeader>
                  <CardTitle>{loadItem.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2">
                    <ClockIcon />
                    {"Expires: " +
                      dayjs(loadItem.expirationTime).format(
                        "DD-MM-YYYY,  hh:mm A",
                      )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none mb-2">
                        Pick & Drop Location
                      </p>
                      <p className="text-sm text-muted-foreground flex gap-2 items-center">
                        <PinDrop className="w-4 h-4 text-navyLight" />
                        {loadItem.pickupPoint}
                      </p>
                      <p className="text-sm text-muted-foreground flex gap-2 items-center">
                        <PinDrop className="w-4 h-4 text-verifiedGreen" />
                        {loadItem.dropPoint}
                      </p>
                    </div>
                  </div>
                  {/**
                   * This block below is not functional right now because of object format. However we must achieve this.
                   */}
                  <div>
                    {loadItem.load_spec?.map((item, index) => (
                      <div
                        key={index}
                        className="mb-4 grid grid-cols-[25px_1fr] items-start text-left last:mb-0 last:pb-0"
                      >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-navyLight" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {item}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-[25px_1fr] items-start text-left">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-navyLight" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {loadItem.materialName + " - " + loadItem.weight}
                      </p>
                    </div>
                  </div>
                  <div className=" grid grid-cols-[25px_1fr] items-start text-left">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-navyLight" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {loadItem.truckBody}{
                          loadItem.truckLength > 0 && ` - ${loadItem.truckLength} ft`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-start text-left">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-navyLight" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {"₹" + loadItem.fare}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-primaryIndigo hover:bg-navyLight"
                    onClick={() => {
                      if (
                        visibleList.length < 5 &&
                        !visibleList.includes(loadIndex)
                      ) {
                        const newList = [...visibleList, loadIndex];
                        mutateGetContact(loadItem.id);
                        setLoaderId(loadItem.id);
                        setVisibleList(newList);
                      } else if (
                        visibleList.length === 5 &&
                        !visibleList.includes(loadIndex)
                      ) {
                        showToast({
                          message: "Only 5 views allowed for free.",
                          type: "error",
                        });
                      } else if (visibleList.includes(loadIndex)) {
                        navigator.clipboard.writeText(
                          mapState.get(loadItem.id),
                        );

                        showToast({
                          message: "Copied to clipboard!",
                          type: "success",
                        });
                      }
                    }}
                  >
                    {isGettingContact && loaderId == loadItem.id ? (
                      <Loader className="h-4 w-4 bg-primaryIndigo" />
                    ) : (
                      <>
                        <PhoneIcon />{" "}
                        {visibleList.includes(loadIndex)
                          ? mapState.get(loadItem.id)
                          : "Show Contact"}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
          {Array.from({ length: skeletons }).map((_, index) => (
            <div
              key={index}
              className="border shadow rounded-md p-4 max-w-sm w-full"
            >
              <div className="animate-pulse justify-center flex flex-col space-x-4">
                <div className="rounded-lg self-center mb-4 bg-cloudyBlue h-10 w-40"></div>
                <div className="rounded-lg bg-cloudyBlue h-10 mx-auto"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-4 bg-cloudyBlue rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-4 bg-cloudyBlue rounded"></div>
                      <div className="h-4 bg-cloudyBlue rounded"></div>
                    </div>
                    <div className="h-4 bg-cloudyBlue rounded"></div>
                    <div className="h-4 bg-cloudyBlue rounded"></div>
                  </div>
                </div>
                <div className="h-6 mt-10 bg-cloudyBlue rounded"></div>
              </div>
            </div>
          ))}
          {/* <ScrollToTopButton containerId="scrollable-container" /> */}
        </div>
      ) : (
        <div className="absolute top-0 -z-10 h-full w-full items-center flex flex-col justify-center">
          <NoLoadsImage />
          <span className="text-md m-4">
            Loads Bazar empty! <br />
            You'll see cards when someone posts a load.
          </span>
        </div>
      )}
      <ScrollToTopButton containerId="scrollable-container" />
    </div>
  );
};

export default AllLoads;
