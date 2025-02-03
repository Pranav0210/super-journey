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
import { BusFrontIcon, ChevronsUp, ClockIcon, EyeIcon, HomeIcon, ListIcon, MoveHorizontal, PenIcon, PhoneIcon, ScanEyeIcon, ShieldCheck, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import cn from "classnames";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTruck, getAllTransporters, getTransporterContact } from "./api";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/Toast/toastProvider";
import { ConfirmModal } from "@/components/ConfirmModal";
import { getContact } from "../AllTrucks/api";

const Directory = () => {
	const navigate = useNavigate();
	const [cacheTrucksData, setCacheTrucksData] = useState([]);
	const [pageNo, setPageNo] = useState(1);
	const [deletingTruckId, setDeletingTruckId] = useState("");
	const [skeletons, setSkeletons] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [visibleList, setVisibleList] = useState([]);
	const [loaderId, setLoaderId] = useState("");
	const [mapState, setMapState] = useState(new Map());
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
		queryKey: ["getDirectory"],
		queryFn: () => getAllTransporters(pageNo),
	});

	const { mutate: mutateDelete, isPending: isDeletingTruck } = useMutation({
		mutationFn: (itemId: string) => deleteTruck(itemId),
		onSuccess(data) {
			queryClient.invalidateQueries(["getDirectory"]);
			setCacheTrucksData(cacheTrucksData.filter((item) => item.id !== data.id));
			setDeletingTruckId("");
			showToast({ message: "Deleted truck successfully!", type: "success" });
			// setToastMsg("Deleted truck successfully");
			// setToastClassNames("bg-verifiedGreen justify-center left-[50%]");
			// triggerToast();
		},
		onError() {
			showToast({ message: "Something went wrong.", type: "error" });
		},
	});

	const { mutate: mutateGetContact, isPending: isGettingContact } = useMutation(
		{
			mutationKey: ["getContact"],
			mutationFn: (loadId) => getTransporterContact(loadId),
			onSuccess(data, variable) {
				const loadId = variable;
				handleAddOrUpdate(`${loadId}`, data?.data?.contact);
			},
			onError(error) {

			}
		},
	);

	const handleAddOrUpdate = (key, value) => {
		setMapState((prevMap) => {
			const newMap = new Map(prevMap);
			newMap.set(key, value);
			return newMap;
		});
	};

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
			// console.log(isAtBottom, isFetching, pageNo);
			queryClient.invalidateQueries(["getDirectory"]);
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
				<span className="text-xl font-semibold flex gap-4 items-center"><ListIcon className="stroke-[1.5px] h-5 w-5" />Transporter Directory</span>
				<Link to="/add-transporter" className="ml-auto">
					<div className="bg-cedarChest hover:bg-terraCotta hover:cursor-pointer text-white items-center flex rounded-md text-xs px-2 py-2">
						+ Add New Transporter
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
					{cacheTrucksData.map((directoryItem, truckIndex) => {
						return (
							<Card className={cn("w-[380px]")}>
								<CardHeader>
									<CardTitle>{directoryItem.companyName}</CardTitle>
									{/* <CardDescription className="flex items-center justify-center gap-2">
										<ClockIcon />
                                        {"Expires: " +
                                            dayjs(directoryItem.expirationTime).format(
                                                "DD-MM-YYYY,  hh:mm A",
                                            )}
										Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci, ea.
									</CardDescription> */}
								</CardHeader>
								<CardContent className="grid gap-4">

									<div className="-mx-6 px-4 flex gap-4 overflow-x-auto scrollbar-hide">
										{directoryItem.lanes?.map((item) => {
											// console.log(item)
											return (
												<div className="flex w-[90%] text-sm justify-center shrink-0 items-center space-x-4 rounded-md border px-4 py-2">
													<span className="flex items-center gap-2">
														<PinDrop className="text-terraCotta h-5 w-5" />{item.districtA}
													</span>
													<span className="text-2xl">⇌</span>
													<span className="flex items-center gap-2">
														<PinDrop className="text-pantoneGreen h-5 w-5" />{item.districtB}
													</span>
												</div>
											)
										})
										}
										{/* <div className="flex w-full shrink-0 items-center space-x-4 rounded-md border p-4">
											{JSON.stringify(directoryItem.lanes)}
										</div> */}
									</div>
									<div className="flex justify-center space-y-1">
										<p className="text-sm text-muted-foreground flex gap-2 items-center">
											<HomeIcon className="w-4 h-4 text-terraCotta" />
											{directoryItem.homeBase}
										</p>
									</div>
									<div className="flex justify-center gap-4">
										<div className="space-y-1 flex items-start space-x-1">
											<ScanEyeIcon className="h-5 w-5" />
											<p className="text-sm font-medium leading-none">
												{directoryItem.viewedBy}
											</p>
										</div>
										<div className="space-y-1 flex items-start space-x-1">
											<BusFrontIcon className="h-5 w-5" />
											<p className="text-sm font-medium leading-none">
												{directoryItem.totalTrucks ?? 0}
											</p>
										</div>
										<div className="space-y-1 flex items-start space-x-1">
											<ShieldCheck className="h-5 w-5" />
											{/* <p className="text-sm font-medium leading-none">
												{directoryItem.viewedBy}
											</p> */}
										</div>
									</div>
									{/* <div className=" grid grid-cols-[25px_1fr] items-start text-left">
										<span className="flex h-2 w-2 translate-y-1 rounded-full bg-pantoneGreen" />
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none">
												{directoryItem.truckBody +
													" - " +
													directoryItem.truckLength +
													"ft"}
											</p>
										</div>
									</div> */}
									{/* <div className="mb-4 grid grid-cols-[25px_1fr] items-start text-left">
										<span className="flex h-2 w-2 translate-y-1 rounded-full bg-pantoneGreen" />
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none">
												{"₹" + directoryItem.fare}
											</p>
										</div>
									</div> */}
								</CardContent>
								<CardFooter>
									<Button
										className="w-full bg-cedarChest hover:bg-terraCotta hover:border-cedarChest"
										onClick={() => {
											if (
												visibleList.length < 5 &&
												!visibleList.includes(truckIndex)
											) {
												const newList = [...visibleList, truckIndex];
												mutateGetContact(directoryItem.id);
												setLoaderId(directoryItem.id);
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
													mapState.get(directoryItem.id),
												);

												showToast({
													message: "Copied to clipboard!",
													type: "success",
												});
											}
										}}
									>
										{isGettingContact && loaderId == directoryItem.id ? (
											<Loader className="h-4 w-4 bg-primaryIndigo" />
										) : (
											<>
												<PhoneIcon />{" "}
												{visibleList.includes(truckIndex)
													? mapState.get(directoryItem.id)
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
						Directory Empty! You'll see contact cards when somebody posts their details.
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

export default Directory;
