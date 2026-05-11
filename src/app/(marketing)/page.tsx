import FoldingHero from '@/components/marketing/folding-hero'
import IrisGate from '@/components/marketing/iris-gate'
import BeyondGrid from '@/components/marketing/beyond-grid'
import Newsletter from '@/components/marketing/newsletter'

export default function Home() {
  return (
    <main className="min-h-screen bg-black [overflow-x:clip]">
      <FoldingHero />

      <IrisGate>
        <BeyondGrid />
        <Newsletter />
      </IrisGate>
    </main>
  )
}
