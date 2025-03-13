import { createClient } from '@supabase/supabase-js';
import Cookies from 'cookies';
import Cors from 'cors';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Initialize CORS
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

// Middleware Helper
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const cookies = new Cookies(req, res);
  const userCookie = cookies.get('coupon_claimed');
  const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Check if user has already claimed a coupon in the last 1 hour
  const { data: existingClaim } = await supabase
    .from('coupons')
    .select('*')
    .eq('claimed_by_ip', userIP)
    .gt('claimed_at', new Date(Date.now() - 60 * 60 * 1000));

  if (userCookie || (existingClaim && existingClaim.length > 0)) {
    return res.status(403).json({ message: 'You can claim another coupon in 1 hour.' });
  }

  // Get an unclaimed coupon
  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .is('claimed_by_ip', null)
    .limit(1)
    .single();

  if (!coupon) return res.status(400).json({ message: 'No coupons available.' });

  // Mark coupon as claimed
  await supabase
    .from('coupons')
    .update({ claimed_by_ip: userIP, claimed_at: new Date() })
    .match({ id: coupon.id });

  // Set cookie to prevent abuse
  cookies.set('coupon_claimed', 'true', { maxAge: 60 * 60 * 1000, httpOnly: true });

  res.status(200).json({ message: 'Coupon claimed!', coupon: coupon.code });
}
