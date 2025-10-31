// app/loading.tsx
export default function Loading() {
  // This component will automatically wrap page.tsx and products/page.tsx
  // You can replace this with a skeleton/spinner component.
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <p className="text-center fs-4">در حال بارگذاری...</p>
    </div>
  );
}