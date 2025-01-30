import designImg from "../assets/images/design.jpeg";
const Design = () => {
  return (
    <div
      className={`relative w-full h-[350px] px-3 
        bg-black/70 bg-blend-darken `}
      style={{
        backgroundImage: `url(${designImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className=" flex flex-col gap-4 max-w-6xl mx-auto sm:pt-20 pt-16">
        <h1 className="sm:text-4xl text-2xl text-white">
          looking to beautify your house?
        </h1>
        <p className="text-white">
          contact us with your house details, if you have house to sell for us
        </p>
        <div className="flex items-center gap-6">
          <button className="bg-white py-2 px-3 rounded-full capitalize">
            see our previous work
          </button>
          <button className=" hover:bg-red-800 bg-red-600 text-white py-2 px-3 rounded-full capitalize">
            Contact us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Design;
