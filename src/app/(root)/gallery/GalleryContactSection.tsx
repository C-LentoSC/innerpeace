import Image from "next/image";

const GalleryContactSection = () => {
  return (
    <section className="py-20">
      <div className="my-container">
        <div className="flex flex-col">
          <div className=" flex flex-col md:flex-row gap-4 text-3xl md:text-4xl lg:text-5xl items-center justify-center py-10">
            <div className="text-center">Stay Connected</div>
            <div className="w-64 h-24 overflow-hidden rounded-3xl flex items-center justify-center">
              <Image
                src="/assets/images/5.png"
                alt="Tranquility"
                width={500}
                height={500}
                className=" object-cover object-center"
              />
            </div>
            <div className="text-center">With Us</div>
          </div>
          <div className="text-center md:text-lg">
            We Will Be Sharing Our Journey with Even More
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryContactSection;
