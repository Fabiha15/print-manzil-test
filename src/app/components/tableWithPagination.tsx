"use client";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const TableWithPagination = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  //data fetching
  const { data, isLoading } = useQuery({
    queryKey: ["tableData"],
    queryFn: async () => {
      const response = await axios.get(`https://api.razzakfashion.com`);
      return response.data;
    },
  });

  //data searching
  const searchedData: any = useMutation({
    mutationFn: async () => {
      const response = await axios.get(
        `https://api.razzakfashion.com?search=${searchTerm}`
      );
      return response.data;
    },
  });

  const items = searchedData.data?.data.length > 0 ? searchedData.data : data;
  const [rowsPerPage, setRowsPerPage] = useState<number>(data?.per_page || 10);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = items?.data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(items?.data.length / rowsPerPage);
  const handlePageChange = (newPage: any) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleRangeChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  if (isLoading) return <div>Loading...</div>;
  else
    return (
      <div className="p-10 bg-gray-50 h-full w-[800px]">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700">
          Table
        </h1>
        <div className="flex items-center justify-end gap-2 mb-5">
          {" "}
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="rounded-sm p-2 border border-gray-500"
          ></input>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => searchedData.mutate()}
          >
            Search
          </button>
        </div>

        <table className="w-full table-auto border-collapse border border-gray-500 shadow-lg">
          <thead>
            <tr className="bg-blue-200 text-blue-800">
              <th className="border border-gray-500 px-8 py-4">ID</th>
              <th className="border border-gray-500 px-8 py-4">Name</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row: any, index: number) => (
              <tr
                key={index}
                className="even:bg-blue-50 odd:bg-white hover:bg-blue-100"
              >
                <td className="border border-gray-500 px-8 py-4">{row.id}</td>
                <td className="border border-gray-500 px-8 py-4">{row.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between py-8 ">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-8 py-4 border rounded-lg ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span className="text-xl">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-4">
            <span className="text-xl font-semibold">Rows per page:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={rowsPerPage}
              onChange={handleRangeChange}
            />
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-8 py-4 border rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
};

export default TableWithPagination;
