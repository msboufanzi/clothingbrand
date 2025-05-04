import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ReturnsAndRefundsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light text-center mb-8">Returns & Refunds</h1>

        <div className="prose prose-lg max-w-none">
          <p>Last updated: May 1, 2023</p>

          <h2>1. Return Policy</h2>
          <p>
            We want you to be completely satisfied with your purchase. If you are not entirely satisfied, we offer
            returns within 14 days of delivery for most items.
          </p>

          <h2>2. Return Eligibility</h2>
          <p>To be eligible for a return, your item must be:</p>
          <ul>
            <li>Unused and in the same condition that you received it</li>
            <li>In the original packaging</li>
            <li>Accompanied by the original receipt or proof of purchase</li>
          </ul>
          <p>The following items cannot be returned:</p>
          <ul>
            <li>Custom-made or personalized items</li>
            <li>Sale items (unless defective)</li>
            <li>Intimate apparel for hygiene reasons</li>
          </ul>

          <h2>3. Return Process</h2>
          <p>To initiate a return, please follow these steps:</p>
          <ol>
            <li>Contact our customer service team at returns@echaly.com to request a return authorization.</li>
            <li>Include your order number and the reason for the return in your email.</li>
            <li>Our team will provide you with return instructions and a return shipping label if applicable.</li>
            <li>Package the item securely in its original packaging if possible.</li>
            <li>Attach the return shipping label to the package.</li>
            <li>Drop off the package at the designated shipping carrier.</li>
          </ol>

          <h2>4. Refunds</h2>
          <p>
            Once we receive and inspect your return, we will notify you of the approval or rejection of your refund.
          </p>
          <p>
            If approved, your refund will be processed, and a credit will automatically be applied to your original
            method of payment within 7-14 business days, depending on your card issuer's policies.
          </p>

          <h2>5. Late or Missing Refunds</h2>
          <p>
            If you haven't received a refund yet, first check your bank account again. Then contact your credit card
            company, it may take some time before your refund is officially posted. Next, contact your bank. There is
            often some processing time before a refund is posted. If you've done all of this and you still have not
            received your refund, please contact us at returns@echaly.com.
          </p>

          <h2>6. Exchanges</h2>
          <p>
            We only replace items if they are defective or damaged. If you need to exchange it for the same item, send
            us an email at returns@echaly.com and we will guide you through the process.
          </p>

          <h2>7. Shipping Costs for Returns</h2>
          <p>
            You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are
            non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
          </p>

          <h2>8. Contact Information</h2>
          <p>If you have any questions about our returns and refunds policy, please contact us at:</p>
          <p>
            Email: returns@echaly.com
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
