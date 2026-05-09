import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is missing. Stripe functionality will be disabled.')
}

const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build';

export const stripe = new Stripe(apiKey, {
  apiVersion: '2023-10-16' as any,
  typescript: true,
})
