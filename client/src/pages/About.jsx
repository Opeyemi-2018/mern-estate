import aboutImage from '../assets/images/about-image.png'
export default function About() {
  return (
    <div className='py-20 px-4 max-w-6xl mx-auto  min-h-screen'>
      <h1 className='text-3xl font-bold mb-4  text-[#001030]'>About Finder</h1>
      <p className='mb-4  text-slate-700'>Finder is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.</p>
      <p className='mb-4 text-slate-700'>
      Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.
      </p>

      <img src={aboutImage} alt="" className='rounded-lg h-64 object-cover  w-full'/>

      {/* <div className=' mt-8  text-center '>
        <h1 className='text-3xl font-semibold '>
           We can bring to life everything you've ever envisioned and dreamed of – your ideals and desires are our creations.
        </h1>
      </div> */}

      <div>
        <h1 className='text-[#001030] text-3xl text-center my-6 font-bold'>What we offer</h1>
        <div className='flex items-center md:flex-row flex-col justify-center gap-4'>
          <div className='bg-white p-8 hover:bg-[#001030] text-[#1E2128] hover:text-white transition-all duration-300 shadow-lg rounded-lg'>
            <h1 className=' sm:text-2xl text-1xl'>/01</h1>
            <h2 className='md:text-3xl  tex-2xl my-4 '>Looking for house</h2>
            <p className=''>Incorporating interior detailing introduces dimension, tactile qualities, and captivating visual elements to a room, enhancing the overall design through the addition of those final embellishments.</p>
          </div>

          <div className='bg-white p-8 hover:bg-[#001030] text-[#1E2128] hover:text-white transition-all duration-300 shadow-lg rounded-lg'>
            <h1 className=' sm:text-2xl text-1xl'>/02</h1>
            <h2 className='md:text-3xl  tex-2xl my-4 '>Apartment Finding</h2>
            <p className=''>Incorporating interior detailing introduces dimension, tactile qualities, and captivating visual elements to a room, enhancing the overall design through the addition of those final embellishments.</p>
          </div>

          <div className='bg-white p-8 hover:bg-[#001030] text-[#1E2128] hover:text-white transition-all duration-300 shadow-lg rounded-lg'>
            <h1 className=' sm:text-2xl text-1xl'>/03</h1>
            <h2 className='md:text-3xl  tex-2xl my-4 '>Interior Decoration</h2>
            <p className=''>Incorporating interior detailing introduces dimension, tactile qualities, and captivating visual elements to a room, enhancing the overall design through the addition of those final embellishments.</p>
          </div>
        </div>
      </div>      
    </div>
  )
}