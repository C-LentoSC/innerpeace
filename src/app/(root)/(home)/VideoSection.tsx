const VideoSection = () => {
  return (
    <section className="">
      <div className=" my-container py-20 ">
        <div className=" flex flex-col">
          <div className=" font-medium text-3xl md:text-4xl gradient-text1 text-center mb-10">
            How Things Actually Work
          </div>

          <div className=" w-full flex items-center justify-center aspect-video relative rounded-md overflow-hidden">
            <video
              controls
              className="w-full h-full object-cover object-center"
            >
              <source src="/assets/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
