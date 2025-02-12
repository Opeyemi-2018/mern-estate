import { useEffect, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { setSelectedUser } from "../redux/chatSlice";
import profile from "../assets/images/profile.png";
import { useDispatch, useSelector } from "react-redux";

const ListingsLandLordInfo = ({
  handleShowMessage,
  setCancelInfo,
  listing,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchLandlord = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        console.log("Fetched Landlord Data:", data);

        if (data?.user) {
          setLandlord(data.user);
        }
      } catch (error) {
        console.error("Error fetching landlord:", error);
      } finally {
        setLoading(false);
      }
    };

    if (listing?.userRef) {
      fetchLandlord();
    }
  }, [listing.userRef]);

  const handleSendMessage = () => {
    if (!landlord) return; // Guard clause: if landlord is not yet loaded

    dispatch(setSelectedUser(landlord)); // Dispatch the action with landlord data
    navigate("/dashboard?tab=messaging"); // Navigate to the messaging page

    handleShowMessage(); // Close the modal
    setCancelInfo(false); // Close the modal
  };

  return (
    <div className="bg-white relative rounded-md w-[500px] md:h-44 h-60 shadow-lg p-6">
      <LiaTimesSolid
        onClick={() => {
          handleShowMessage();
          setCancelInfo(false);
        }}
        className="absolute right-4 top-3 text-2xl text-white hover:bg-red-700 bg-red-600 p-1 rounded-full cursor-pointer"
      />

      {loading ? (
        <div className="flex items-center justify-center">
          <ClipLoader color="blue" size={50} loading={loading} />
        </div>
      ) : (
        <div className="flex md:flex-row flex-col md:gap-0">
          <img
            src={landlord?.image || profile}
            alt="house owner"
            className="rounded-full object-cover h-20 w-20"
          />
          <p className="md:mt-6 mt-3">
            Hi! My name is{" "}
            <span className="text-[#001030] font-semibold">
              {landlord?.username}
            </span>
            , the agent representing{" "}
            <span className="font-semibold">{listing?.name}</span>. If you’re
            interested in the property, feel free to{" "}
            <Link
              onClick={handleSendMessage}
              to="/dashboard?tab=messaging"
              className="text-blue-600 rounded-sm"
            >
              send me a message
            </Link>{" "}
            or contact me via{" "}
            <Link
              to={`mailto:${landlord?.email}?subject=Regarding ${listing?.name}`}
              className="text-blue-600 hover:opacity-80"
            >
              email
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
};

export default ListingsLandLordInfo;
