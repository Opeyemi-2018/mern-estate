
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../component/OAuth"


const SignUp = () => {
    let [loading, setLoading] = useState(false)
    let [error, setError] = useState(null)
    let [formData, setFormData] = useState({})
    let navigate = useNavigate()
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
    <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input type="text" id='username' placeholder='username' className='border p-3 rounded-lg' onChange={handleChange} />
            <input type="text" id='email' placeholder='email' className='border p-3 rounded-lg' onChange={handleChange}/>
            <input type="password" id='password' placeholder='password' className='border p-3 rounded-lg' onChange={handleChange}/>
            <button disabled={loading} className='bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading' : 'Sign Up'}</button>
            <OAuth/>
        </form>
        <div className="flex gap-2 mt-5 justify-center">
            <p>Have an account</p>
            <Link to={'/sign-in'}>
                <span className="text-blue-700">Sign in</span> 
             </Link>
        </div>
        {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}

export default SignUp

//2:01