import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import {app} from '../firebase'
import {useDispatch} from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'


const OAuth = () => {
    let navigate = useNavigate()
    let dispatch = useDispatch()

    let handleGoogleClick = async () => {
        try {
            let provider = new GoogleAuthProvider()
            let auth = getAuth(app)

            let result = await signInWithPopup(auth, provider)

            let res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
            })

            let data = await res.json()
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            console.log('could not sign in with google', error);
        }
    }
  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with google</button>
  )
}

export default OAuth