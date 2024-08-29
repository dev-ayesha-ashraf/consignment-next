// components/ConsignmentForm.tsx
import React, { useState } from "react";
import AddressForm from "./AddressForm";
import useAddress from "@/hooks/useAddress";
import useConsignment, { ConsignmentDelivery, ConsignmentType } from "@/hooks/useConsignment";
import useGenerateFormPdf from "@/hooks/useGenerateFormPdf";
import useLoader from "@/hooks/useLoader";
import Loader from "./Loader";

const ConsignmentForm = () => {
  const { handleChange: handleChangePickUp, address: pickUp } = useAddress();
  const { handleChange: handleChangePickDropOff, address: dropOff } = useAddress();
  const { create } = useConsignment();
  const { loading, showLoader, hideLoader } = useLoader();
  const { generatePdf } = useGenerateFormPdf();
  const [weight, setWeight] = useState("");
  const [deliveryType] = useState(ConsignmentDelivery.SAME_DAY);
  const [consignmentType] = useState(ConsignmentType.LOCAL);
  const [COD, setCOD] = useState("");

  const [errors, setErrors] = useState({
    pickUp: {},
    dropOff: {},
    weight: "",
    COD: "",
  });

  const validate = () => {
    const newErrors = {
      pickUp: {},
      dropOff: {},
      weight: "",
      COD: "",
    };

    for (const field of ["name", "place", "address", "phone", "email", "city"]) {
      const value = pickUp[field] || "";
      if (field === "name" && value.trim().length < 3) {
        newErrors.pickUp.name = "Name must be at least 3 characters long.";
      } else if (field === "place" && value.trim().length === 0) {
        newErrors.pickUp.place = "Place cannot be empty.";
      } else if (field === "address" && value.trim().length === 0) {
        newErrors.pickUp.address = "Address cannot be empty.";
      } else if (field === "phone" && !/^\d{11}$/.test(value)) {
        newErrors.pickUp.phone = "Phone number must be exactly 11 digits.";
      } else if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.pickUp.email = "Email address is invalid.";
      } else {
        newErrors.pickUp[field] = "";
      }
    }
    for (const field of ["name", "place", "address", "phone", "email", "city"]) {
      const value = dropOff[field] || "";
      if (field === "name" && value.trim().length < 3) {
        newErrors.dropOff.name = "Name must be at least 3 characters long.";
      } else if (field === "place" && value.trim().length === 0) {
        newErrors.dropOff.place = "Place cannot be empty.";
      } else if (field === "address" && value.trim().length === 0) {
        newErrors.dropOff.address = "Address cannot be empty.";
      } else if (field === "phone" && !/^\d{11}$/.test(value)) {
        newErrors.dropOff.phone = "Phone number must be exactly 11 digits.";
      } else if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.dropOff.email = "Email address is invalid.";
      } else {
        newErrors.dropOff[field] = "";
      }
    }

    // Validate weight
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      newErrors.weight = "Weight should be a valid number greater than 0.";
    } else {
      newErrors.weight = "";
    }

    setErrors(newErrors);
    return Object.values(newErrors.pickUp).every(error => error === "") &&
           Object.values(newErrors.dropOff).every(error => error === "") &&
           newErrors.weight === "" &&
           newErrors.COD === "";
  };

  const onCreateConsignment = async () => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString(); 
    const day = date.toLocaleDateString(undefined, { weekday: 'long' }); 
    if (validate()) {
      showLoader(); 
      try {
        await create({
          pickUp,
          dropOff,
          weight: weight ? Number(weight) : undefined,
          deliveryType,
          type: consignmentType,
          COD: COD ? Number(COD) : undefined,
          date: formattedDate, 
          day: day, 
        });
        generatePdf({
          pickUp,
          dropOff,
          weight: weight ? Number(weight) : undefined,
          deliveryType,
          consignmentType,
          COD: COD ? Number(COD) : undefined,
          date: formattedDate,
          day: day, 
        });
      } catch (error) {
        console.error("Error creating consignment:", error);
      } finally {
        hideLoader(); 
      }
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md relative">
      {loading && <Loader />}
      <h1 className="text-2xl font-bold text-center text-tertiary mb-6">Consignment Form</h1>
      <div className="space-y-6">
        <AddressForm
          handleChange={handleChangePickUp}
          addressType="pickUp"
          errors={errors.pickUp}
        />
        <AddressForm
          handleChange={handleChangePickDropOff}
          addressType="dropOff"
          errors={errors.dropOff}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="weight" className="text-sm font-medium text-gray-700">Weight</label>
            <input
              id="weight"
              name="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={`mt-1 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary ${errors.weight ? 'border-red-500' : ''}`}
            />
            {errors.weight && (
              <p className="text-red-500 text-xs font-bold italic mt-1">{errors.weight}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="deliveryType" className="text-sm font-medium text-gray-700">Delivery Type</label>
            <select
              id="deliveryType"
              name="deliveryType"
              value={deliveryType}
              disabled
              className="mt-1 p-2 border rounded-lg w-full bg-gray-200 text-gray-500 cursor-not-allowed"
            >
              <option value={ConsignmentDelivery.SAME_DAY}>Same Day</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="type" className="text-sm font-medium text-gray-700">Consignment Type</label>
            <select
              id="type"
              name="type"
              value={consignmentType}
              disabled
              className="mt-1 p-2 border rounded-lg w-full bg-gray-200 text-gray-500 cursor-not-allowed"
            >
              <option value={ConsignmentType.LOCAL}>Local</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="COD" className="text-sm font-medium text-gray-700">COD</label>
            <input
              id="COD"
              name="COD"
              type="number"
              value={COD}
              onChange={(e) => setCOD(e.target.value)}
              className={`mt-1 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary ${errors.COD ? 'border-red-500' : ''}`}
            />
          </div>
        </div>
        <button
          onClick={onCreateConsignment}
          disabled={loading} 
          className={`mt-6 w-full py-3 px-6 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary'} text-white font-bold rounded-lg shadow-md hover:${loading ? 'bg-gray-400' : 'bg-tertiary'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-lg transition duration-300 transform hover:scale-105`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ConsignmentForm;
