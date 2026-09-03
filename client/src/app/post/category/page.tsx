import Breadcrumb from "./component/breadcrumb";
import FilterBar from "./component/filterbar";
import Card from "./component/card";

export default function ChecklistPage() {
  const breadcrumbPaths = [
    { name: "Linkup", href: "/" },
    { name: "Organizer", href: "/organizer" },
    { name: "Home", href: "/home" },
    { name: "Checklist", href: "/checklist" },
  ];

  const cards = [
    {
      title: "Advanced Email Marketing Strategies for Music and Performing Arts Events",
      category: "Event Marketing",
      image: "/images/event1.jpg",
    },
    {
      title: "New Year’s Eve Event Ideas: Your Ultimate Guide & Checklist",
      category: "Event Ideas",
      image: "/images/event2.jpg",
    },
    {
      title: "How to Plan a Christmas Party: The Eventbrite Checklist",
      category: "Event Planning",
      image: "/images/event3.jpg",
    },
  ];

  return (
    <section>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className="text-5xl font-extrabold mb-8 text-center">CHECKLIST</h1>
      <FilterBar />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <Card key={i} {...card} />
        ))}
      </div>
    </section>
  );
}
