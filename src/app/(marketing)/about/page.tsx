import { Globe, Users, Shield, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">About Made in Uzbekistan</h1>
      <p className="mt-4 text-lg text-gray-600">
        We are a B2B marketplace connecting international buyers with verified
        manufacturers from Uzbekistan — one of Central Asia&apos;s fastest-growing
        economies.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div className="rounded-lg border p-6">
          <Globe className="h-8 w-8 text-primary" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Our Mission</h3>
          <p className="mt-2 text-sm text-gray-600">
            To bridge the gap between Uzbek manufacturers and global markets,
            making it easy for international buyers to discover, evaluate, and
            source quality products.
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <Users className="h-8 w-8 text-primary" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Who We Serve</h3>
          <p className="mt-2 text-sm text-gray-600">
            International buyers looking for competitive suppliers in textiles,
            agriculture, minerals, and more. Uzbek manufacturers seeking to
            expand their export reach.
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <Shield className="h-8 w-8 text-primary" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Trust & Quality</h3>
          <p className="mt-2 text-sm text-gray-600">
            Every manufacturer on our platform goes through a verification
            process. We moderate all product listings to ensure quality and
            accuracy.
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Why Uzbekistan?
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Uzbekistan is the world&apos;s 6th largest cotton producer, with a rapidly
            modernizing manufacturing sector, competitive pricing, and strategic
            location along the Silk Road.
          </p>
        </div>
      </div>
    </div>
  );
}
