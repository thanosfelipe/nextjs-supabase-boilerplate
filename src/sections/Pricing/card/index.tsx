"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

interface Feature {
	name: string;
	isIncluded: boolean;
}

interface PricingCardProps {
	productName: string;
	priceId: string;
	title: string;
	description: string;
	pricing: string;
	pricingUnit: string;
	interval: string;
	features: Feature[];
	popular?: boolean;
	trialDays?: number;
}

const PricingCard: FC<PricingCardProps> = ({
	productName,
	priceId,
	title,
	description,
	pricing,
	pricingUnit,
	interval,
	features,
	popular,
	trialDays,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useUser();
	const router = useRouter();

	const handleCheckout = async () => {
		if (!user) {
			router.push("/sign-in");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					priceId,
					productName,
				}),
			});

			const data = await response.json();

			if (data.url) {
				window.location.href = data.url;
			} else {
				console.error("No checkout URL returned");
			}
		} catch (error) {
			console.error("Checkout error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-[#1A1B25] p-6 rounded-lg flex flex-col gap-4 w-[350px] mb-6">
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center gap-3">
					<h1 className="text-[24px] font-semibold text-white">{title}</h1>
					{trialDays && (
				<Badge className="w-fit bg-purple-600 text-white">
					{trialDays}-day free trial
				</Badge>
			)}
				</div>
				{popular && (
					<Badge className="w-fit bg-purple-600 text-white">Popular</Badge>
				)}
			</div>
			
			<div className="flex items-center gap-2">
				<h1 className="text-[30px] font-semibold text-white">
					{pricingUnit}
					{pricing}
				</h1>
				<p className="text-[16px] font-normal text-gray-400">/{interval}</p>
			</div>
			<p className="text-gray-400">{description}</p>
			<div className="flex flex-col gap-4 my-4">
				{features.map((feature, index) => {
					return (
						<div className="flex items-center gap-2" key={index}>
							{feature.isIncluded ? (
								<Image
									src="/images/pricing/included.svg"
									alt="included"
									width={20}
									height={20}
								/>
							) : (
								<Image
									src="/images/pricing/not-included.svg"
									alt="not included"
									width={20}
									height={20}
								/>
							)}
							<p className="text-white">{feature.name}</p>
						</div>
					);
				})}
			</div>
			<Button
				className="w-[80%] mx-auto"
				onClick={handleCheckout}
				disabled={isLoading}>
				{isLoading ? "Loading..." : "Get Started"}
			</Button>
		</div>
	);
};

export default PricingCard;
