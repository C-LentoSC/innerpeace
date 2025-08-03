const MapSection = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="my-container">
        {/* Map Container */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            {/* Embedded Google Map */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.276662644915!2d79.88493842392578!3d6.871107734863891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25a3d3c83c3c3%3A0x3c83c3c3c83c3c3c!2sNugegoda%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1643635654321!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title="Inner Peace Spa Location"
            />

            {/* Optional overlay with location marker (if needed) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* You can add custom markers or overlays here if needed */}
            </div>
          </div>

          {/* Optional map caption */}
          {/* <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Find us at our tranquil location in Nugegoda, Colombo
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default MapSection;
