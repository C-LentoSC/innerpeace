import Image from "next/image";

const ReviewsSections = () => {
  return (
    <section className="">
      <div className="my-container py-20">
        <div className="flex flex-col">
          <div className="flex flex-col items-center justify-center">
            <div className=" mb-4 text-3xl md:text-4xl text-center">
              What Our
            </div>
            <div className=" flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="font-medium text-4xl md:text-5xl lg:text-6xl gradient-text1 text-center">
                Clients
              </div>
              <div className="w-64 h-24 overflow-hidden rounded-3xl flex items-center justify-center">
                <Image
                  src="/assets/images/1.jpg"
                  alt="Tranquility"
                  width={500}
                  height={500}
                  className=" object-cover object-center"
                />
              </div>
              <div className="font-medium text-4xl md:text-5xl lg:text-6xl gradient-text1 text-center">
                Says
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSections;
