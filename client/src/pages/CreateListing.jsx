import { useState, useEffect } from "react";
import { MdOutlineDone } from "react-icons/md";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    state: "",
    apartmentType: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  useEffect(() => {
    const fetchCountry = async () => {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data = await res.json();
      const countryList = data.map((country) => ({
        name: country.name.common,
        code: country.cca2,
      }));
      setCountries(countryList);
    };
    fetchCountry();
  }, []);

  const handleStateChange = (e) => {
    setFormData({ ...formData, state: e.target.value });
  };

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
        })
        .catch((error) => {
          setUploading(false);
        });
    } else {
      toast.error("you can only upload 6 images per listing", {
        pauseOnHover: false,
        draggable: true,
      });
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return toast.error("you must upload atleast one image", {
          pauseOnHover: false,
          draggable: true,
        });
      if (+formData.regularPrice < +formData.discountPrice)
        return toast.error("discount price must be lower than regular price", {
          pauseOnHover: false,
          draggable: true,
        });
      setLoading(true);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        toast.error(data.message, {
          pauseOnHover: false,
          draggable: true,
        });
      }
      toast.success("listing successfully created!", {
        pauseOnHover: false,
        draggable: true,
      });
      setFormData({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        state: "",
        country: "",
        apartmentType: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
      });
      setFiles([]);
      // navigate(`/listing/${data._id}`);
    } catch (error) {
      toast.error(error.message, {
        pauseOnHover: false,
        draggable: true,
      });
      setLoading(false);
    }
  };
  return (
    <main className="mt-20">
      <div className="absolute left-1/2 top-5 transform -translate-y-1/2 -translate-x-1/2">
        <ToastContainer position="top-center" autoClose={5000} />
      </div>{" "}
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <div className="p-3 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg outline-none"
              id="name"
              maxLength="62"
              minLength="10"
              required
              autoComplete="off"
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg outline-none"
              id="description"
              required
              autoComplete="off"
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg outline-none"
              id="address"
              required
              autoComplete="off"
              onChange={handleChange}
              value={formData.address}
            />
            <input
              type="text"
              placeholder="state"
              className="border p-3 rounded-lg outline-none"
              id="address"
              required
              autoComplete="off"
              onChange={handleChange}
              value={formData.state}
            />
            <input
              type="text"
              placeholder="apartmentType"
              className="border p-3 rounded-lg outline-none"
              id="address"
              required
              autoComplete="off"
              onChange={handleChange}
              value={formData.apartmentType}
            />

            <div className="flex items-center justify-between gap-4">
              <select
                // onChange={handleCountryChange}
                className="py-1 px-3 rounded-md w-full border"
              >
                <option value="" disabled selected>
                  Select Country
                </option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              <select
                onChange={handleStateChange}
                className="py-1 px-3 rounded-md w-full border"
                disabled={!states.length}
              >
                <option value="" disabled selected>
                  Select State
                </option>
                {states.map((state, idx) => (
                  <option key={idx} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking spot</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p>Beds</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p>Baths</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Regular price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
              {formData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="10000000"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p>Discounted price</p>

                    {formData.type === "rent" && (
                      <span className="text-xs">($ / month)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover (max 6)
              </span>
            </p>
            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded w-full"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={handleImageSubmit}
                className="md:px-3 px-2 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? (
                  <div className="spinner  flex items-center justify-center">
                    <ClipLoader color="blue" size={50} loading={uploading} />
                  </div>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
            {/* <p className="text-red-700 text-sm">
              {imageUploadError && imageUploadError}
            </p> */}
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
            <button
              disabled={loading || uploading}
              className="p-3 bg-[#001030] text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? (
                <div className="spinner  flex items-center justify-center">
                  <ClipLoader color="blue" size={25} loading={loading} />
                </div>
              ) : (
                "Create listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
