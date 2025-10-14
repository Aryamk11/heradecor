// app/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="container py-5">
      <div className="row">
        <div className="col-12 col-md">
          <h5>کادو هنری هرا</h5>
          <small className="d-block mb-3 text-muted">&copy; 2023–2025</small>
        </div>
        <div className="col-6 col-md">
          <h5>دسترسی سریع</h5>
          <ul className="list-unstyled text-small">
            <li><Link href="/products" className="link-secondary text-decoration-none">محصولات</Link></li>
            <li><a className="link-secondary text-decoration-none" href="#">قوانین و مقررات</a></li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>درباره ما</h5>
          <ul className="list-unstyled text-small">
            <li><Link href="/about" className="link-secondary text-decoration-none">داستان هرا</Link></li>
            <li><a className="link-secondary text-decoration-none" href="#">تماس با ما</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}