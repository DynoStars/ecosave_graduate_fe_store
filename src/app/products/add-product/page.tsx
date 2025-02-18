"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProductForm from "../../../components/products/ProductForm";
import "../../products/product.css";

const AddProductPage: React.FC = () => {
  const router = useRouter();
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzM5NzExOTY2LCJleHAiOjE3Mzk3MTU1NjYsIm5iZiI6MTczOTcxMTk2NiwianRpIjoiUVdzYkphN25uS0hGekc2biIsInN1YiI6IjE5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.kYUc0mQaiS7YUn_FMtKmr7KIzLrw1YpwdHLn0P-VCOo";
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const handleSubmit = async (formData: any) => {
    try {
      const response = await api.post("/stores/products", formData);
      if (response.status === 201) {
        router.push("/products");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-uppercase fw-bold">Thêm mới sản phẩm</h2>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProductPage;