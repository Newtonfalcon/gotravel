import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/contact/ContactForm";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Globe,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact Us",
  description:
    "Reach GoTravel by email, phone, or WhatsApp. We have offices in Dallas, Texas and Benin City, Nigeria. We typically respond within 24 hours.",
};

const OFFICES = [
  {
    flag: "🇺🇸",
    label: "USA Office",
    address: "17504 Preston Road\nDallas, Texas, USA",
    phone: "+1 (214) 469-9062",
    href: "tel:+12144699062",
  },
  {
    flag: "🇳🇬",
    label: "Nigeria Office",
    address: "2 Omorogbe Street\nOff Ihama Road, GRA\nBenin City, Edo State",
    phone: "+234 705 533 3344",
    href: "tel:+2347055333344",
  },
];

const CONTACT_METHODS = [
  {
    icon: Mail,
    label: "Email us",
    value: "gotravelsupport@gmail.com",
    href: "mailto:gotravelsupport@gmail.com",
    description: "We reply within 24 hours on business days.",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/2347055333344",
    description: "Fastest way to reach us. Usually reply in minutes.",
  },
  {
    icon: Phone,
    label: "Call USA",
    value: "+1 (214) 469-9062",
    href: "tel:+12144699062",
    description: "Mon–Fri, 9am–6pm CST",
  },
  {
    icon: Phone,
    label: "Call Nigeria",
    value: "+234 705 533 3344",
    href: "tel:+2347055333344",
    description: "Mon–Fri, 9am–6pm WAT",
  },
];

const FAQS = [
  {
    q: "How long does it take to get a response?",
    a: "We typically respond to emails within 24 hours on business days. WhatsApp messages are usually answered within a few hours.",
  },
  {
    q: "Can I get a refund if I'm not satisfied?",
    a: "Yes — we offer a full refund within 7 days of purchase, no questions asked. Just email us and we'll sort it out.",
  },
  {
    q: "Do you offer one-on-one visa consultations?",
    a: "Yes. Reach out via WhatsApp or email to book a private session with one of our visa specialists.",
  },
  {
    q: "I'm having trouble accessing my course — what do I do?",
    a: "Email gotravelsupport@gmail.com with your purchase details and we'll resolve it within 24 hours.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-20 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
            We're here to help you{" "}
            <span className="text-amber-400">travel smarter</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Have a question about a course, a visa issue, or just not sure where
            to start? Reach out — a real person will respond.
          </p>
        </div>
      </section>

      {/* Contact methods */}
      <section className="py-14 bg-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTACT_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <a
                  key={method.label}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="bg-black/10 hover:bg-black/20 rounded-2xl p-6 transition-colors duration-200 group block"
                >
                  <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  <p className="mt-4 text-xs font-semibold text-black/60 uppercase tracking-wider">
                    {method.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-black">{method.value}</p>
                  <p className="mt-1.5 text-xs text-black/60">{method.description}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main: Form + Offices */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

            {/* Form */}
            <div className="lg:col-span-3">
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
                Send a Message
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-gray-900">
                Tell us what's on your mind
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Course questions, visa guidance, payment issues — whatever it
                is, we're listening.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            {/* Offices */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
                  Our Offices
                </span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-gray-900">
                  Find us in person
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  We operate across two continents to serve Nigerians wherever
                  they are.
                </p>
              </div>

              {OFFICES.map((office) => (
                <div
                  key={office.label}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{office.flag}</span>
                    <h3 className="text-sm font-heading font-bold text-gray-900">
                      {office.label}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {office.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                      <a
                        href={office.href}
                        className="text-sm text-gray-600 hover:text-amber-600 transition-colors font-medium"
                      >
                        {office.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {/* Hours */}
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-gray-900">Office hours</h3>
                </div>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-medium">9:00 am – 6:00 pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 am – 3:00 pm</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400">
                  WhatsApp support available outside hours for urgent queries.
                </p>
              </div>

              {/* Email CTA */}
              <a
                href="mailto:gotravelsupport@gmail.com"
                className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl p-5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email support</p>
                  <p className="text-sm font-semibold group-hover:text-amber-400 transition-colors">
                    gotravelsupport@gmail.com
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
              FAQs
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-gray-900">
              Common questions
            </h2>
            <p className="mt-3 text-gray-500 text-sm">
              Can't find your answer here? Send us a message above.
            </p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <h3 className="text-sm font-heading font-bold text-gray-900">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 sm:py-28 bg-amber-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Globe className="w-10 h-10 text-black/40 mx-auto mb-5" />
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-black leading-tight">
            We make your travel dreams a reality
          </h2>
          <p className="mt-4 text-black/70">
            Trusted by over 8,000 Nigerians across 15+ countries.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center px-8 py-4 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Browse Courses
            </Link>
            <a
              href="https://wa.me/2347055333344"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-white/20 hover:bg-white/30 text-black font-semibold rounded-lg text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}