import Pagination from "react-bootstrap/Pagination";

function MessagePagination({ allMessages }) {
  const currentPageIndex = allMessages.getState().pagination.pageIndex;
  const pageCount = allMessages.getPageCount();
  //   const isSecondToLastPage = currentPageIndex === pageCount - 1;
  return (
    <>
      <div className="flex align-items-center gap-2 d-flex gap-5 justify-content-between">
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {currentPageIndex + 1} of {pageCount}
          </strong>
        </span>
        <button
          className="border rounded p-1"
          onClick={() => allMessages.setPageIndex(0)}
          disabled={!allMessages.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => allMessages.previousPage()}
          disabled={!allMessages.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => allMessages.nextPage()}
          disabled={!allMessages.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => allMessages.setPageIndex(pageCount - 1)}
          disabled={!allMessages.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={allMessages.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const inputBox = e.target.value ? Number(e.target.value) - 1 : 0;
              const lastPageIndex = pageCount - 1;
              if (inputBox >= 0 && inputBox <= lastPageIndex) {
                if (inputBox !== currentPageIndex) {
                  allMessages.setPageIndex(inputBox);
                }
              }
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          style={{ margin: "0 0 0 10px" }}
          value={allMessages.getState().pagination.pageSize}
          onChange={(e) => {
            allMessages.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default MessagePagination;
