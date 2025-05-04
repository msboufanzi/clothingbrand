import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light text-center mb-8">Shipping Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p>Last updated: May 1, 2023</p>

          <h2>1. Shipping Methods and Timeframes</h2>
          <p>At Echaly, we offer the following shipping options:</p>
          <ul>
            <li>
              <strong>Standard Shipping:</strong> 3-5 business days (Free for orders over 1000 MAD)
            </li>
            <li>
              <strong>Express Shipping:</strong> 1-2 business days (Additional fee applies)
            </li>
          </ul>
          <p>
            Please note that these timeframes are estimates and begin from the date of shipment, not the order date.
            Processing time (1-2 business days) should be added to these estimates to determine the total delivery time.
          </p>

          <h2>2. Shipping Costs</h2>
          <p>
            Shipping costs are calculated based on the delivery location, weight, and dimensions of the package. The
            exact shipping cost will be displayed during checkout before payment is made.
          </p>
          <p>We offer free standard shipping on all orders over 1000 MAD within Morocco.</p>

          <h2>3. International Shipping</h2>
          <p>
            We currently ship to select international destinations. International shipping costs and delivery times vary
            depending on the destination country. Please note that international orders may be subject to import duties
            and taxes, which are the responsibility of the recipient.
          </p>

          <h2>4. Order Tracking</h2>
          <p>
            Once your order has been shipped, you will receive a confirmation email with tracking information. You can
            use this tracking number to monitor the progress of your delivery.
          </p>

          <h2>5. Shipping Restrictions</h2>
          <p>
            Some items may be restricted from shipping to certain locations due to local regulations or shipping carrier
            limitations. If we are unable to ship an item to your location, we will notify you as soon as possible.
          </p>

          <h2>6. Delivery Issues</h2>
          <p>
            If your package is lost, damaged, or significantly delayed, please contact our customer service team at
            support@echaly.com. We will work with the shipping carrier to resolve the issue as quickly as possible.
          </p>

          <h2>7. Address Accuracy</h2>
          <p>
            It is the customer's responsibility to provide accurate shipping information. We are not responsible for
            packages that are delayed or not delivered due to incorrect address information.
          </p>

          <h2>8. Contact Information</h2>
          <p>If you have any questions about our shipping policy, please contact us at:</p>
          <p>
            Email: support@echaly.com
            <br />
            Phone: +212 5XX-XXXXXX
          </p>
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
