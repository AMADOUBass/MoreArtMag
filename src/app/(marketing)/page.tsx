import IrisHero from '@/components/three/iris-hero'
import IrisGate from '@/components/marketing/iris-gate'
import BeyondGrid from '@/components/marketing/beyond-grid'
import Newsletter from '@/components/marketing/newsletter'

export default function Home() {
  return (
    <main className="min-h-screen bg-black [overflow-x:clip]">
      <IrisHero />

      <IrisGate>
        <BeyondGrid />
        <Newsletter />
      </IrisGate>
    </main>
  )
}
