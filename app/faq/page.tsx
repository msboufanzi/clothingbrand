import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light text-center mb-8">Frequently Asked Questions</h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-medium mb-2">1. How do I place an order?</h2>
            <p className="text-gray-600">
              You can place an order by browsing our website, selecting the items you wish to purchase, adding them to
              your cart, and proceeding to checkout. Follow the instructions to enter your shipping and payment
              information to complete your order.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-2">2. What payment methods do you accept?</h2>
            <p className="text-gray-600">
              We accept major credit cards (Visa, MasterCard), PayPal, and cash on delivery for orders within Morocco.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-2">3. How long will it take to receive my order?</h2>
            <p className="text-gray-600">
              Standard shipping within Morocco typically takes 3-5 business days. International shipping can take 7-14
              business days, depending on the destination. Please note that these are estimates and delivery times may
              vary.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-2">4. Can I track my order?</h2>
            <p className="text-gray-600">
              Yes, once your order has been shipped, you will receive a confirmation email with tracking information.
              You can use this tracking number to monitor the progress of your delivery.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-2">5. What is your return policy?</h2>
            <p className="text-gray-600">
              We accept returns within 14 days of delivery for most items. The items must be unused, in their original
              packaging, and accompanied by the original receipt. Please see our Returns & Refunds page for more
              details.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-2">6. How do I care for my Echaly garments?</h2>
            <p className="text-gray-600">
              Each garment comes with specific care instructions on the label. Generally, we recommend dry cleaning for
              most of our pieces to maintain their quality and longevity. For items that can be washed, hand washing in
              cold water and laying flat to dry is usually best.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-2">7. Do you offer international shipping?</h2>
            <p className="text-gray-600">
              Yes, we ship to select international destinations. Shipping costs and delivery times vary depending on the
              destination country. Please note that international orders may be subject to import duties and taxes,
              which are the responsibility of the recipient.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-2">8. How can I contact customer service?</h2>
            <p className="text-gray-600">
              You can contact our customer service team by email at support@echaly.com or by phone at +212 5XX-XXXXXX
              during our business hours (Monday-Friday, 9am-6pm, Saturday 10am-4pm).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-2">9. Do you offer gift wrapping?</h2>
            <p className="text-gray-600">
              Yes, we offer complimentary gift wrapping for all orders. You can select this option during checkout and
              include a personalized message if desired.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-2">10. Are your fabrics sustainably sourced?</h2>
            <p className="text-gray-600">
              We are committed to ethical and sustainable practices. We work with suppliers who share our values and are
              continuously working to improve our sustainability efforts. Many of our fabrics are sourced from
              responsible suppliers, and we prioritize quality materials that will last.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">
            Didn't find the answer you're looking for? Contact our customer service team.
          </p>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
