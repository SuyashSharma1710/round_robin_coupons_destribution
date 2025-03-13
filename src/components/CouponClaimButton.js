import { useState } from 'react';

export default function CouponClaimButton() {
  const [message, setMessage] = useState('');
  const [coupon, setCoupon] = useState(null);

  const claimCoupon = async () => {
    const response = await fetch('/api/claim_coupon', { method: 'POST' });
    const data = await response.json();

    if (response.ok) {
      setCoupon(data.coupon);
    }
    setMessage(data.message);
  };

  return (
    <div>
      <button onClick={claimCoupon} className="px-4 py-2 bg-blue-500 text-white rounded">
        Claim Coupon
      </button>
      {message && <p className="mt-2">{message}</p>}
      {coupon && <p className="mt-2 font-bold">Your Coupon: {coupon}</p>}
    </div>
  );
}
