-- Migration: Fix infinite recursion in profiles RLS policies
-- Date: 2026-05-10
--
-- Problem: "Admins can view all profiles" queries profiles from within profiles RLS → infinite loop.
-- All other tables (orders, inquiries, room_presets, etc.) reference profiles in their admin policies
-- causing the same cascade.
--
-- Fix: Create a SECURITY DEFINER function is_admin() that bypasses RLS when checking the role,
-- then replace all recursive subqueries with a call to this function.

-- ─── Step 1: Security-definer helper ─────────────────────────────────────────
-- SECURITY DEFINER runs as the function owner (postgres), bypassing RLS on profiles.
-- SET search_path prevents search_path injection.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ─── Step 2: Drop recursive policies ─────────────────────────────────────────
DROP POLICY IF EXISTS "Admins can view all profiles"       ON public.profiles;
DROP POLICY IF EXISTS "Only admins can modify artwork stock" ON public.artwork_stock;
DROP POLICY IF EXISTS "Admins can view all orders"         ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders"           ON public.orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Only admins can view inquiries"     ON public.inquiries;
DROP POLICY IF EXISTS "Only admins can update inquiries"   ON public.inquiries;
DROP POLICY IF EXISTS "Only admins can modify room presets" ON public.room_presets;
DROP POLICY IF EXISTS "Only admins can manage subscribers" ON public.newsletter_subscribers;

-- ─── Step 3: Recreate policies using is_admin() ───────────────────────────────
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Only admins can modify artwork stock"
  ON public.artwork_stock FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- Order items: user can see their own, or admin can see all
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_items.order_id
        AND (user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Only admins can view inquiries"
  ON public.inquiries FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Only admins can update inquiries"
  ON public.inquiries FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Only admins can modify room presets"
  ON public.room_presets FOR ALL
  USING (public.is_admin());

CREATE POLICY "Only admins can manage subscribers"
  ON public.newsletter_subscribers FOR ALL
  USING (public.is_admin());
