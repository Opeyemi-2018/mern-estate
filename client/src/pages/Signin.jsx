
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {useDispatch, useSelector} from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice"
import OAuth from "../component/OAuth"



const Signin = () => {
    let {loading, error} = useSelector((state) => state.user)
    let [formData, setFormData] = useState({})
    let navigate = useNavigate()
    let dispatch = useDispatch()
    let handleChange = (e) => {
      e.preventDefault()
      setFormData({
        ...formData, [e.target.id]: e.target.value
      })
    }
    let handleSubmit = async (e) => {
      e.preventDefault()

      try {
          dispatch(signInStart())
          let res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })
        let data = await res.json()
        if (data.success === false) {
         dispatch(signInFailure(data.message))
         return;
        }
       dispatch(signInSuccess(data))
        navigate('/')
      } catch (error) {
        dispatch(signInFailure(error.message))
      }
      
    }


  return (
    <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign in</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input type="text" id='email' placeholder='email' className='border p-3 rounded-lg' onChange={handleChange}/>
            <input type="password" id='password' placeholder='password' className='border p-3 rounded-lg' onChange={handleChange}/>
            <button disabled={loading} className='bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading' : 'Sign in'}</button>
            <OAuth/>
        </form>
        <div className="flex gap-2 mt-5 justify-center">
            <p>Dont Have an account</p>
            <Link to={'/sign-up'}>
                <span className="text-blue-700">Sign Up</span> 
             </Link>
        </div>
        {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}

export default Signin

//2:01