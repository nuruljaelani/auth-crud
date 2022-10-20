import Layout from "../components/Layout";
import {
  AiFillEdit,
  AiFillDelete,
  AiFillPlusCircle,
  AiFillWarning,
  AiFillEye,
} from "react-icons/ai";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import Router from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const url = "https://testcrud.fikrisabriansyah.my.id/api/";

const schema = yup
  .object({
    name: yup.string().required(),
    price: yup.number().required(),
  })
  .required();

export async function getServerSideProps(context) {
  const token = context.req.cookies.token;
  const row = await axios.get(url + "product", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    withCredentials: true,
  });
  const products = row.data.data;

  return {
    props: { products, token }, // will be passed to the page component as props
  };
}

export default function Home({ products, token }) {
  const [data, setData] = useState(products);
  const [globalFilter, setGlobalFilter] = useState("");
  const [modal, setModal] = useState(false);
  const [modalConfirm, setModalConfirm] = useState({
    show: false,
    id: null,
  });
  const [modalEdit, setModalEdit] = useState({
    show: false,
    id: null,
  });

  const initialState = {
    product_id: products ? products.id : "",
    name: products ? products.name : "",
    price: products ? products.price : "",
  };
  const [product, setProduct] = useState(initialState);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleChange = (e) => {
    setProduct((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit Form Insert
  const onSubmit = async (data) => {
    // e.preventDefault();
    const newProduct = await axios.post(url + "product/store", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (newProduct.data.status) {
      setModal(false);
      Router.reload();
    }
  };

  // Show Modal Confirm
  const handleDelete = async (id) => {
    setModalConfirm({ show: true, id: id });
  };

  // Handle Delete Data
  const handleDeleteTrue = async () => {
    if (modalConfirm.show && modalConfirm.id) {
      await axios.delete(url + "product/" + modalConfirm.id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      setModalConfirm({ show: false, id: null });
      Router.reload();
    }
  };

  // Show Modal Edit
  const handleEdit = async (id) => {
    setModalEdit({
      show: true,
      id: id,
    });
    const res = await axios.get(url + "product/show", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      params: {
        product_id: id,
      },
    });

    if (res.data.status) {
      setProduct({
        product_id: res.data.data.id,
        name: res.data.data.name,
        price: res.data.data.price,
      });
      setValue("name", res.data.data.name);
      setValue("price", res.data.data.price);
      setValue("product_id", res.data.data.id);
    }
  };

  // Handle Update Data
  const onSubmitUpdate = async (data) => {
    // e.preventDefault();
    const updatedProduct = await axios.post(url + "product/update", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (updatedProduct.data.status) {
      setModalEdit({
        show: false,
        id: null,
      });
      Router.reload();
    }
  };

  // Column
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor(
      (row) => {
        row.id;
      },
      {
        cell: (info) => info.row.index + 1,
        header: "No",
      }
    ),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Product Name",
    }),
    columnHelper.accessor("price", {
      cell: (info) => new Intl.NumberFormat("id").format(info.getValue()),
      header: "Price",
    }),
    columnHelper.accessor("id", {
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Link href={"/product/" + row.original.id}>
              <button
                type="button"
                className="text-blue-500 border p-1 rounded"
              >
                <AiFillEye />
              </button>
            </Link>
            <button
              type="button"
              className="text-blue-500 border p-1 rounded"
              onClick={() => handleEdit(row.original.id)}
            >
              <AiFillEdit />
            </button>
            <button
              type="button"
              className="text-red-500 border p-1 rounded"
              onClick={() => handleDelete(row.original.id)}
            >
              <AiFillDelete />
            </button>
          </div>
        );
      },
      header: "Action",
      enableGlobalFilter: false,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <>
      <Layout
        title="Product"
        modal={modal}
        setModal={() => setModal(false)}
        token={token}
      >
        <div className="flex flex-col px-6 gap-8">
          <p className="font-bold text-xl md:text-2xl lg:text-3xl">Product</p>
          <div className="p-6 bg-white rounded-xl drop-shadow-md flex flex-col gap-4">
            <div className="flex justify-between">
              <button
                className="flex gap-2 rounded-lg border bg-sky-500 p-2 text-white items-center w-fit"
                onClick={() => setModal(true)}
              >
                <AiFillPlusCircle />
                <p>Add Product</p>
              </button>
              <input
                type="text"
                className="bg-white p-2 w-1/2 rounded-md border focus:outline-none ring-1 ring-transparent focus:ring-sky-500"
                placeholder="Search"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(String(e.target.value))}
              />
            </div>
            <table className="w-full border border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-slate-100">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="text-left p-2 border">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2 border">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center gap-2">
              <button
                className="border rounded-md p-1"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </button>
              <button
                className="border rounded-md p-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </button>
              <button
                className="border rounded-md p-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </button>
              <button
                className="border rounded-md p-1"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </button>
              <span className="flex items-center gap-1">
                <div>Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                | Go to page:
                <input
                  type="number"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                  className="border p-1 rounded w-16"
                />
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="border rounded p-1"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modal Insert Data */}
        <Modal
          modal={modal}
          setModal={() => setModal(false)}
          title="Insert Product"
        >
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-4 items-center">
              <label className="w-1/3 font-medium text-gray-600">
                Product Name
              </label>
              <div className="flex flex-col w-full">
                <input
                  type="text"
                  name="name"
                  className="bg-white border rounded-md p-2 w-full ring-1 focus:ring-sky-600 focus:outline-none"
                  {...register("name")}
                />
                <p className="text-xs font-medium text-red-500">
                  {errors.name?.message}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <label className="w-1/3 font-medium text-gray-600">Price</label>
              <div className="flex flex-col w-full">
                <input
                  type="number"
                  name="price"
                  className="bg-white border rounded-md p-2 w-full ring-1 focus:ring-sky-600 focus:outline-none"
                  {...register("price")}
                />
                <p className="text-xs font-medium text-red-500">
                  {errors.price?.message}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 w-fit px-6 py-2 rounded-xl text-white font-medium"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-slate-300 hover:bg-slate-400 w-fit px-6 py-2 rounded-xl text-slate-800 font-medium"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal Edit Data */}
        <Modal
          modal={modalEdit.show}
          setModal={() => setModalEdit({ show: false, id: null })}
          title="Edit Product"
        >
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmitUpdate)}
          >
            <div className="flex gap-4 items-center">
              <label className="w-1/3 font-medium text-gray-600">
                Product Name
              </label>
              <div className="flex flex-col w-full">
                <input
                  type="text"
                  name="name"
                  className="bg-white border rounded-md p-2 w-full ring-1 focus:ring-sky-600 focus:outline-none"
                  {...register("name")}
                />
                <input
                  type="hidden"
                  name="product_id"
                  className="bg-white border rounded-md p-2 w-full ring-1 focus:ring-sky-600 focus:outline-none"
                  {...register("product_id")}
                />
                <p className="text-xs font-medium text-red-500">
                  {errors.name?.message}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <label className="w-1/3 font-medium text-gray-600">Price</label>
              <div className="flex flex-col w-full">
                <input
                  type="number"
                  name="price"
                  className="bg-white border rounded-md p-2 w-full ring-1 focus:ring-sky-600 focus:outline-none"
                  {...register("price")}
                />
                <p className="text-xs font-medium text-red-500">
                  {errors.price?.message}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 w-fit px-6 py-2 rounded-xl text-white font-medium"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-slate-300 hover:bg-slate-400 w-fit px-6 py-2 rounded-xl text-slate-800 font-medium"
                onClick={() => setModalEdit({ show: false, id: null })}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal Confirm Delete */}
        <Modal
          modal={modalConfirm.show}
          setModal={() => setModalConfirm(false)}
          title="Confirm"
        >
          <div className="flex flex-col items-center gap-4">
            <AiFillWarning className="text-yellow text-2xl lg:text-4xl xl:text-6xl" />
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
              Are you sure ?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 w-fit px-6 py-2 rounded-xl text-white font-medium"
                onClick={() => handleDeleteTrue()}
              >
                Delete
              </button>
              <button
                type="button"
                className="bg-slate-300 hover:bg-slate-400 w-fit px-6 py-2 rounded-xl text-slate-800 font-medium"
                onClick={() => setModalConfirm({ show: false })}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </Layout>
    </>
  );
}
