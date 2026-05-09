import Navbar from '@/components/marketing/navbar'
import Footer from '@/components/marketing/footer'
import Newsletter from '@/components/marketing/newsletter'
import CookieBanner from '@/components/marketing/cookie-banner'
import SmoothScroll from '@/components/providers/smooth-scroll'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <CookieBanner />
      <SmoothScroll>
        {children}
        <Newsletter />
        <Footer />
      </SmoothScroll>
    </>
  )
}
