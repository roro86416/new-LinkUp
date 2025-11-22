import FeaturedCard from "./post-component/card/FeaturedCard";
import GridCard from "./post-component/card/Gridcard";
import HorizontalCard from "./post-component/card/HorizontalCard";
import CreatorButton from "../post/post-component/ui/CreatorButton"
import FeaturedCarousel from "./post-component/card/FeaturedCarousel";



const FEATURED_ITEMS = [
  {
    image: "http://localhost:3001/uploads/slide1.jpg",
    category: "Community",
    title: "My Event Full Life: Scott Robertson",
    description: "An inside look at the story behind the scenes…",
    href: "/post/my-event",
  },
  {
    image: "http://localhost:3001/uploads/slide4.jpg", 
    category: "Tech",
    title: "The Future of Event Ticketing",
    description: "How blockchain is changing the game.",
    href: "/post/ticketing-future",
  },
  {
    image: "http://localhost:3001/uploads/file-1763002748572-179630978.webp", 
    category: "Design",
    title: "Stage Design Trends of 2025",
    description: "Visual inspiration for your next big show.",
    href: "/post/design-trends",
  },
];
export default function HomePage() {
  return (
    <div className="space-y-24">
      {/* Hero / Featured Section */}
      <section className="max-w-6xl mx-auto px-4">
        <FeaturedCarousel 
          items={FEATURED_ITEMS} // 傳入輪播資料
          interval={5000}        // 設定每 5 秒切換一次
        />
      </section>

      {/* Editor Picks Section */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Editor Picks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GridCard
            image="http://localhost:3001/uploads/file-1763002748572-179630978.webp"
            title="How Music Festivals Shape Culture"
            category="Culture"
            href="/post/detail"
          />
          <GridCard
            image="http://localhost:3001/uploads/file-1763002748572-179630978.webp"
            title="Behind the Scenes of Major Concerts"
            category="Insights"
            href="/post/editor2"
          />
          <GridCard
            image="http://localhost:3001/uploads/file-1763002748572-179630978.webp"
            title="People Making Events Better"
            category="Community"
            href="/post/editor3"
          />
        </div>
      </section>

      {/* Trending Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Trending</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GridCard
              image="http://localhost:3001/uploads/slide4.jpg"
              title="The Rise of Outdoor Experiences"
              category="Trends"
              href="/post/trend1"
            />
            <GridCard
              image="http://localhost:3001/uploads/slide4.jpg"
              title="Event Creators Who Inspire"
              category="Creators"
              href="/post/trend2"
            />
            <GridCard
              image="http://localhost:3001/uploads/slide4.jpg"
              title="Nightlife Is Changing — Here's Why"
              category="Nightlife"
              href="/post/trend3"
            />
          </div>
        </div>
      </section>

      {/* Tips & Guides */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Tips & Guides</h2>
        <div className="space-y-6">
          <HorizontalCard
            image="http://localhost:3001/uploads/file-1763376404896-842942761.jpg"
            category="Guides"
            title="10 Tips for Better Event Marketing"
            description="Boost your event visibility with simple marketing techniques."
            href="/post/guide1"
          />

          <HorizontalCard
            image="http://localhost:3001/uploads/file-1763376404896-842942761.jpg"
            category="Guides"
            title="How to Build a Returning Audience"
            description="Create loyal fans who come back to every event you host."
            href="/post/guide2"
          />
        </div>
      </section>

      {/* Community Highlight Section */}
      <section className="bg-lime-200 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-8">Community</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeaturedCard
              image="http://localhost:3001/uploads/slide4.jpg"
              title="Event Creators Bringing People Together"
              category="Community"
              href="/post/community-main"
            />

            <div className="space-y-6">
              <GridCard
                image="http://localhost:3001/uploads/file-1763088247815-714015603.jpg"
                title="Spotlight: New Voices in the Event Scene"
                category="Spotlight"
                href="/post/community1"
              />
              <GridCard
                image="http://localhost:3001/uploads/file-1763088247815-714015603.jpg"
                title="How Events Help People Connect"
                category="Connection"
                href="/post/community2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Features */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Tools & Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GridCard
            image="http://localhost:3001/uploads/file-1763088247815-714015603.jpg"
            title="How to Use Promo Codes"
            category="Tools"
            href="/post/tools1"
          />
          <GridCard
            image="http://localhost:3001/uploads/file-1763088247815-714015603.jpg"
            title="Automations to Save Time"
            category="Features"
            href="/post/tools2"
          />
          <GridCard
            image="http://localhost:3001/uploads/file-1763088247815-714015603.jpg"
            title="Best Practices for Organizers"
            category="Tips"
            href="/post/tools3"
          />
        </div>
      </section>
       <CreatorButton href="../post/backend/admin/create-post"/>
    </div>
  );
}
