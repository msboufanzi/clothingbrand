import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light text-center mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none">
          <p>Last updated: May 1, 2023</p>

          <h2>1. Introduction</h2>
          <p>
            These terms and conditions govern your use of our website and the purchase of products from our online
            store. By accessing our website or placing an order, you agree to be bound by these terms and conditions.
          </p>

          <h2>2. Definitions</h2>
          <p>
            "Company", "we", "us", or "our" refers to Echaly.
            <br />
            "Website" refers to www.echaly.com.
            <br />
            "You" refers to the user or viewer of our website.
            <br />
            "Products" refers to the items offered for sale on our website.
          </p>

          <h2>3. Products and Pricing</h2>
          <p>
            All products displayed on our website are subject to availability. We reserve the right to discontinue any
            product at any time. We do not warrant that the quality of any products purchased by you will meet your
            expectations.
          </p>
          <p>
            Prices for our products are subject to change without notice. We reserve the right to modify or discontinue
            any product without notice at any time. We shall not be liable to you or to any third-party for any
            modification, price change, suspension or discontinuance of the product.
          </p>

          <h2>4. Ordering and Payment</h2>
          <p>
            When you place an order, you are making an offer to purchase the products you have selected. We reserve the
            right to refuse or cancel your order at any time for reasons including but not limited to product
            availability, errors in product or pricing information, or problems identified by our credit and fraud
            avoidance department.
          </p>
          <p>
            Payment can be made by the methods specified on our website. By submitting your payment information, you
            represent and warrant that you have the legal right to use any payment method(s) you provide.
          </p>

          <h2>5. Shipping and Delivery</h2>
          <p>
            We will make every effort to deliver products within the estimated delivery time; however, we cannot
            guarantee delivery dates. We shall not be liable for any delays in delivery.
          </p>

          <h2>6. Returns and Refunds</h2>
          <p>
            Please refer to our Returns & Refunds Policy for information about returning products and obtaining refunds.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            All content included on this website, such as text, graphics, logos, images, as well as the compilation
            thereof, and any software used on this website, is the property of Echaly or its suppliers and protected by
            copyright and intellectual property laws.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            In no event shall Echaly, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to
            or use of or inability to access or use the website or any products purchased through the website.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of Morocco, without regard to its
            conflict of law provisions.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of
            Service by posting updates and changes to our website. It is your responsibility to check our website
            periodically for changes.
          </p>

          <h2>11. Contact Information</h2>
          <p>Questions about the Terms of Service should be sent to us at info@echaly.com.</p>
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
