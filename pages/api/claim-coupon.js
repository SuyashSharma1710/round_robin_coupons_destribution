import { createClient } from '@supabase/supabase-js';
import Cookies from 'cookies';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const cookies = new Cookies(req, res);
  const userCookie = cookies.get('coupon_claimed');
  const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Check if user already claimed a coupon (via cookie or IP)
  const { data: existingClaim } = await supabase
    .from('coupons')
    .select('*')
    .eq('claimed_by_ip', userIP)
    .gt('claimed_at', new Date(Date.now() - 60 * 60 * 1000)); // 1-hour restriction

  if (userCookie || existingClaim.length > 0) {
    return res.status(403).json({ message: 'You can claim another coupon in 1 hour.' });
  }

  // Fetch an unclaimed coupon
  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .is('claimed_by_ip', null)
    .limit(1)
    .single();

  if (!coupon) return res.status(400).json({ message: 'No coupons available.' });

  // Assign coupon to the user
  await supabase
    .from('coupons')
    .update({ claimed_by_ip: userIP, claimed_at: new Date() })
    .match({ id: coupon.id });

  // Set cookie for tracking
  cookies.set('coupon_claimed', 'true', { maxAge: 60 * 60 * 1000, httpOnly: true });

  res.status(200).json({ message: 'Coupon claimed!', coupon: coupon.code });
}
