import Image from "next/image"
import { Filter, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted py-10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Shop All Products</h1>
              <p className="text-muted-foreground max-w-[700px]">
                Browse our complete collection of premium motorcycle gear and apparel.
              </p>
            </div>
          </div>
        </section>

        {/* Categories and Products */}
        <section className="py-10">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <TabsList className="h-auto flex-wrap">
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="motorcycle-gear">Motorcycle Gear</TabsTrigger>
                  <TabsTrigger value="t-shirts">T-Shirts</TabsTrigger>
                  <TabsTrigger value="suits">Suits</TabsTrigger>
                  <TabsTrigger value="stickers">Stickers</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="motorcycle-gear" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {allProducts
                    .filter((product) => product.category === "Motorcycle Gear")
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="t-shirts" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {allProducts
                    .filter((product) => product.category === "T-Shirts")
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="suits" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {allProducts
                    .filter((product) => product.category === "Suits")
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="stickers" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {allProducts
                    .filter((product) => product.category === "Stickers")
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  )
}

function ProductCard({ product }) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative h-60 bg-muted">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {product.badge && (
          <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary text-white">{product.badge}</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          <Button size="sm" variant="outline" className="gap-1">
            <ShoppingBag className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Sample data
const allProducts = [
  // Motorcycle Gear
  {
    id: 1,
    name: "Pro Racing Helmet",
    category: "Motorcycle Gear",
    price: 299.99,
    image: "/placeholder.svg?height=400&width=400",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Leather Riding Jacket",
    category: "Motorcycle Gear",
    price: 249.99,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    name: "Motorcycle Gloves",
    category: "Motorcycle Gear",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=400",
    badge: "New",
  },
  {
    id: 4,
    name: "Riding Boots",
    category: "Motorcycle Gear",
    price: 189.99,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 5,
    name: "Knee Guards",
    category: "Motorcycle Gear",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=400",
  },

  // T-Shirts
  {
    id: 6,
    name: "Classic Logo Tee",
    category: "T-Shirts",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 7,
    name: "Vintage Motorcycle Tee",
    category: "T-Shirts",
    price: 34.99,
    image: "/placeholder.svg?height=400&width=400",
    badge: "Limited",
  },
  {
    id: 8,
    name: "Racing Stripe Tee",
    category: "T-Shirts",
    price: 32.99,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 9,
    name: "Biker Culture Tee",
    category: "T-Shirts",
    price: 27.99,
    image: "/placeholder.svg?height=400&width=400",
  },

  // Suits
  {
    id: 10,
    name: "Pro Racing Suit",
    category: "Suits",
    price: 599.99,
    image: "/placeholder.svg?height=400&width=400",
    badge: "Premium",
  },
  {
    id: 11,
    name: "Leather Racing Suit",
    category: "Suits",
    price: 699.99,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 12,
    name: "Two-Piece Racing Suit",
    category: "Suits",
    price: 549.99,
    image: "/placeholder.svg?height=400&width=400",
  },

  // Stickers
  {
    id: 13,
    name: "Logo Sticker Pack",
    category: "Stickers",
    price: 9.99,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 14,
    name: "Racing Stripes Stickers",
    category: "Stickers",
    price: 7.99,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 15,
    name: "Motorcycle Silhouette Sticker",
    category: "Stickers",
    price: 5.99,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 16,
    name: "Custom Number Stickers",
    category: "Stickers",
    price: 12.99,
    image: "/placeholder.svg?height=400&width=400",
    badge: "Customizable",
  },
]

