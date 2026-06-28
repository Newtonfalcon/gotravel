
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getCourse } from "@/lib/data";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CheckoutForm from "@/components/checkout/Checkoutform";

export async function generateMetadata({ params }) {
  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) return { title: "Checkout — GoTravel" };
  return {
    title: `Enroll in ${course.title} — GoTravel`,
    description: `Get lifetime access to ${course.title}. Secure checkout powered by Flutterwave.`,
  };
}

export default async function CheckoutPage({ params, searchParams }) {
  const { courseId } = await params;
  const sp = await searchParams;

  // requireAuth() redirects to /sign-in if not authenticated
  const user = await requireAuth();

  const course = await getCourse(courseId);
  if (!course) notFound();

  // True if this user already owns the course (stored in user.courses array)
  const alreadyPurchased =
    Array.isArray(user.courses) && user.courses.includes(courseId);

  // Flutterwave appends these query params on redirect back to our site:
  //   ?status=successful|cancelled&tx_ref=GT-xxx&transaction_id=12345
  const callbackData = sp?.transaction_id
    ? {
        transaction_id: sp.transaction_id,
        tx_ref: sp.tx_ref ?? null,
        status: sp.status ?? null,
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar />
      <CheckoutForm
        course={course}
        courseId={courseId}
        alreadyPurchased={alreadyPurchased}
        callbackData={callbackData}
      />
      <Footer />
    </div>
  );
}
