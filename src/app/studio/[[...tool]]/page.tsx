/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import dynamic from 'next/dynamic'

// On force le rendu uniquement côté client pour éviter "window is not defined"
const StudioPageContent = dynamic(
  () => Promise.resolve(() => <NextStudio config={config} />),
  { ssr: false }
)

export default function StudioPage() {
  return <StudioPageContent />
}
