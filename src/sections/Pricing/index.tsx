"use client";

import { ProductWithPrice } from "../../../types";
import PricingCard from "./card";

interface PricingProps {
	products: ProductWithPrice[];
}

// Feature lists for each plan
const planFeatures: Record<string, { name: string; isIncluded: boolean }[]> = {
	Starter: [
		{ name: "Sync across devices", isIncluded: true },
		{ name: "5 workspaces", isIncluded: true },
		{ name: "Collaborate with 5 users", isIncluded: true },
		{ name: "Sharing permissions", isIncluded: false },
		{ name: "Admin tools", isIncluded: false },
		{ name: "100+ integrations", isIncluded: false },
	],
	Pro: [
		{ name: "Everything in Starter", isIncluded: true },
		{ name: "Unlimited workspaces", isIncluded: true },
		{ name: "Collaborative workspace", isIncluded: true },
		{ name: "Sharing permissions", isIncluded: true },
		{ name: "Admin tools", isIncluded: true },
		{ name: "100+ integrations", isIncluded: true },
	],
	Ultimate: [
		{ name: "Everything in Pro", isIncluded: true },
		{ name: "Daily performance reports", isIncluded: true },
		{ name: "Dedicated assistant", isIncluded: true },
		{ name: "Artificial intelligence", isIncluded: true },
		{ name: "Marketing tools & automations", isIncluded: true },
		{ name: "Advanced security", isIncluded: true },
	],
};

const Pricing = ({ products }: PricingProps) => {
	// Sort products by price (lowest first)
	const sortedProducts = [...products].sort((a, b) => {
		const priceA = a.prices?.[0]?.unit_amount || 0;
		const priceB = b.prices?.[0]?.unit_amount || 0;
		return priceA - priceB;
	});

	return (
		<div
			className="flex flex-col items-center justify-center gap-2 py-16"
			id="pricing">
			<h1 className="text-3xl font-semibold">Ready to Get Started?</h1>
			<p className="text-[20px]">
				Choose a plan that suits your business needs
			</p>

			<div className="flex items-start gap-6 mt-8 justify-center flex-wrap">
				{sortedProducts.map((product) => {
					const price = product.prices?.[0];
					if (!price) return null;

					const features = planFeatures[product.name || ""] || [];
					const isPopular = product.name === "Pro";
					const hasTrialPeriod = product.name === "Starter";

					return (
						<PricingCard
							key={product.id}
							productName={product.name || ""}
							priceId={price.id}
							title={product.name || "Plan"}
							description={product.description || ""}
							pricing={((price.unit_amount || 0) / 100).toString()}
							pricingUnit="€"
							interval={price.interval || "month"}
							features={features}
							popular={isPopular}
							trialDays={hasTrialPeriod ? 7 : undefined}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default Pricing;
