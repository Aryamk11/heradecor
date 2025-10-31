// app/error.tsx
'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error
    console.error(error);
  }, [error]);

  return (
    <div className="container text-center my-5 py-5">
      <h2 className="display-4">خطایی رخ داد!</h2>
      <p className="lead text-muted">{error.message || 'مشکلی در بارگذاری این صفحه پیش آمده است.'}</p>
      <button
        onClick={() => reset()}
        className="btn btn-primary mt-3"
      >
        تلاش مجدد
      </button>
    </div>
  );
}