import Benefits from "@/components/landing/Benefits";
import CtaBanner from "@/components/landing/CtaBanner";
import FeaturedCourses from "@/components/landing/FeaturedCourses";
import Footer from "@/components/landing/Footer";
import HeroCarousel from "@/components/landing/HeroCarousel";
import Navbar from "@/components/landing/Navbar";
import StatsBar from "@/components/landing/StatsBar";
import Testimonials from "@/components/landing/Testimonials";
import TrustBanner from "@/components/landing/TrustBanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroCarousel />
      <TrustBanner />
      <StatsBar />
      <FeaturedCourses />
      <Benefits />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </div>
  );
}