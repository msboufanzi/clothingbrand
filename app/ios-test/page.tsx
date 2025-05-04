import { IOSProducts } from "@/components/ios-products"

export const metadata = {
  title: "iOS Compatibility Test",
}

export default function IOSTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">iOS Compatibility Test</h1>
      <p className="mb-6">This page is specifically optimized for iOS Safari and Chrome.</p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <IOSProducts />
      </div>

      <div className="p-4 bg-gray-100 rounded mb-8">
        <h3 className="font-medium mb-2">Device Information</h3>
        <div id="device-info" className="text-sm">
          Loading device info...
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const info = document.getElementById('device-info');
            if (info) {
              info.innerHTML = 'User Agent: ' + navigator.userAgent;
            }
          });
        `,
        }}
      />
    </div>
  )
}
