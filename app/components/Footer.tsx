// app/components/Footer.tsx
import ProgressLink from './ProgressLink';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="container py-5">
      <div className="row">
        <div className="col-12 col-md">
          <h2 className="h5">کادو هنری هرا</h2>
          <small className="d-block mb-3 text-muted">&copy; {`2023–${year}`}</small>
        </div>
        <div className="col-6 col-md">
          <h2 className="h5">دسترسی سریع</h2>
          <ul className="list-unstyled text-small">
            <li><ProgressLink href="/products" className="link-secondary text-decoration-none">محصولات</ProgressLink></li>
            <li><ProgressLink href="/cart" className="link-secondary text-decoration-none">سبد خرید</ProgressLink></li>
            {/* No terms page exists yet; shown as inactive instead of a link to "#". */}
            <li><span className="text-muted">قوانین و مقررات (به‌زودی)</span></li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h2 className="h5">درباره ما</h2>
          <ul className="list-unstyled text-small">
            <li><ProgressLink href="/about" className="link-secondary text-decoration-none">داستان هرا</ProgressLink></li>
            <li><ProgressLink href="/contact" className="link-secondary text-decoration-none">تماس با ما</ProgressLink></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
