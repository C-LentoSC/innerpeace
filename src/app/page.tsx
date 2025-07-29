const page = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-warm-gold mb-8 text-center">
          InnerPeace
        </h1>
        <h2 className="text-3xl font-semibold text-sage-green mb-6">
          Find Your Inner Peace
        </h2>
        <p className="text-lg text-foreground mb-8 leading-relaxed">
          Welcome to InnerPeace, a sanctuary for your mind and soul. Our
          beautiful Playfair Display typography creates an elegant and calming
          experience as you journey towards tranquility and self-discovery.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-accent mb-3">
              Meditation
            </h3>
            <p className="text-muted-foreground">
              Discover the power of mindfulness and meditation practices.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-secondary mb-3">
              Wellness
            </h3>
            <p className="text-muted-foreground">
              Explore holistic approaches to mental and physical wellbeing.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-bright-orange mb-3">
              Community
            </h3>
            <p className="text-muted-foreground">
              Connect with like-minded individuals on their peace journey.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="bg-primary hover:bg-sage-green text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors">
            Begin Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
