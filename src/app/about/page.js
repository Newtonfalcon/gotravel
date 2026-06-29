import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  Globe,
  Users,
  Award,
  Target,
  Heart,
  ShieldCheck,
  GraduationCap,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Us",
  description:
    "Learn about GoTravel — the company helping Nigerians travel the world with confidence. Our story, mission, and the team behind the courses.",
};

const MILESTONES = [
  { year: "2019", title: "Founded in Benin City", description: "GoTravel started with a single mission: make international travel accessible to every Nigerian." },
  { year: "2021", title: "First 1,000 Students", description: "Word spread fast. Our visa and travel courses helped over a thousand Nigerians travel abroad successfully." },
  { year: "2022", title: "USA Office Opened", description: "We expanded to Dallas, Texas to better serve the Nigerian diaspora and incoming travelers." },
  { year: "2024", title: "8,000+ Nigerians Trained", description: "Today, students from Lagos to Kano rely on GoTravel to navigate visas, immigration, and international life." },
];

const VALUES = [
  {
    icon: Heart,
    title: "Community First",
    description: "We build for Nigerians, by Nigerians. Every course reflects real experiences from people who have walked the same path.",
  },
  {
    icon: ShieldCheck,
    title: "Honest Guidance",
    description: "No shortcuts, no shortcuts. We teach you what actually works — not what sounds good on paper.",
  },
  {
    icon: GraduationCap,
    title: "Practical Education",
    description: "Every lesson is actionable. You leave knowing exactly what to do next, not just what the rules say.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Canada, UK, USA, UAE and beyond. We cover the destinations Nigerians are most eager to explore.",
  },
];

const TEAM = [
  {
    initials: "GO",
    name: "GoTravel Founder",
    role: "CEO & Lead Instructor",
    bio: "Traveled to 15+ countries and helped thousands of Nigerians navigate visas, relocations, and international travel.",
  },
  {
    initials: "AO",
    name: "Adaeze Obi",
    role: "Visa Specialist",
    bio: "Former immigration consultant with 7 years of experience helping Nigerians get their visas approved.",
  },
  {
    initials: "KE",
    name: "Kelechi Eze",
    role: "Course Producer",
    bio: "Builds every learning experience with clarity and precision — so students actually finish and succeed.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 overflow-hidden bg-gray-950">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1280&auto=format&fit=crop&q=60"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/60 to-gray-950" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
            We make your travel{" "}
            <span className="text-amber-400">dreams a reality</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            GoTravel was born from a simple truth: too many Nigerians were being
            turned away at visa offices, misled by bad advice, or simply
            didn't know where to start. We built the guide we wished we had.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm transition-colors"
            >
              Explore Our Courses
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-7 py-3.5 border border-white/20 hover:border-white/40 text-white font-medium rounded-lg text-sm transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-amber-500 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "8,000+", label: "Nigerians Trained" },
              { value: "15+", label: "Countries Covered" },
              { value: "50+", label: "Expert Courses" },
              { value: "4.9★", label: "Average Rating" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-heading font-bold text-black">
                  {s.value}
                </p>
                <p className="mt-1.5 text-sm font-medium text-black/70">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
                Our Mission
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-gray-900 leading-tight">
                Closing the gap between dreaming and departing
              </h2>
              <p className="mt-5 text-gray-500 leading-relaxed">
                Millions of Nigerians dream of traveling the world. But between
                confusing visa requirements, expensive consultants, and
                misinformation online, most never get started. GoTravel changes
                that.
              </p>
              <p className="mt-4 text-gray-500 leading-relaxed">
                We create affordable, practical courses taught by Nigerians who
                have done it — people who understand the hustle, the fears, and
                the stakes. Our students don't just learn, they travel.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-black" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  Goal: Help 50,000 Nigerians travel internationally by 2026
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80"
                  alt="Students celebrating travel success"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Visa Approved</p>
                    <p className="text-xs text-gray-400">98% success rate for our students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
              What We Stand For
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-gray-900">
              Our core values
            </h2>
            <p className="mt-3 text-gray-500">
              Every decision we make at GoTravel comes back to these four commitments.
            </p>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="mt-5 text-base font-heading font-bold text-gray-900">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
              Our Journey
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-gray-900">
              How we got here
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-[23px] sm:left-1/2 top-0 bottom-0 w-px bg-gray-200 sm:-translate-x-px" />
            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex gap-8 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                >
                  <div className={`hidden sm:block sm:w-1/2 ${i % 2 === 0 ? "sm:pr-12 text-right" : "sm:pl-12 text-left"}`}>
                    <span className="inline-block text-2xl font-heading font-bold text-amber-500">
                      {m.year}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-gray-900">{m.title}</h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{m.description}</p>
                  </div>
                  <div className="relative flex items-start sm:items-center sm:justify-center sm:w-0">
                    <div className="w-12 h-12 rounded-full bg-amber-500 border-4 border-white shadow flex items-center justify-center shrink-0 sm:absolute sm:-translate-x-1/2">
                      <span className="text-xs font-bold text-black">{m.year.slice(2)}</span>
                    </div>
                  </div>
                  <div className="sm:hidden flex-1">
                    <span className="text-lg font-heading font-bold text-amber-500">{m.year}</span>
                    <h3 className="mt-0.5 text-base font-bold text-gray-900">{m.title}</h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{m.description}</p>
                  </div>
                  <div className={`hidden sm:block sm:w-1/2 ${i % 2 === 0 ? "sm:pl-12" : "sm:pr-12"}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
              The Team
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-gray-900">
              People behind GoTravel
            </h2>
            <p className="mt-3 text-gray-500">
              Nigerians who have traveled, struggled, and succeeded — now sharing everything they know.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl p-8 border border-gray-100 text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500 text-black font-bold text-xl flex items-center justify-center mx-auto">
                  {member.initials}
                </div>
                <h3 className="mt-4 text-base font-heading font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-amber-600 mt-1">{member.role}</p>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-20 sm:py-28 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
              Where We Are
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold">
              Two countries, one mission
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                flag: "🇺🇸",
                country: "USA Office",
                address: "17504 Preston Road\nDallas, Texas, USA",
              },
              {
                flag: "🇳🇬",
                country: "Nigeria Office",
                address: "2 Omorogbe Street\nOff Ihama Road, GRA\nBenin City, Edo State",
              },
            ].map((office) => (
              <div
                key={office.country}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-amber-500/40 transition-colors duration-300"
              >
                <span className="text-3xl">{office.flag}</span>
                <h3 className="mt-4 text-base font-heading font-bold text-white">
                  {office.country}
                </h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                  {office.address}
                </p>
                <div className="mt-4 flex items-center gap-2 text-amber-400 text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Physical office</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-amber-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-black leading-tight">
            Ready to start your journey?
          </h2>
          <p className="mt-4 text-black/70 text-lg">
            Join thousands of Nigerians who took the first step with GoTravel.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center px-8 py-4 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white/20 hover:bg-white/30 text-black font-semibold rounded-lg text-sm transition-colors"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}