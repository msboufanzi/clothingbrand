import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light text-center mb-8">Size Guide</h1>

        <div className="prose prose-lg max-w-none mb-8">
          <p>
            Finding the perfect fit is essential for both comfort and style. Use our size guide to determine your ideal
            size for Echaly garments. If you're between sizes, we recommend sizing up for a more comfortable fit.
          </p>
          <p>All measurements are in centimeters (cm).</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-light mb-4">Women's Dresses</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>EU</TableHead>
                  <TableHead>US</TableHead>
                  <TableHead>UK</TableHead>
                  <TableHead>Bust (cm)</TableHead>
                  <TableHead>Waist (cm)</TableHead>
                  <TableHead>Hips (cm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>XS</TableCell>
                  <TableCell>34</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>6</TableCell>
                  <TableCell>82-85</TableCell>
                  <TableCell>63-66</TableCell>
                  <TableCell>89-92</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>S</TableCell>
                  <TableCell>36</TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>8</TableCell>
                  <TableCell>86-89</TableCell>
                  <TableCell>67-70</TableCell>
                  <TableCell>93-96</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>M</TableCell>
                  <TableCell>38</TableCell>
                  <TableCell>6</TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>90-93</TableCell>
                  <TableCell>71-74</TableCell>
                  <TableCell>97-100</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>L</TableCell>
                  <TableCell>40</TableCell>
                  <TableCell>8</TableCell>
                  <TableCell>12</TableCell>
                  <TableCell>94-97</TableCell>
                  <TableCell>75-78</TableCell>
                  <TableCell>101-104</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>XL</TableCell>
                  <TableCell>42</TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>14</TableCell>
                  <TableCell>98-101</TableCell>
                  <TableCell>79-82</TableCell>
                  <TableCell>105-108</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>XXL</TableCell>
                  <TableCell>44</TableCell>
                  <TableCell>12</TableCell>
                  <TableCell>16</TableCell>
                  <TableCell>102-105</TableCell>
                  <TableCell>83-87</TableCell>
                  <TableCell>109-112</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-light mb-4">How to Measure</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Bust</h3>
              <p className="text-gray-600">
                Measure around the fullest part of your bust, keeping the tape measure parallel to the floor.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Waist</h3>
              <p className="text-gray-600">
                Measure around your natural waistline, which is the narrowest part of your waist.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Hips</h3>
              <p className="text-gray-600">
                Measure around the fullest part of your hips, usually about 8 inches below your waistline.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-light mb-4">Fit Tips</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>If you're between sizes, we recommend sizing up for a more comfortable fit.</li>
            <li>
              Our evening wear tends to have a more fitted silhouette, so consider sizing up if you prefer a looser fit.
            </li>
            <li>Casual pieces are designed with a more relaxed fit.</li>
            <li>
              If you have any questions about sizing for a specific item, please contact our customer service team.
            </li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">
            Still unsure about your size? Contact our customer service team for assistance.
          </p>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
