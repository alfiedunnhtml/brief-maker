import { CalendarDays, Heart, Home, LogOut, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function BriefMaker() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-primary">Brief Maker</h1>
        </div>
        <nav className="px-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Heart className="mr-2 h-4 w-4" />
            Liked Briefs
          </Button>
          <Separator className="my-4" />
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            My Account
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="grid gap-6 grid-cols-12">
            {/* Brief Section */}
            <Card className="col-span-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Badge variant="secondary">Skincare Retail</Badge>
                      <Badge variant="outline">Medium</Badge>
                    </div>
                    <CardTitle>Project Brief</CardTitle>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Generated on 01/02/2025
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    <section>
                      <h3 className="font-semibold mb-2">Company Overview</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Healthy Glow Skincare is a skincare business that focuses on organic and cruelty-free products.
                        We are looking to build a website that will serve as an online storefront for our product range,
                        while also providing information and education about our brand and ethical sourcing practices.
                      </p>
                    </section>

                    <section>
                      <h3 className="font-semibold mb-2">Design Requirements</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        The design needs to reflect our brand's ethos of natural beauty and sustainability. We want a
                        clean, minimalist design with an earthy color palette. The website should be easy to navigate,
                        with clear categories for different product types and pages for About us, Contact, Blog, and
                        FAQs. We need a product gallery with high-quality images and detailed product descriptions. It's
                        also essential that the website is mobile-friendly, as a significant portion of our customers
                        shop from their phones.
                      </p>
                    </section>

                    <section>
                      <h3 className="font-semibold mb-2">Functionality Requirements</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        The website should have a cart feature and an easy-to-use checkout process. We want to integrate
                        customer reviews on product pages and a newsletter sign-up form in the footer.
                      </p>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Middle Column - Deliverables & Brief Details */}
            <div className="col-span-3 space-y-6 flex flex-col">
              {/* Deliverables Card */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Deliverables</CardTitle>
                  <p className="text-sm text-muted-foreground">Key requirements and features</p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px] pr-4">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Required Pages</h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li>• Homepage with featured products</li>
                          <li>• Product catalog/shop page</li>
                          <li>• Individual product pages</li>
                          <li>• About Us page</li>
                          <li>• Contact page</li>
                          <li>• Blog section</li>
                          <li>• FAQ page</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Features</h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li>• Shopping cart system</li>
                          <li>• Secure checkout process</li>
                          <li>• Customer account portal</li>
                          <li>• Product filtering and search</li>
                          <li>• Newsletter signup</li>
                          <li>• Customer reviews system</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Technical Requirements</h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li>• Mobile responsive design</li>
                          <li>• SEO optimization</li>
                          <li>• SSL certification</li>
                          <li>• Payment gateway integration</li>
                          <li>• Analytics integration</li>
                        </ul>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Brief Details Card */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Brief Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px] pr-4">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Company Details</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium">Company Name</span>
                            <p className="text-sm text-muted-foreground">Healthy Glow Skincare</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Industry</span>
                            <p className="text-sm text-muted-foreground">Skincare Retail</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Project Size</span>
                            <p className="text-sm text-muted-foreground">Medium</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-3">Brand Colors</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <div className="h-12 w-full rounded-md bg-[#8B7355] border"></div>
                            <p className="text-xs text-center text-muted-foreground">#8B7355</p>
                          </div>
                          <div className="space-y-1">
                            <div className="h-12 w-full rounded-md bg-[#D4C4B7] border"></div>
                            <p className="text-xs text-center text-muted-foreground">#D4C4B7</p>
                          </div>
                          <div className="space-y-1">
                            <div className="h-12 w-full rounded-md bg-[#F4EBE4] border"></div>
                            <p className="text-xs text-center text-muted-foreground">#F4EBE4</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Target Launch Date</h4>
                        <p className="text-sm text-muted-foreground">March 15, 2025</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Budget Range</h4>
                        <p className="text-sm text-muted-foreground">$15,000 - $20,000</p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Comments Section - Full Height */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">Comments</CardTitle>
                <p className="text-sm text-muted-foreground">Discuss this brief</p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <p className="text-sm text-muted-foreground italic">Comments coming soon...</p>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

