import axios from "axios";
import React from "react";
import Layout from "../../components/Layout";

const url = "https://testcrud.fikrisabriansyah.my.id/api/";

export async function getServerSideProps(context) {
  const token = context.req.cookies.token;
  const id = context.params.id
  const res = await axios.get(url + "product/show", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    params: {
      product_id: id
    }
  });
  const product = res.data.data;
  console.log(product)
  return {
    props: { product,token }, // will be passed to the page component as props
  };
}

const DetailProduct = ({ product, token }) => {
  return (
    <>
      <Layout title="Detail product" token={token}>
        <div className="flex flex-col px-6 gap-8">
          <p className="font-bold text-xl md:text-2xl lg:text-3xl">Detail Product</p>
          <div className="p-6 bg-white rounded-xl drop-shadow-md flex flex-col gap-4">
            <div className="flex gap-8">
              <p className="font-medium text-gray-600 w-1/4">Product Name</p>
              <p className="font-semibold text-gray-800">: {product.name}</p>
            </div>
            <div className="flex gap-8">
              <p className="font-medium text-gray-600 w-1/4">Price</p>
              <p className="font-semibold text-gray-800">: {product.price}</p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default DetailProduct;
