import { Link, useNavigate } from "react-router-dom";
import NoLoadsImage from "../../assets/icons/no_loads_illustration.svg?react";
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
import { ClockIcon, PenIcon, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import cn from "classnames";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteLoad, getMyLoads } from "./api";
import Button from "@/components/Button";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/Toast/toastProvider";
import { ConfirmModal } from "@/components/ConfirmModal";

const MyLoads = () => {
  const navigate = useNavigate();
  const [cacheLoadsData, setCacheLoadsData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [deletingLoadId, setDeletingLoadId] = useState("");
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
    data: loadsData,
    isLoading,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ["getMyLoads"],
    queryFn: () => getMyLoads(pageNo),
  });

  const { mutate: mutateDelete, isPending: isDeletingLoad } = useMutation({
    mutationFn: (itemId: string) => deleteLoad(itemId),
    onSuccess(data) {
      queryClient.invalidateQueries(["getMyLoads"]);
      setCacheLoadsData(cacheLoadsData.filter((item) => item.id !== data.id));
      setDeletingLoadId("");
      showToast({ message: "Deleted load successfully!", type: "success" });
      // setToastMsg("Deleted load successfully");
      // setToastClassNames("bg-verifiedGreen justify-center left-[50%]");
      // triggerToast();
    },
    onError() {
      showToast({ message: "Something went wrong.", type: "error" });
    },
  });

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10;

    if (isAtBottom && loadsData?.meta.totalPages >= pageNo && !isFetching) {
      setSkeletons(6 - (cacheLoadsData.length % 6));
      setPageNo((prev) => prev + 1);
      console.log(isAtBottom, isFetching, pageNo);
      queryClient.invalidateQueries(["getMyLoads"]);
    }
  };

  const { showToast } = useToast();

  // useEffect(() => console.log('skeletons', skeletons), [skeletons])

  useEffect(() => {
    if (loadsData) {
      if (pageNo !== 1)
        setCacheLoadsData([...cacheLoadsData, ...loadsData?.data]);
      else setCacheLoadsData(loadsData?.data);
    }
    setSkeletons(0);
  }, [loadsData]);

  return (
    <div
      className="relative h-full overflow-y-scroll overflow-x-hidden font-poppins"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {/* {showToast && <Toast message={toastMsg} classNames={toastClassNames} />} */}
      <div className="border-b-[1px] border-borderGray p-4 flex flex-grow items-center sticky top-0 z-10 bg-white">
        <span className="text-xl font-semibold">My Loads</span>
        <Link to="/add-load" className="ml-auto">
          <div className="bg-primaryIndigo hover:bg-navyLight hover:cursor-pointer text-white items-center flex rounded-md text-xs px-2 py-2">
            + Post New Load
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
      ) : cacheLoadsData.length > 0 || isFetching ? (
        <div className="p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cacheLoadsData.map((loadItem) => {
            return (
              <Card className={cn("w-[380px]")}>
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
                        {loadItem.materialName + " - " + loadItem.weight + "tn"}
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
                <CardFooter className="gap-4 justify-center">
                  <Button
                    title={<PenIcon className="w-4 h-4 text-white" />}
                    className="w-fit !px-2 bg-primaryIndigo hover:bg-navyLight"
                    onClick={() => {
                      navigate(`/add-load?id=${loadItem.id}`);
                    }}
                  />
                  <Button
                    title={
                      loadItem.id === deletingLoadId ? (
                        <Loader className="w-4 h-4 bg-primaryIndigo" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-white" />
                      )
                    }
                    className="w-fit !px-2 bg-primaryIndigo hover:bg-navyLight"
                    onClick={() => {
                      setDeletingLoadId(loadItem.id);
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
      ) : (
        <div className="absolute top-0 -z-10 h-full w-full items-center flex flex-col justify-center">
          <NoLoadsImage />
          <span className="text-md m-4">
            Post loads to see them listed here.
          </span>
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDeletingLoadId("");
        }}
        onConfirm={() => {
          mutateDelete(deletingLoadId);
          setDeletingLoadId("");
        }}
        title="Confirm Action"
        description="Are you sure you want to delete this load? This cannot be undone."
      />
    </div>
  );
};

export default MyLoads;
