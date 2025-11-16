import FeaturedCard from "../post-component/card/FeaturedCard";
import GridCard from "../post-component/card/Gridcard";
import HorizontalCard from "../post-component/card/HorizontalCard";

export default function HomePage() {
  return (
    <div className="space-y-24">
      {/* Hero / Featured Section */}
      <section className="max-w-6xl mx-auto px-4">
        <FeaturedCard
          image="/images/hero.jpg"
          category="Community"
          title="My Event Full Life: Scott Robertson"
          description="An inside look at the story behind the scenes…"
          href="/post/my-event"
        />
      </section>

      {/* Editor Picks Section */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Editor Picks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GridCard
            image="/images/editor1.jpg"
            title="How Music Festivals Shape Culture"
            category="Culture"
            href="/post/editor1"
          />
          <GridCard
            image="/images/editor2.jpg"
            title="Behind the Scenes of Major Concerts"
            category="Insights"
            href="/post/editor2"
          />
          <GridCard
            image="/images/editor3.jpg"
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
              image="/images/trend1.jpg"
              title="The Rise of Outdoor Experiences"
              category="Trends"
              href="/post/trend1"
            />
            <GridCard
              image="/images/trend2.jpg"
              title="Event Creators Who Inspire"
              category="Creators"
              href="/post/trend2"
            />
            <GridCard
              image="/images/trend3.jpg"
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
            image="/images/guide1.jpg"
            category="Guides"
            title="10 Tips for Better Event Marketing"
            description="Boost your event visibility with simple marketing techniques."
            href="/post/guide1"
          />

          <HorizontalCard
            image="/images/guide2.jpg"
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
              image="/images/community-big.jpg"
              title="Event Creators Bringing People Together"
              category="Community"
              href="/post/community-main"
            />

            <div className="space-y-6">
              <GridCard
                image="/images/community1.jpg"
                title="Spotlight: New Voices in the Event Scene"
                category="Spotlight"
                href="/post/community1"
              />
              <GridCard
                image="/images/community2.jpg"
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
            image="/images/tools1.jpg"
            title="How to Use Promo Codes"
            category="Tools"
            href="/post/tools1"
          />
          <GridCard
            image="/images/tools2.jpg"
            title="Automations to Save Time"
            category="Features"
            href="/post/tools2"
          />
          <GridCard
            image="/images/tools3.jpg"
            title="Best Practices for Organizers"
            category="Tips"
            href="/post/tools3"
          />
        </div>
      </section>
    </div>
  );
}
