"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import ProductDetail from "../../../../components/products/ProductDetail";

const ViewProductPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        setError("Không thể lấy thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Không có sản phẩm</div>;
  }

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-uppercase fw-bold">Chi tiết sản phẩm</h2>
      <ProductDetail product={product} />
    </div>
  );
};

export default ViewProductPage;