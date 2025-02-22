"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "../../../../components/products/ProductForm";

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzQwMTI0NDMzLCJleHAiOjE3NDAxMjgwMzMsIm5iZiI6MTc0MDEyNDQzMywianRpIjoiME5JSWtaNWNrV3BjNFExWCIsInN1YiI6IjE5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.rkQzr1TWZB34ITZm-t7o8AH0Y1HQtl9cD-vIJ7wzxdY";
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/stores/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (formData: any) => {
    try {
      const response = await api.put(`/stores/products/${id}`, formData);
      if (response.status === 200) {
        router.push("/products");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-uppercase fw-bold">Chỉnh sửa sản phẩm</h2>
      <ProductForm onSubmit={handleSubmit} initialData={product} />
    </div>
  );
};

export default EditProductPage;