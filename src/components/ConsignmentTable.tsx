import { useAuthContext } from "@/context/AuthContext";
import useConsignment from "@/hooks/useConsignment";
import useLoader from "@/hooks/useLoader";
import useGenerateFormPdf from "@/hooks/useGenerateFormPdf";
import Loader from "@/components/Loader";
import React, { useEffect, useState } from "react";

const ConsignmentTable = () => {
  const { getAll, consignments, handleChange, update } = useConsignment();
  const { user } = useAuthContext();
  const { loading, showLoader, hideLoader } = useLoader();
  const { generatePdf } = useGenerateFormPdf();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    getAll();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleUpdate = async () => {
    showLoader();
    await update();
    hideLoader();
  };

  const downloadPDF = (consignment: any) => {
    const date = new Date(consignment.createdAt);
    const formattedDate = date.toLocaleDateString();
    const day = date.toLocaleDateString(undefined, { weekday: 'long' });

    const formData = {
      pickUp: {
        name: consignment.pickUpId?.name || "N/A",
        address: consignment.pickUpId?.address || "N/A",
        phone: consignment.pickUpId?.phone || "N/A",
      },
      dropOff: {
        name: consignment.dropOffId?.name || "N/A",
        address: consignment.dropOffId?.address || "N/A",
        phone: consignment.dropOffId?.phone || "N/A",
      },
      weight: consignment.weight,
      COD: consignment.COD,
      price: consignment.price.toFixed(2),
      date: formattedDate,
      day: day,
    };
    generatePdf(formData);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center text-tertiary mb-6">
        Consignment Table
      </h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
        <thead className="bg-primary text-white">
          <tr>
            <th className="py-2 px-4 border-b text-left">#</th>
            {user?.isAdmin && (
              <th className="py-2 px-4 border-b text-left">Consignment ID</th>
            )}
            <th className="py-2 px-4 border-b text-left hidden sm:table-cell">
              Pickup
            </th>
            <th className="py-2 px-4 border-b text-left hidden sm:table-cell">
              Dropoff
            </th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {consignments.map((consignment, index) => (
            <React.Fragment key={consignment._id}>
              <tr className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-4 border-b text-center">
                  {index + 1}
                </td>
                {user?.isAdmin && (
                  <td className="py-2 px-4 border-b text-center">
                    {consignment._id}
                  </td>
                )}
                <td className="py-2 px-4 border-b hidden sm:table-cell">
                  {consignment.pickUpId?.address || "N/A"}
                </td>
                <td className="py-2 px-4 border-b hidden sm:table-cell">
                  {consignment.dropOffId?.address || "N/A"}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => toggleRow(consignment._id)}
                    className="py-2 mb-1 px-4 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-base transition duration-300 transform hover:scale-105"
                  >
                    {expandedRow === consignment._id
                      ? "Hide Details"
                      : "Show Details"}
                  </button>
                  {!user?.isAdmin && (
                    <button
                      onClick={() => downloadPDF(consignment)}
                      className="ml-2 py-2 px-4 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-base transition duration-300 transform hover:scale-105"
                    >
                      Download PDF
                    </button>
                  )}
                </td>
              </tr>
              {expandedRow === consignment._id && (
                <tr>
                  <td
                    colSpan={user?.isAdmin ? 5 : 4}
                    className="p-4 bg-gray-100 border-t"
                  >
                    <div className="block sm:flex sm:space-x-4">
                      <div className="bg-white p-4 rounded-lg shadow-md mb-4 sm:mb-0 flex-1">
                        <strong className="text-lg">Pickup Details:</strong>{" "}
                        <br />
                        <p className="text-gray-700">
                          Name: {consignment.pickUpId?.name || "N/A"} <br />
                          Address: {consignment.pickUpId?.address || "N/A"}{" "}
                          <br />
                          {user?.isAdmin && (
                            <>
                              Place: {consignment.pickUpId?.place || "N/A"}{" "}
                              <br />
                              City: {consignment.pickUpId?.city || "N/A"} <br />
                              Phone: {consignment.pickUpId?.phone || "N/A"}{" "}
                              <br />
                              Email: {consignment.pickUpId?.email || "N/A"}{" "}
                              <br />
                            </>
                          )}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-md mb-4 sm:mb-0 flex-1">
                        <strong className="text-lg">Dropoff Details:</strong>{" "}
                        <br />
                        <p className="text-gray-700">
                          Name: {consignment.dropOffId?.name || "N/A"} <br />
                          Address: {consignment.dropOffId?.address || "N/A"}{" "}
                          <br />
                          {user?.isAdmin && (
                            <>
                              Place: {consignment.dropOffId?.place || "N/A"}{" "}
                              <br />
                              City: {consignment.dropOffId?.city || "N/A"}{" "}
                              <br />
                              Phone: {consignment.dropOffId?.phone || "N/A"}{" "}
                              <br />
                              Email: {consignment.dropOffId?.email || "N/A"}{" "}
                              <br />
                            </>
                          )}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                        <strong className="text-lg">
                          Consignment Details:
                        </strong>{" "}
                        <br />
                        <p className="text-gray-700">
                          Weight: {consignment.weight} kg <br />
                          {user?.isAdmin && (
                            <>
                              Delivery Type:{" "}
                              {consignment.deliveryType || "N/A"} <br />
                              Type: {consignment.type || "N/A"} <br />
                            </>
                          )}
                          COD: {consignment.COD} <br />
                          Price: {consignment.price.toFixed(2)} <br />
                          Status: {consignment.status || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {user?.isAdmin && (
        <div className="mt-6">
          <label className="block text-lg font-semibold text-gray-800 mt-2">
            Consignment Id:
          </label>
          <input
            name="consignmentId"
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base transition duration-300 transform hover:scale-105"
          />
          <label className="block text-lg font-semibold text-gray-800 mt-4">
            Status:
          </label>
          <input
            name="status"
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base transition duration-300 transform hover:scale-105"
          />
          <button
            onClick={handleUpdate}
            className="w-full mt-4 py-3 px-6 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-lg transition duration-300 transform hover:scale-105"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      )}

      {loading && <Loader />}
    </div>
  );
};

export default ConsignmentTable;
