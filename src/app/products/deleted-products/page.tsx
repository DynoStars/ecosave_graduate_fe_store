"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductTable from "../../../components/products/ProductTable";

const DeletedProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzQwMTI0NDMzLCJleHAiOjE3NDAxMjgwMzMsIm5iZiI6MTc0MDEyNDQzMywianRpIjoiME5JSWtaNWNrV3BjNFExWCIsInN1YiI6IjE5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.rkQzr1TWZB34ITZm-t7o8AH0Y1HQtl9cD-vIJ7wzxdY";
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchDeletedProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/stores/products/trashed", {
        params: { page: currentPage, perPage: 10 },
      });

      if (response.data && response.data.data) {
        setProducts(response.data.data);
        setTotalProducts(response.data.total || 0);
      } else {
        setError("Định dạng phản hồi không đúng");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tải sản phẩm đã xóa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedProducts();
  }, [currentPage]);

  const handleRestore = async (productId: number) => {
    try {
      await api.post(`/stores/products/${productId}/restore`);
      fetchDeletedProducts();
    } catch (error) {
      console.error("Lỗi khi khôi phục sản phẩm:", error);
    }
  };

  const handleForceDelete = async (productId: number) => {
    try {
      await api.delete(`/stores/products/${productId}/force-delete`);
      fetchDeletedProducts();
    } catch (error) {
      console.error("Lỗi khi xóa vĩnh viễn sản phẩm:", error);
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-uppercase fw-bold">Sản phẩm đã xóa</h2>
      <ProductTable 
        products={products} 
        loading={loading} 
        error={error} 
        currentPage={currentPage} 
        totalProducts={totalProducts} 
        onPageChange={setCurrentPage} 
        currentTab="deleted"
        onRestore={handleRestore}
        onForceDelete={handleForceDelete}
      />
    </div>
  );
};

export default DeletedProductsPage;