import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { createOrRetrieveCustomer } from "@/lib/supabaseAdmin";
import { getURL } from "@/lib/helpers";

export async function POST(request: Request) {
	try {
		const { priceId, productName } = await request.json();

		if (!priceId) {
			return NextResponse.json(
				{ error: "Price ID is required" },
				{ status: 400 }
			);
		}

		const supabase = createRouteHandlerClient({ cookies });
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(
				{ error: "User not authenticated" },
				{ status: 401 }
			);
		}

		const customer = await createOrRetrieveCustomer({
			uuid: user.id,
			email: user.email || "",
		});

		// Add 7-day trial for Starter plan
		const isStarterPlan = productName?.toLowerCase() === "starter";

		const session = await stripe.checkout.sessions.create({
			customer,
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			mode: "subscription",
			allow_promotion_codes: true,
			subscription_data: isStarterPlan
				? {
						trial_period_days: 7,
				  }
				: undefined,
			success_url: `${getURL()}?success=true`,
			cancel_url: `${getURL()}?canceled=true`,
		});

		return NextResponse.json({ url: session.url });
	} catch (error: any) {
		console.error("Checkout error:", error);
		return NextResponse.json(
			{ error: error.message || "Internal server error" },
			{ status: 500 }
		);
	}
}
