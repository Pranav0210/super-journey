import PinDropIcon from "@/assets/icons/pin_drop.svg?react";
import useStepperFormStore from "../store";
import { useState, useEffect, useRef } from "react";
import { getGooglePlaces } from "../api";
import { LocationPoint } from "../types";

const Step1 = () => {
  const { step1Data, setStep1Data } = useStepperFormStore();
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationPoint[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<LocationPoint[]>([]);
  const [loadingPickup, setLoadingPickup] = useState(false);
  const [loadingDrop, setLoadingDrop] = useState(false);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the store data
    setStep1Data({
      ...step1Data,
      [name]: value,
    });

    // Debounced suggestion fetch
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (name === "pickupPoint") {
        fetchSuggestions(value, setPickupSuggestions, setLoadingPickup);
      } else if (name === "dropPoint") {
        fetchSuggestions(value, setDropSuggestions, setLoadingDrop);
      }
    }, 300); // 300ms debounce
  };

  const fetchSuggestions = async (
    query: string,
    setSuggestions: React.Dispatch<React.SetStateAction<LocationPoint[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (query.trim().length > 2) {
      setLoading(true);
      try {
        const places = await getGooglePlaces(query);
        const allString = places?.predictions?.map(
          (obj: any) => {
            console.log(obj)
            return {
              name: obj.description,
              placeId: obj.place_id
            }
          },
        );
        console.log(allString);
        setSuggestions(allString); // Assuming `places` is an array of suggestions
      } catch (error) {
        console.error("Error fetching places:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (
    suggestion: LocationPoint,
    fieldName: "pickupPoint" | "dropPoint",
  ) => {
    setStep1Data({
      ...step1Data,
      [fieldName]: suggestion,
    });
    if (fieldName === "pickupPoint") setPickupSuggestions([]);
    else setDropSuggestions([]);
  };

  return (
    <div className="p-4 flex flex-col gap-y-8">
      <div className="text-left text-xl font-semibold">
        Trip Start & End location
      </div>

      {/* Pickup Point */}
      <div className="flex flex-col gap-2 relative">
        <div className="flex gap-4">
          <section className="relative flex items-center gap-2 font-semibold">
            <span className="relative rounded-full inset-0 h-6 w-6 bg-green-300 block">
              <span className="absolute rounded-full inset-0 h-4 w-4 bg-green-500 m-auto block text-white"></span>
            </span>
            <div className="absolute border-l-2 border-dashed border-textGray h-[2rem] left-3 top-6 mt-2"></div>
          </section>
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Search pickup point"
              name="pickupPoint"
              value={step1Data.pickupPoint.name}
              onChange={handleChange}
              className="w-full h-[2rem] flex-1 p-2 border-2 border-gray-300 rounded-md text-left text-xs placeholder:text-xs font-normal focus:outline-none focus:border-2 focus:border-primaryIndigo"
            />
            {pickupSuggestions.length > 0 && (
              <ul className="absolute top-full mt-2 left-0 w-full bg-white border-2 border-gray-300 rounded-md shadow-md max-h-40 overflow-auto z-10">
                {loadingPickup ? (
                  <li className="p-2 text-sm text-left text-gray-500">Loading...</li>
                ) : (
                  pickupSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 text-sm text-left hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        handleSuggestionClick(suggestion, "pickupPoint")
                      }
                    >
                      {suggestion.name}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Drop Point */}
      <div className="flex flex-col gap-2 relative">
        <div className="flex gap-4">
          <section className="relative flex items-center gap-2 font-semibold">
            <PinDropIcon className="text-brightRed" />
          </section>
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Search drop point"
              name="dropPoint"
              value={step1Data.dropPoint.name}
              onChange={handleChange}
              className="w-full h-[2rem] flex-1 p-2 border-2 border-gray-300 rounded-md text-left text-xs placeholder:text-xs font-normal focus:outline-none focus:border-2 focus:border-primaryIndigo"
            />
            {dropSuggestions.length > 0 && (
              <ul className="absolute top-full mt-2 left-0 w-full bg-white border-2 border-gray-300 rounded-md shadow-md max-h-40 overflow-auto z-10">
                {loadingDrop ? (
                  <li className="p-2 text-sm text-gray-500">Loading...</li>
                ) : (
                  dropSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 text-sm text-left hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion, "dropPoint")}
                    >
                      {suggestion.name}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
