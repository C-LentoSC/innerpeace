import Image from "next/image";

const PackagesSection = () => {
  return (
    <section className="">
      <div className=" my-container py-20 ">
        <div className=" flex flex-col">
          <div className=" font-medium text-3xl md:text-4xl gradient-text1 text-center mb-10">
            Our Excusive Services We Provide
          </div>

          <div className="rounded-md p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
            <Image
              src="/assets/paper-texture.jpg"
              alt="Package 01"
              width={300}
              height={200}
              className=" absolute inset-0 w-full h-full object-cover rounded-md opacity-35 -z-10"
            />
            <div>Package 01</div>

            <div>Package 01</div>

            <div>Package 01</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
