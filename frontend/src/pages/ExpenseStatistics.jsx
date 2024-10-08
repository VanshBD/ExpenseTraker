import React, { useEffect, useState } from "react";
import { fetchExpenses } from "../api/api";
import {
  LineChart,
  PieChart,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Label,
} from "recharts";

const ExpenseStatistics = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const getAllMonths = () => [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const data = await fetchExpenses({ page: 1, limit: 10 });
        setExpenses(data.expenses || []);
        setFilteredExpenses(data.expenses || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError("Failed to fetch expenses.");
        setLoading(false);
      }
    };
    getExpenses();
  }, []);

  const filterExpenses = () => {
    let filtered = expenses;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (expense) => expense.category === selectedCategory
      );
    }
    if (selectedMonth !== "all") {
      filtered = filtered.filter((expense) => {
        const month = new Date(expense.date).toLocaleString("default", {
          month: "long",
        });
        return month === selectedMonth;
      });
    }
    setFilteredExpenses(filtered);
  };

  useEffect(() => {
    filterExpenses();
  }, [selectedCategory, selectedMonth, expenses]);

  const expenseByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categoryData = Object.entries(expenseByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  const monthlyExpenses = filteredExpenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString("default", {
      month: "long",
    });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const allMonths = getAllMonths();
  const monthlyData = allMonths.map((month) => ({
    name: month,
    total: monthlyExpenses[month] || 0,
  }));

  const COLORS = [
    "#0088FE",  // Blue
    "#00C49F",  // Green
    "#FFBB28",  // Yellow
    "#FF8042",  // Orange
    "#A569BD",  // Purple
    "#F39C12",  // Gold
    "#FF5733",  // Red (New Color)
  ];

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-4xl font-bold text-center text-white mb-12">
        Expense Statistics
      </h1>

      {/* Filters */}
      <div className="flex justify-center mb-8">
        <div className="mx-2">
          <label className="block text-white font-semibold mb-2">
            Filter by Category
          </label>
          <select
            className="p-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option className="bg-gray-800" value="all">All Categories</option>
            {Object.keys(expenseByCategory).map((category) => (
              <option className="bg-gray-800" key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-2">
          <label className="block text-white font-semibold mb-2">
            Filter by Month
          </label>
          <select
            className="p-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring focus:ring-blue-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option className="bg-gray-800" value="all">All Months</option>
            {getAllMonths().map((month) => (
              <option className="bg-gray-800" key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* Line Chart for Monthly Expenses */}
      <div className="backdrop-filter backdrop-blur-md bg-white bg-opacity-20 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Expenses Over Time (Monthly)
        </h2>
        <div className="w-full h-80">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis dataKey="name" stroke="#ffffffcc">
                  <Label value="Month" offset={-10} position="insideBottom" />
                </XAxis>
                <YAxis stroke="#ffffffcc">
                  <Label value="Total ($)" angle={-90} position="insideLeft" />
                </YAxis>
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#00C49F"
                  activeDot={{ r: 8 }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500">
              No expenses available for the selected month.
            </div>
          )}
        </div>
      </div>

      {/* Pie Chart for Category Breakdown */}
      <div className="backdrop-filter backdrop-blur-md bg-white bg-opacity-20 shadow-lg rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Expenses by Category
        </h2>
        <div className="w-full h-80">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  label
                  outerRadius={120}
                  cx="50%"
                  cy="50%"
                  animationDuration={800}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500">
              No expenses available for the selected category.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ExpenseStatistics;
