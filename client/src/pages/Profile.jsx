import { useRef, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from "../firebase"
import { updateUserFailure, updateUserSuccess, updateUserStart, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart } from "../redux/user/userSlice"

const Profile = () => {
  let fileRef = useRef(null)
  let {currentUser, loading, error} = useSelector((state) => state.user)
  let [file, setFile] = useState(undefined)
  let [filePerc, setFilePerc] = useState(0)
  let [fileUploadError, setFileUploadError] = useState(false)
  let [formData, setFormData] = useState({})
  let [updateSuccess, setUpdateSuccess] = useState(false)
  
  let dispatch = useDispatch()
  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };


  let handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  let handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      dispatch(updateUserStart())
      let res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      let data = await res.json()
      if(data.success === false){
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  let handleDeleteUser = async () => {
    try {
      deleteUserStart()
      let res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE"
      });
      let data = await res.json()
      if(data.success === false){
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      deleteUserFailure(error.message)
    }
  }

  let handleSignOut = async () => {
    try {
     dispatch(signOutUserStart())
      let res = await fetch('/api/auth/signout')
      let data = await res.json()
      if(data.success === false){
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

         <input type="text" placeholder="username" defaultValue={currentUser.username} onChange={handleChange} id="username" className="border p-3 rounded-lg" />
         <input type="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange} id="email" className="border p-3 rounded-lg" />
         <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" />
         <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'loading...' : 'update'}</button>
      </form>
      <div className="flex justify-between mt-t">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully' : ''}</p>
    </div>
  )
}

export default Profile
