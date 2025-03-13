import CouponClaimButton from '../components/CouponClaimButton';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="text-xl font-bold mb-4">Round-Robin Coupon Distribution</h1>
        <CouponClaimButton />
      </div>
    </div>
  );
}
