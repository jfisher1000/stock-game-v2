import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";

//Import Flatepicker
import Flatpickr from "react-flatpickr";

import { Table, Row, Col, Button, InputGroup, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";
import { Link } from "react-router-dom";

interface GlobalFilterProps {
  preGlobalFilteredRows: any;
  globalFilter?: any;
  setGlobalFilter: any;
}

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: GlobalFilterProps) {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value: any) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Col sm={4}>
      <div className="search-box mb-0 d-inline-block">
        <div className="position-relative">

          <label htmlFor="search-bar-0" className="search-label">
            <span id="search-bar-0-label" className="sr-only">
              Search this table
            </span>
            <input
              onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value);
              }}
              id="search-bar-0"
              type="text"
              className="form-control font-size-13"
              // placeholder={`${count} records...`}
              value={value || ""}
            />
          </label>
        </div>
      </div>
    </Col>
  );
}

interface TableContainerProps {
  columns: any;
  data: any;
  isGlobalFilter?: any;
  isAddOptions?: any;
  isAddUserList?: any;
  isAddInvoiceList?: any;
  handleOrderClicks?: any;
  handleUserClick?: any;
  handleCustomerClick?: any;
  isAddCustList?: any;
  customPageSize: any;
  className?: any;
  handleInvoiceClick?: any;
  theadClass?: any;
  isBordered?: boolean;
}

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isAddOptions,
  // isAddUserList,
  isAddInvoiceList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  customPageSize,
  className,
  handleInvoiceClick,
  theadClass,
  isBordered,
}: TableContainerProps) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        sortBy: [
          {
            desc: true,
            // asce: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const generateSortingIndicator = (column: any) => {
    return column.isSorted ? (column.isSortedDesc ? <span>&#9650;</span> : <span>&#9660;</span>) : "";
  };

  const onChangeInSelect = (event: any) => {
    setPageSize(Number(event.target.value));
  };

  const onChangeInInput = (event: any) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };
  return (
    <Fragment>
      <>
        {isAddInvoiceList && (
          <Row>
            <div className="col-sm">
              <div className="mb-4">
                <button
                  onClick={handleInvoiceClick}
                  type="button"
                  className="btn btn-light waves-effect waves-light"
                >
                  <i className="bx bx-plus me-1"></i> Add Invoice
                </button>
              </div>
            </div>
            <div className="col-sm-auto">
              <div className="d-flex align-items-center gap-1 mb-4">
                <InputGroup className="datepicker-range">
                  <Flatpickr
                    className="form-control d-block"
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                  <button className="input-group-text" id="date1"><i className="bx bx-calendar-event"></i></button>
                </InputGroup>
                <UncontrolledDropdown >
                  <DropdownToggle className="btn btn-link text-muted py-1 font-size-16 shadow-none dropdown-toggle" tag="a">
                    <i className="bx bx-dots-horizontal-rounded"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem>Action</DropdownItem>
                    <DropdownItem>Another action</DropdownItem>
                    <DropdownItem>Something else here</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </div>
          </Row>
        )}
        <Row>
          <Col sm={12} md={6}>
            <label className="d-flex">
              <span className="pt-1 fw-normal">Show</span>
              <Col lg={1} className="ms-1 me-1">
                <select
                  className="custom-select me-2 pe-3 custom-select-sm form-control form-control-sm form-select form-select-sm"
                  value={pageSize}
                  onChange={onChangeInSelect}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {" "}{pageSize}
                    </option>
                  ))}
                </select>
              </Col> <span className="pt-1 fw-normal">entries</span>
            </label>
          </Col>
          {isGlobalFilter && (
            <Col sm={12} md={6}>
              <label className="d-flex justify-content-end fw-normal">
                <span className="pt-2 me-2">Search:</span>  <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </label>
            </Col>
          )}
        </Row>
        {isAddOptions && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col sm="12">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" />
                New Customers
              </Button>
            </div>
          </Col>
        )}
      </>

      <div className="table-responsive">
        <Table hover {...getTableProps()} className={className} bordered={isBordered}>
          <thead>
            {headerGroups.map((headerGroup: { getHeaderGroupProps: () => { [x: string]: any; id: any; }; headers: any[]; }) => {
              const { id, ...headerGroupProps } = headerGroup.getHeaderGroupProps(); // Destructure to get id and the rest of the props
              return (
                <tr key={id} {...headerGroupProps}> {/* Pass key directly */}
                  {headerGroup.headers.map((column) => (
                    <th key={column.id}>
                      {column.render('Header')}
                      {/* Render the columns filter UI */}
                      <div>{column.canFilter ? column.render('Filter') : null}</div>
                    </th>
                  ))}
                </tr>
              );
            })}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row: { cells: any[]; }, idx: React.Key | null | undefined) => {
              prepareRow(row);
              return (
                <Fragment key={idx}>
                  <tr>
                    {row.cells.map((cell, index) => {
                      const { key, ...restCellProps } = cell.getCellProps();
                      return (
                        <td key={key} {...restCellProps}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>

      <Row className="align-items-center g-3 text-center text-sm-start">
        <div className="col-sm">
          <div>Showing<span className="fw-normal ms-1">{page.length}</span> of <span className="fw-normal">{data.length}</span> Results
          </div>
        </div>
        <div className="col-sm-auto">
          <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
            <li className={!canPreviousPage ? "page-item disabled" : "page-item"}>
              <Link to="#" className="page-link" onClick={previousPage}>Previous</Link>
            </li>
            {pageOptions.map((item: any, key: number) => (
              <React.Fragment key={key}>
                <li className="page-item">
                  <Link to="#" className={pageIndex === item ? "page-link active" : "page-link"} onClick={() => gotoPage(item)}>{item + 1}</Link>
                </li>
              </React.Fragment>
            ))}
            <li className={!canNextPage ? "page-item disabled" : "page-item"}>
              <Link to="#" className="page-link" onClick={nextPage}>Next</Link>
            </li>
          </ul>
        </div>
      </Row>

    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
