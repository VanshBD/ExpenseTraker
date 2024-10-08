import React, { useContext, useEffect, useState } from "react";
import { fetchExpenses, updateExpense, deleteExpenses } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import ReactPaginate from "react-paginate";

const MyExpenses = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({
    category: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getExpenses();
  }, [page]);

  const getExpenses = async () => {
    try {
      const response = await fetchExpenses({
        page: page + 1,
        limit: itemsPerPage,
      });

      if (response.expenses.length === 0 && page > 0) {
        setPage(0);
      } else {
        setExpenses(response.expenses);
        const totalItems = response.totalExpenses || 0;
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handleEditClick = (expense) => {
    setEditExpenseId(expense._id);
    setEditedData({
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      date: expense.date,
    });
  };

  const handleSaveClick = async (id) => {
    try {
      await updateExpense(id, editedData);
      getExpenses();
      setEditExpenseId(null);
    } catch (error) {
      console.error("Error updating expense", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (expenseId) => {
    setSelectedExpenses((prevSelected) => {
      if (prevSelected.includes(expenseId)) {
        return prevSelected.filter((id) => id !== expenseId);
      } else {
        return [...prevSelected, expenseId];
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedExpenses.length === 0) {
      alert("Please select at least one expense to delete.");
      return;
    }

    try {
      await deleteExpenses(selectedExpenses);
      setSelectedExpenses([]);
      getExpenses();
    } catch (error) {
      console.error("Error deleting expenses:", error);
    }
  };

  const handleSingleDelete = async (expenseId) => {
    try {
      await deleteExpenses([expenseId]);
      getExpenses();
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const startDateMatch =
      !filter.startDate || new Date(expense.date) >= new Date(filter.startDate);
    const endDateMatch =
      !filter.endDate || new Date(expense.date) <= new Date(filter.endDate);
    const categoryMatch =
      !filter.category ||
      expense.category.toLowerCase().includes(filter.category.toLowerCase());
    const paymentMethodMatch =
      !filter.paymentMethod ||
      expense.paymentMethod
        .toLowerCase()
        .includes(filter.paymentMethod.toLowerCase());
    const searchMatch =
      !searchQuery ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      startDateMatch &&
      endDateMatch &&
      categoryMatch &&
      paymentMethodMatch &&
      searchMatch
    );
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-white">
        Expenses
      </h1>

      {/* Search and Filters */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-2 border-gray-300 p-2 rounded-md w-full bg-black text-white placeholder-gray-400"
        />

        <input
          type="text"
          name="category"
          placeholder="Filter by Category"
          value={filter.category}
          onChange={handleFilterChange}
          className="border-2 border-gray-300 p-2 rounded-md w-full bg-black text-white placeholder-gray-400"
        />

      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto bg-black bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg">
        <table className="table-auto w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-white text-blck text-left">
              <th className="px-4 py-2">Select</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Payment Method</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr
                key={expense._id}
                className="border-b hover:bg-gray-50 transition duration-300 ease-in-out"
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedExpenses.includes(expense._id)}
                    onChange={() => handleCheckboxChange(expense._id)}
                  />
                </td>
                <td className="px-4 py-2">
                  {editExpenseId === expense._id ? (
                    <input
                      type="text"
                      name="description"
                      value={editedData.description}
                      onChange={handleInputChange}
                      placeholder="Description"
                      className="border p-2 rounded-md"
                    />
                  ) : (
                    expense.description
                  )}
                </td>
                <td className="px-4 py-2">
                  {editExpenseId === expense._id ? (
                    <input
                      type="number"
                      name="amount"
                      value={editedData.amount}
                      onChange={handleInputChange}
                      placeholder="Amount"
                      className="border p-2 rounded-md"
                    />
                  ) : (
                    `$${expense.amount}`
                  )}
                </td>
                <td className="px-4 py-2">
                  {editExpenseId === expense._id ? (
                    <input
                      type="text"
                      name="category"
                      value={editedData.category}
                      onChange={handleInputChange}
                      placeholder="Category"
                      className="border p-2 rounded-md"
                    />
                  ) : (
                    expense.category
                  )}
                </td>
                <td className="px-4 py-2">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{expense.paymentMethod}</td>
                <td className="px-4 py-2">
                  {editExpenseId === expense._id ? (
                    <button
                      onClick={() => handleSaveClick(expense._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(expense)}
                      className="bg-black border border-white text-white hover:bg-white hover:border-black hover:text-black px-4 py-2 rounded-md mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleSingleDelete(expense._id)}
                    className="bg-white border border-black text-black hover:bg-black hover:border-white hover:text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Delete Button */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handleBulkDelete}
          className="bg-white border border-black text-black hover:bg-black hover:border-white hover:text-white px-4 py-2 rounded-md"
        >
          Delete Selected
        </button>

        {/* Pagination */}
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"flex justify-center mt-4"}
          pageClassName={"mx-1"}
          previousClassName={"mx-1"}
          nextClassName={"mx-1"}
          activeClassName={"font-bold"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>
    </div>
  );
};

export default MyExpenses;
