
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../component/OAuth"
import signUpImage from '../assets/images/sign-up.png'

const SignUp = () => {
    let [loading, setLoading] = useState(false)
    let [error, setError] = useState(null)
    let [formData, setFormData] = useState({});
    let navigate = useNavigate();
    let handleChange = (e) => {
      e.preventDefault()
      setFormData({
        ...formData, [e.target.id]: e.target.value
      })
    }
    let handleSubmit = async (e) => {
      e.preventDefault()

      try {
          setLoading(true)
          let res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })
        let data = await res.json()
        if(data.success === false){
          setError(data.message)
          setLoading(false)
          return;
        }
        setLoading(false)
        setError(null)
        navigate('/sign-in')
      } catch (error) {
        setLoading(false)
        setError(error.message)
      }
      
    }


  return (
    <div className='sm:px-28 px-3 py-10  mt-20 min-h-screen'>
      <div className="flex gap-10 justify-between">
      <img src={signUpImage} alt="" className="flex-1 sm:inline hidden rounded-lg w-40 h-[500px] cover/center"/>  
        <div className="flex-1">
          <h1 className='text-3xl text-[#1E2128] font-semibold my-7'>Welcome to finder</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="text" id='username' placeholder='username' className=' w-full border p-3 rounded-lg' onChange={handleChange} />
                <input type="text" id='email' placeholder='email' className='w-full border p-3 rounded-lg' onChange={handleChange}/>
                <input type="password" id='password' placeholder='password' className='w-full border p-3 rounded-lg' onChange={handleChange}/>
                <button disabled={loading} className='w-full bg-[#1E2128] p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading' : 'Sign Up'}</button>
                <OAuth/>
            </form>
            <div className="flex gap-2 mt-5 ">
                <p>Have an account</p>
                <Link to={'/sign-in'}>
                    <span className="text-blue-700">Sign in</span> 
                </Link>
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default SignUp

