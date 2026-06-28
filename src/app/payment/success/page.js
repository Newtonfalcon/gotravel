import PaymentSuccessClient from "@/components/checkout/PaymentSuccessClient";

export const metadata = {
  title: "Verifying Payment — GoTravel",
};

/**
 * /payment/success
 *
 * Flutterwave redirects here after a payment attempt with these query params:
 *   ?status=successful|cancelled
 *   &transaction_id=<flutterwave-id>
 *   &tx_ref=<our-reference>
 *
 * This server component reads those params and hands them to the client
 * component, which handles verification and redirect to /dashboard.
 */
export default async function PaymentSuccessPage({ searchParams }) {
  const sp = await searchParams;

  const status = sp?.status ?? null;
  const transaction_id = sp?.transaction_id ?? null;
  const tx_ref = sp?.tx_ref ?? null;

  return (
    <PaymentSuccessClient
      status={status}
      transaction_id={transaction_id}
      tx_ref={tx_ref}
    />
  );
}