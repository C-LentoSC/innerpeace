import Image from "next/image";

const MeetOurTeamSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Dahunya Nilupika",
      title: "Founder of Inner Peace",
      experience: "10 years",
      image: "/assets/images/user.jpg",
    },
    {
      id: 2,
      name: "Dahunya Nilupika",
      title: "Founder of Inner Peace",
      experience: "10 years",
      image: "/assets/images/user2.jpg",
    },
    {
      id: 3,
      name: "Dahunya Nilupika",
      title: "Founder of Inner Peace",
      experience: "10 years",
      image: "/assets/images/user3.jpg",
    },
    {
      id: 4,
      name: "Dahunya Nilupika",
      title: "Founder of Inner Peace",
      experience: "8 years",
      image: "/assets/images/user4.jpg",
    },
    {
      id: 5,
      name: "Dahunya Nilupika",
      title: "Founder of Inner Peace",
      experience: "8 years",
      image: "/assets/images/user5.jpg",
    },
    {
      id: 6,
      name: "Dahunya Nilupika",
      title: "Founder of Inner Peace",
      experience: "8 years",
      image: "/assets/images/user6.jpg",
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="my-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium gradient-text1 mb-6">
            Meet Our Team
          </h2>
          <p className="text-sm lg:text-base max-w-4xl mx-auto leading-relaxed">
            At the heart of our sanctuary is a team of masterful therapists and
            beauty artisans, each chosen for their exceptional skill, elegance,
            and devotion to the art of wellness. With impeccable technique and a
            warm, intuitive touch, they craft every treatment into an
            unforgettable, indulgent experience - tailored just for you.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group relative overflow-hidden rounded-3xl bg-card border border-border/10 hover:border-border/30 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-forest/80 via-dark-forest/20 to-transparent" />

                {/* Member Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-lg font-medium mb-1">{member.name}</h3>
                  <p className="text-sm text-warm-gray mb-2">{member.title}</p>
                  <p className="text-sm text-forest-green">
                    {member.experience}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetOurTeamSection;
