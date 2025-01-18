import { useEffect, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
// import Contact from "./Contact";

const ListingsLandLordInfo = ({
  handleShowMessage,
  setCancelInfo,
  listing,
}) => {
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (landlord) {
      console.log(landlord.username);
    }
  }, [landlord]);
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();

        setLandlord(data.user);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <div className="bg-white relative rounded-md w-[500px] h-44 shadow-lg p-3">
      {loading && (
        <div className="spinner  flex items-center justify-center">
          <ClipLoader color="blue" size={50} loading={loading} />
        </div>
      )}
      <LiaTimesSolid
        onClick={() => {
          handleShowMessage(), setCancelInfo(false);
        }}
        className="absolute right-4 top-3 text-2xl text-white bg-red-700 p-1 rounded-full"
      />

      {landlord ? (
        <div className="flex gap-2">
          <img
            src={landlord.avatar}
            alt="house owner image"
            className="rounded-full object-cover"
          />
          <p className="mt-6">
            Hi! my name is{" "}
            <span className="text-[#001030] font-semibold">
              {" "}
              {landlord.username}
            </span>{" "}
            the agent representing{" "}
            <span className="font-semibold">{listing.name} </span>
            If you’re interested in the property, feel free to send me a{" "}
            <Link
              to={"/dashboard?tab=messaging"}
              className=" text-blue-600 rounded-sm"
            >
              direct message
            </Link>{" "}
            or contact me via
            <Link
              to={`mailto:${landlord.email}?subject=Regarding ${listing.name}`}
              className="text-blue-600 text-center p-3  rounded-lg hover:opacity-95"
            >
              email
            </Link>
            {/* <button onClick={() => setContact(true)} className="text-blue-600">
              {" "}
              {contact && <Contact listing={listing} />} email{" "}
            </button>{" "} */}
          </p>
        </div>
      ) : (
        <p>no information about landlord</p>
      )}
    </div>
  );
};

export default ListingsLandLordInfo;
