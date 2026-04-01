import { Navbar } from '@/components/landing/Navbar';
import { MobileCTA } from '@/components/landing/MobileCTA';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <MobileCTA />
    </>
  );
}
