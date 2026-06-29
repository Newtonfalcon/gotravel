import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Star, Quote, TrendingUp, Globe, Award } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Testimonials",
  description:
    "Real stories from Nigerians who used GoTravel to get their visas approved, travel the world, and relocate abroad with confidence.",
};

const TESTIMONIALS = [
  {
    name: "Chioma Okafor",
    role: "First-Time Traveler",
    location: "Lagos",
    initials: "CO",
    rating: 5,
    destination: "Canada",
    content:
      "GoTravel helped me plan my first trip to Canada. I understood the visa process completely and saved over ₦200,000 on my travel arrangements. The step-by-step video explanations made everything feel possible. Best investment I ever made!",
  },
  {
    name: "Emeka Nwosu",
    role: "Student Visa Applicant",
    location: "Abuja",
    initials: "EN",
    rating: 5,
    destination: "Canada",
    content:
      "I applied for my Canadian study permit after taking the visa course here. The step-by-step guide was exactly what I needed — I got my visa approved in under 4 weeks! My friends were shocked. I've already referred three people.",
  },
  {
    name: "Aisha Bello",
    role: "Solo Traveler",
    location: "Kano",
    initials: "AB",
    rating: 5,
    destination: "UK",
    content:
      "As a Nigerian woman traveling solo for the first time, this course gave me confidence and practical tips I couldn't find anywhere else. The section on solo safety abroad was worth the entire course fee on its own.",
  },
  {
    name: "Tunde Adeyemi",
    role: "Business Traveler",
    location: "Lagos",
    initials: "TA",
    rating: 5,
    destination: "USA",
    content:
      "I had two previous B1/B2 visa rejections before GoTravel. After the course, I knew exactly what I was doing wrong. Third application — approved. I wish I had found this platform two years earlier.",
  },
  {
    name: "Ngozi Ike",
    role: "Relocating to the UK",
    location: "Port Harcourt",
    initials: "NI",
    rating: 5,
    destination: "UK",
    content:
      "The UK skilled worker visa process is overwhelming. GoTravel broke it down in a way that made sense. I'm writing this from London where I've been living for 6 months. Never thought it would actually happen.",
  },
  {
    name: "Babatunde Fashola",
    role: "Medical Professional",
    location: "Ibadan",
    initials: "BF",
    rating: 5,
    destination: "UAE",
    content:
      "I was skeptical at first. Another online course? But the instructors clearly know what they're talking about — real Nigerians who have done it. Got my Dubai visit visa with no hassle. Already planning my next trip.",
  },
  {
    name: "Ifunanya Obi",
    role: "Graduate Student",
    location: "Enugu",
    initials: "IO",
    rating: 5,
    destination: "USA",
    content:
      "The F1 student visa module was incredibly detailed. Every document, every question they might ask — it was all covered. I walked into my embassy interview prepared and confident. Got my visa the same day.",
  },
  {
    name: "Seun Akinwande",
    role: "Travel Blogger",
    location: "Lagos",
    initials: "SA",
    rating: 5,
    destination: "Multiple",
    content:
      "I've taken a lot of travel courses online. GoTravel is the only one built specifically for Nigerians — and it shows. They understand our banks, our documents, our challenges. Nothing else compares.",
  },
  {
    name: "Amina Garba",
    role: "Entrepreneur",
    location: "Kano",
    initials: "AG",
    rating: 5,
    destination: "Germany",
    content:
      "The budget travel strategies alone saved me hundreds of dollars on my business trip to Germany. The course on flight hacking and hotel deals was eye-opening. I travel differently now — smarter and cheaper.",
  },
];

const HIGHLIGHTS = [
  {
    icon: TrendingUp,
    value: "98%",
    label: "Visa approval rate",
    description: "Of students who complete our courses and follow our guidance get their visas approved.",
  },
  {
    icon: Globe,
    value: "15+",
    label: "Countries reached",
    description: "Our students have successfully traveled and relocated to countries across 5 continents.",
  },
  {
    icon: Award,
    value: "4.9★",
    label: "Average course rating",
    description: "Consistently rated near-perfect across all platforms by thousands of verified students.",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, featured = false }) {
  return (
    <div
      className={`bg-white rounded-2xl flex flex-col border transition-all duration-300 hover:shadow-md ${
        featured
          ? "p-8 sm:p-10 border-amber-200 shadow-sm"
          : "p-6 sm:p-8 border-gray-100"
      }`}
    >
      <Quote className="w-7 h-7 text-amber-400 shrink-0 mb-5" />
      <p className="text-gray-600 leading-relaxed flex-1 text-sm sm:text-base">
        "{testimonial.content}"
      </p>
      <div className="mt-6 pt-5 border-t border-gray-100">
        <StarRating rating={testimonial.rating} />
        <div className="flex items-center gap-3 mt-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-sm shrink-0">
            {testimonial.initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
            <p className="text-xs text-gray-400 truncate">
              {testimonial.role} · {testimonial.location}
            </p>
          </div>
          <div className="ml-auto shrink-0">
            <span className="inline-block text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
              {testimonial.destination}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const [featured, ...rest] = TESTIMONIALS;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold text-amber-600 uppercase tracking-widest mb-4">
            Student Success Stories
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight">
            Real people. Real visas.{" "}
            <span className="text-amber-500">Real results.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            These aren't actors or paid reviewers. They're Nigerians from Lagos,
            Kano, Abuja and everywhere in between — who took a course and
            changed their lives.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-14 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8">
            {HIGHLIGHTS.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.label} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <p className="mt-4 text-3xl sm:text-4xl font-heading font-bold text-amber-400">
                    {h.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{h.label}</p>
                  <p className="mt-2 text-xs text-gray-400 leading-relaxed max-w-[200px] mx-auto">
                    {h.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured testimonial */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
              Featured Story
            </span>
          </div>
          <TestimonialCard testimonial={featured} featured />
        </div>
      </section>

      {/* Grid */}
      <section className="py-6 pb-20 sm:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">
              More stories from our community
            </h2>
            <p className="mt-3 text-gray-500 text-sm">
              Filtered from thousands of reviews — these represent every kind of traveler we serve.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {rest.map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
            Your turn
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-heading font-bold text-white leading-tight">
            The next success story could be yours
          </h2>
          <p className="mt-4 text-gray-400 text-lg">
            Join 8,000+ Nigerians who trusted GoTravel with their travel journey.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm transition-colors"
            >
              Start Learning Today
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-8 py-4 border border-white/20 hover:border-white/40 text-white font-medium rounded-lg text-sm transition-colors"
            >
              About GoTravel
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}