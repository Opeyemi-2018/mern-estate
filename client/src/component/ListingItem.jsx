import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

/**
 * ListingItem component displays individual listing information.
 * @param {Object} listing - The listing object containing details about the property.
 * @returns JSX element for rendering a listing item.
 */
export default function ListingItem({ listing }) {
  return (
    // Outer container for the listing item with styling for layout and hover effects
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-md w-full sm:w-[330px]">
      {/* Link to the detailed listing page using the listing's unique ID */}
      <Link to={`/listing/${listing._id}`}>
        {/* Listing image with a fallback URL in case imageUrls[0] is unavailable */}
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        {/* Inner container for listing details with padding and layout styling */}
        <div className="p-3 flex flex-col gap-2 w-full">
          {/* Listing name with truncation and styling */}
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          {/* Location with icon and address */}
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          {/* Description with line clamping to limit text length */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          {/* Price display, formatted based on whether there's an offer */}
          <p className="text-slate-500 mt-2 font-semibold ">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          {/* Display number of bedrooms and bathrooms */}
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
