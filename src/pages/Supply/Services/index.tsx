import { cn } from "@/lib/utils";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { recommendedItems } from "./data";
import { useToast } from "@/components/Toast/toastProvider";


export const HoverEffect = ({
	items,
	className,
}: {
	items: {
		title: string | React.ReactNode;
		icon: React.ReactNode;
	}[];
	className?: string;
}) => {
	let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const gridRef = useRef();
	const { showToast } = useToast();

	return (
		<div className={cn(" bg-white py-6 px-6 rounded-3xl", className)}>
			<span className="mb-6 ml-1 flex text-left text-xl font-medium font-poppins">
				Other Services
			</span>
			<div
				ref={gridRef}
				className="grid grid-cols-1 gap-2 md:grid-cols-4 lg:grid-cols-3"
			>
				{items.map((item, idx) => (
					<Link
						to=""
						className="relative group block py-1 px-1 h-[70px] w-full"
						onMouseEnter={() => setHoveredIndex(idx)}
						onMouseLeave={() => setHoveredIndex(null)}
						onClick={() => showToast({ message: "Your favorite service will be coming soon!", type: "success", duration: 3000 })}
					>
						<AnimatePresence>
							{hoveredIndex === idx && (
								<motion.span
									className={classNames(
										"absolute inset-0 h-full w-full border-2 border-pantoneGreen block rounded-2xl z-50",
									)}
									layoutId="hoverBackground"
									initial={{ opacity: 0 }}
									animate={{
										opacity: 1,
										transition: { duration: 0.15 },
									}}
									exit={{
										opacity: 0,
										transition: { duration: 0.15, delay: 0.2 },
									}}
								>
									{/* <motion.div
										className="inset-0 bg-lightMint opacity-70 text-white font-poppins h-full w-full items-center justify-center flex z-100 rounded-2xl"
										initial={{ opacity: 0 }}
										animate={{
											opacity: 1,
											transition: { duration: 0.15, delay: 0.25 }, // Delayed fade-in
										}}
										exit={{
											opacity: 0,
											transition: { duration: 0.15 },
										}}
									>
										Coming Soon
									</motion.div> */}
								</motion.span>
							)}
						</AnimatePresence>
						<Card>
							<CardTitle>
								{
									<div className="flex items-center gap-4 px-2 h-full">
										{item.icon}
										<span>{item.title}</span>
									</div>
								}
							</CardTitle>
						</Card>
					</Link>
				))}
			</div>
		</div >
	);
};

export const Card = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				"rounded-xl h-full w-full p-2 overflow-hidden bg-white border-2 border-[#E1E1E1] dark:border-white/[0.2] group-hover:border-[#C2C2C2] relative z-20",
				className,
			)}
		>
			<div className="relative z-50 h-full">
				<div className="p-2 h-full">{children}</div>
			</div>
		</div>
	);
};
export const CardTitle = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<h4
			className={cn(
				"text-black font-poppins text-sm text-left font-medium tracking-wide h-full",
				className,
			)}
		>
			{children}
		</h4>
	);
};
export const CardDescription = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<p
			className={cn(
				"mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
				className,
			)}
		>
			{children}
		</p>
	);
};

function Services() {
	return (
		<div className="flex h-screen bg-[#FAFAFA]">
			<main className="bg-[#FAFAFA] m-6">
				<HoverEffect items={recommendedItems} />
			</main>
		</div>
	);
}

export default Services;