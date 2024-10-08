import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addExpense, bulkAddExpenses } from "../api/api"; // Make sure you have this function

const AddExpense = () => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    paymentMethod: "cash", // Default payment method
    date: "",
  });
  const [csvFile, setCsvFile] = useState(null); // State to store CSV file
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]); // Store the uploaded CSV file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (csvFile) {
      // If CSV file is provided, handle bulk upload
      const formData = new FormData();
      formData.append("file", csvFile);

      try {
        await bulkAddExpenses(formData); // Bulk upload via CSV
        navigate("/"); // Redirect to the MyExpenses page after successful addition
      } catch (error) {
        console.error("Error uploading CSV file:", error);
        setError("Failed to upload CSV. Please try again.");
      }
    } else {
      // Handle single expense entry
      if (!formData.amount || !formData.description || !formData.date) {
        setError("Please fill all the required fields");
        return;
      }

      try {
        await addExpense(formData);
        navigate("/"); // Redirect to the MyExpenses page after successful addition
      } catch (error) {
        console.error("Error adding expense:", error);
        setError("Failed to add expense. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto mt-8 max-w-lg">
      <div className="bg-opacity-40 backdrop-blur-lg shadow-2xl p-8 rounded-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-white">
          Add Expense
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-500 mb-4 p-2 rounded bg-red-100">
              {error}
            </p>
          )}

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full p-3 bg-black bg-opacity-40 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 bg-black bg-opacity-40 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 bg-black bg-opacity-40 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter category"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full p-3 bg-black bg-opacity-40 text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-3 bg-black bg-opacity-40 text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              For Bulk Expenses Upload CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full p-3 bg-black bg-opacity-40 text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="bg-white border text-blackfont-semibold py-3 px-6 rounded-md w-full hover:border-white hover:bg-black hover:text-white  transition duration-300 ease-in-out"
          >
            {csvFile ? "Upload CSV" : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
