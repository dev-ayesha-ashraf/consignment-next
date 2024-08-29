import React from "react";

interface IProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addressType: "pickUp" | "dropOff";
  errors: { [key: string]: string };  
}

const AddressForm = ({ handleChange, addressType, errors }: IProps) => {
  return (
    <div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
      <h2 className="text-xl font-semibold mb-4 text-center capitalize text-primary">{addressType}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["name", "place", "address", "phone", "email", "city"].map((field) => (
          <div key={field} className="flex flex-col">
            <label htmlFor={field} className="text-sm font-medium text-gray-700 capitalize">{field}</label>
            <input
              id={field}
              name={field}
              type="text"
              onChange={handleChange}
              className={`mt-1 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary`}
              style={{ minWidth: "calc(50% - 1rem)" }}
            />
            {errors[field] && ( 
              <p className="text-red-500 font-bold text-xs italic mt-1">{errors[field]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressForm;
