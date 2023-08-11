// import React from "react";
// import Searching from "./Searching/Searching";

// export const AdminColumnFilter = ({ column, allMessages }) => {
//   const firstValue = allMessages
//     .getPreFilteredRowModel()
//     .flatRows[0]?.getValue(column.id);

//   const columnFilterValue = column.getFilterValue();

//   const sortedUniqueValues = (() => {
//     if (typeof firstValue === "number") {
//       return [];
//     } else {
//       const uniqueValuesMap = column.getFacetedUniqueValues();
//       const keys = Array.from(uniqueValuesMap.keys());
//       return keys.sort();
//     }
//   })();

//   return (
//     <>
//       <>
//         <datalist id={column.id + "list"}>
//           {sortedUniqueValues.slice(0, 5000).map((value) => (
//             <option value={value} key={value} />
//           ))}
//         </datalist>
//         <Searching
//           type="text"
//           value={columnFilterValue ?? ""}
//           onChange={(value) => column.setFilterValue(value)}
//           placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
//           className="w-36 border shadow rounded"
//           list={column.id + "list"}
//         />
//       </>
//     </>
//   );
// };
