import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')!;
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!;

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Creating Razorpay order for user:', user.id);

    // Check if user already has a completed payment
    const { data: existingPayment } = await supabaseClient
      .from('freelancer_payments')
      .select('*')
      .eq('user_id', user.id)
      .eq('payment_status', 'completed')
      .single();

    if (existingPayment) {
      console.log('User already has a completed payment');
      return new Response(JSON.stringify({ error: 'Payment already completed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Razorpay order
    const orderData = {
      amount: 9900, // Amount in paise (₹99 = 9900 paise)
      currency: 'INR',
      receipt: `receipt_${user.id}_${Date.now()}`,
      notes: {
        user_id: user.id,
      },
    };

    const razorpayAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${razorpayAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error('Razorpay order creation failed:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const order = await razorpayResponse.json();
    console.log('Razorpay order created:', order.id);

    // Create or update payment record with pending status
    const { error: upsertError } = await supabaseClient
      .from('freelancer_payments')
      .upsert({
        user_id: user.id,
        amount: 99,
        currency: 'INR',
        payment_status: 'pending',
        razorpay_order_id: order.id,
        payment_method: 'razorpay',
      }, { onConflict: 'user_id' });

    if (upsertError) {
      console.error('Failed to save payment record:', upsertError);
    }

    return new Response(JSON.stringify({ 
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: razorpayKeyId,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in create-razorpay-order:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
