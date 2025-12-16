import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Benefits from "@/sections/Benefits";
import Header from "@/sections/Header";
import HowItWorks from "@/sections/HowItWorks";
import Pricing from "@/sections/Pricing";
import Testimonials from "@/sections/Testimonials";
import WhyUs from "@/sections/WhyUs";
import getActiveProductsWithPrices from "../../../actions/getActiveProductsWithPrices";

export const dynamic = "force-dynamic";

export default async function Home() {
	const products = await getActiveProductsWithPrices();

	return (
		<main>
			<div className="bg-[#0D121F] px-[100px] text-white">
				<Navbar />
				<Header />
			</div>
			<Benefits />
			<HowItWorks />
			<WhyUs />
			<Testimonials />
			<Pricing products={products} />
			<Footer />
		</main>
	);
}
