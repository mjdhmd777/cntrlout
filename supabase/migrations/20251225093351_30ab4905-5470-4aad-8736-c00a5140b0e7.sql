-- Fix 1: Remove overly permissive policy that exposes emails to all authenticated users
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;

-- Fix 2: Restrict payment updates - users can only update pending payments, not mark as completed
DROP POLICY IF EXISTS "Users can update their own payment" ON public.freelancer_payments;

-- Only allow users to update their pending payments (not change status to completed)
CREATE POLICY "Users can update pending payments only" 
ON public.freelancer_payments 
FOR UPDATE 
USING (auth.uid() = user_id AND payment_status = 'pending')
WITH CHECK (auth.uid() = user_id AND payment_status = 'pending');

-- Add a new column to track Razorpay order_id for verification
ALTER TABLE public.freelancer_payments ADD COLUMN IF NOT EXISTS razorpay_order_id text;
ALTER TABLE public.freelancer_payments ADD COLUMN IF NOT EXISTS razorpay_signature text;