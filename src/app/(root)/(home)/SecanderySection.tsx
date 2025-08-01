import { Button } from "@/components/Button";
import Image from "next/image";

const SecanderySection = () => {
  return (
    <section className="">
      <div className=" my-container py-20 ">
        <div className=" flex flex-col justify-center">
          <div className=" font-medium text-3xl md:text-4xl gradient-text1 text-center ">
            Japanese Head Message for Ultra Rexlation
          </div>

          <div className=" flex items-center justify-center aspect-[9/16] sm:aspect-square md:aspect-video relative rounded-md overflow-hidden mt-10">
            <Image
              src={"/assets/images/2.jpg"}
              alt="Japanese Head Message for Ultra Relaxation"
              width={500}
              height={300}
              className=" w-full h-full object-cover object-center"
            />

            <div className=" absolute bottom-0 p-5">
              <div className=" bg-background/25 backdrop-blur-sm rounded-sm flex flex-col items-center justify-center space-y-4 px-5 py-8 drop-shadow-background/25">
                <span className=" text-sm text-center">
                  Experience the profound benefits of our special Japanese head
                  massage, an ancient wellness practice designed to deeply relax
                  the mind and body This therapeutic treatment employs precise,
                  rhythmic techniques focused on the scalp, neck, and shoulders
                  to relieve tension, improve circulation, and stimulate energy
                  flow. Enhanced with warm, nourishing oils and calming
                  aromatherapy, the massage not only promotes healthier hair and
                  scalp but also eases mental fatigue and stress, leaving you
                  with a serene sense of balance and rejuvenation. Rooted in
                  centuries-old Japanese traditions, this luxurious ritual
                  offers a holistic escape that nurtures your physical
                  well-being.
                </span>

                <Button variant={"default"}>Contact for more info</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecanderySection;
