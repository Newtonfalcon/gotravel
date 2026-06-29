import Image from "next/image";

export default function RootLoading() {
  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="logo-pulse">
          <Image
            src="/logo.png"
            alt="GoTravel"
            width={72}
            height={72}
            priority
          />
        </div>
        <div className="spinner" aria-label="Loading" role="status" />
      </div>

      <style>{`
        .page-loader {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          z-index: 9999;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
        }

        .logo-pulse {
          animation: logoPulse 1.4s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .logo-pulse img {
          display: block;
          border-radius: 16px;
        }

        @keyframes logoPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.12);
            opacity: 0.75;
          }
        }

        .spinner {
          width: 28px;
          height: 28px;
          border: 2.5px solid #f0ede8;
          border-top-color: #111111;
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
          will-change: transform;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-pulse { animation: none; opacity: 1; }
          .spinner { animation: none; border-top-color: #111111; }
        }
      `}</style>
    </div>
  );
}