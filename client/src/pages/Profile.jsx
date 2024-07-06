import { useRef, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from "../firebase"
const Profile = () => {
  let fileRef = useRef(null)
  let {currentUser} = useSelector((state) => state.user)
  let [file, setFile] = useState(undefined)
  let [filePerc, setFilePer] = useState(0)
  let [fileUploadError, setFileUploadError] = useState(false)
  let [formData, setFormData] = useState({})
  
  console.log(formData);
  console.log(filePerc);
  console.log(fileUploadError);

  useEffect(() => {
    if(file){
      handleFileUpload(file)
    }
  }, [file])

  let handleFileUpload = (file) => {
    let storage = getStorage(app)
    let fileName = new Date().getTime() + file.name
    let storageRef = ref(storage, fileName)
    let uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed', 
      (snapshot) => {
        let progress = (snapshot.bytesTransferred / 
          snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress)); 
      },
      (error) => {
        setFileUploadError(true)
      },
      ()=> {
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadUrl) => setFormData({...formData, avatar: downloadUrl})
       )
      }
    );
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
         <img onClick={()=> fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>

        <p className="text-sm self-center">
          {fileUploadError ? (<span className="text-red-700">Error Image upload(image must be less than 2 megabytes)</span> )
          : filePerc > 0 && filePerc < 100 ? (<span className="text-slate-700">{`uploading ${filePerc}%`}</span>) 
          : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded</span>
          )  : ''
          }
        </p>

         <input type="text" placeholder="username" id="username" className="border p-3 rounded-lg" />
         <input type="email" placeholder="email" id="email" className="border p-3 rounded-lg" />
         <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" />
         <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">update</button>
      </form>
      <div className="flex justify-between mt-t">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}

export default Profile