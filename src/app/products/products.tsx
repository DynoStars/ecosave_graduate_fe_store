"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../products/product.css";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  original_price: number;
  discount_percent: number;
  discounted_price: number;
  product_type: string;
  expiration_date: string;
  stock_quantity: number;
  store_id: number;
  category_id: number;
  category: { id: number; name: string };
  store: { id: number; name: string };
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentTab, setCurrentTab] = useState<"active" | "deleted">("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeProductId, setActiveProductId] = useState<number | null>(null);

  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzM5NzExOTY2LCJleHAiOjE3Mzk3MTU1NjYsIm5iZiI6MTczOTcxMTk2NiwianRpIjoiUVdzYkphN25uS0hGekc2biIsInN1YiI6IjE5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.kYUc0mQaiS7YUn_FMtKmr7KIzLrw1YpwdHLn0P-VCOo";
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const endpoint =
        currentTab === "deleted" ? `/stores/products/trashed` : `/stores/products`;
      const response = await api.get(endpoint, {
        params: { page: currentPage, perPage: 10 },
      });

      if (response.data && response.data.data) {
        setProducts(response.data.data);
        setTotalProducts(response.data.total || 0);
      } else {
        setError("Định dạng phản hồi không đúng");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentTab, currentPage]);

  const handleTabChange = (tab: "active" | "deleted") => {
    setCurrentTab(tab);
    setCurrentPage(1);
  };

  const toggleMenu = (productId: number) => {
    if (activeProductId === productId) {
      setIsMenuOpen(!isMenuOpen);
    } else {
      setActiveProductId(productId);
      setIsMenuOpen(true);
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await api.delete(`/stores/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handleRestore = async (productId: number) => {
    try {
      await api.post(`/stores/products/${productId}/restore`);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi khôi phục sản phẩm:", error);
    }
  };

  const handleForceDelete = async (productId: number) => {
    try {
      await api.delete(`/stores/products/${productId}/force-delete`);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa vĩnh viễn sản phẩm:", error);
    }
  };

  return (
    <div className="product-container container-fluid py-4">
      <h2 className="mb-4 text-uppercase fw-bold">Đăng bán sản phẩm</h2>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <ul className="nav nav-tabs border-0">
          <li className="nav-item">
            <button 
              className={`nav-link border-0 ${currentTab === "active" ? "active" : ""}`} 
              onClick={() => handleTabChange("active")}
            >
              Đã đăng bán
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link border-0 ${currentTab === "deleted" ? "active" : ""}`} 
              onClick={() => handleTabChange("deleted")}
            >
              Đã xóa
            </button>
          </li>
        </ul>
        <div className="total-products">
          Tổng số sản phẩm: {totalProducts}
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="input-group search-container">
            <span className="input-group-text bg-transparent border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Tìm kiếm sản phẩm"
            />
          </div>
        </div>
        <div className="col-md-8 text-end">
          <Link href="/products/add-product" className="btn btn-primary add-product-btn">
            THÊM MỚI SẢN PHẨM
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col" className="ps-4">STT</th>
                <th scope="col">TÊN SẢN PHẨM</th>
                <th scope="col">TRẠNG THÁI</th>
                <th scope="col">GIÁ</th>
                <th scope="col">NGÀY HẾT HẠN</th>
                <th scope="col">LOẠI</th>
                <th scope="col">MÔ TẢ</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className="align-middle">
                  <td className="ps-4">{(currentPage - 1) * 10 + index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="product-image-container me-3">
                        <img src="https://nutifood.com.vn/files/products/Bao-bi-moi/Nutimilk/nutimilk-stts-pack-3hop.png" alt={product.name} className="product-image" />
                      </div>
                      <div>
                        <div className="product-name">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="status-badge active">
                      <span className="status-dot"></span>
                      Active
                    </span>
                    <div className="status-label">Đang được bán</div>
                  </td>
                  <td>
                    <div className="product-price">{product.original_price.toLocaleString()} vnd</div>
                  </td>
                  <td>
                    <div className="expiration-badge paid">
                      <span className="paid-dot"></span>
                      Paid
                    </div>
                    <div className="expiration-date">{product.expiration_date}</div>
                  </td>
                  <td>
                    <div className="product-type">{product.product_type}</div>
                  </td>
                  <td>
                    <div className="product-description">{product.description}</div>
                  </td>
                  <td className="text-end position-relative">
                    <button 
                      className="btn btn-light btn-sm action-btn"
                      onClick={() => toggleMenu(product.id)}
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    
                    {isMenuOpen && activeProductId === product.id && (
                      <div className="action-menu">
                        {currentTab === "active" ? (
                          <>
                            <Link href={`/products/edit-product/${product.id}`} className="action-item">
                              <span className="action-icon edit"></span>
                              Chỉnh sửa
                            </Link>
                            <button className="action-item" onClick={() => handleDelete(product.id)}>
                              <span className="action-icon delete"></span>
                              Xóa
                            </button>
                            <Link href={`/products/view-product/${product.id}`} className="action-item">
                              <span className="action-icon view"></span>
                              Xem chi tiết
                            </Link>
                          </>
                        ) : (
                          <>
                            <button className="action-item" onClick={() => handleRestore(product.id)}>
                              <span className="action-icon restore"></span>
                              Khôi phục
                            </button>
                            <button className="action-item" onClick={() => handleForceDelete(product.id)}>
                              <span className="action-icon delete"></span>
                              Xóa vĩnh viễn
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="d-flex justify-content-between align-items-center pagination-container">
            <div className="items-per-page">
              <span>Hàng trên mỗi trang: </span>
              <select className="form-select form-select-sm d-inline-block w-auto">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            
            <div className="pagination-controls">
              <button className="btn btn-sm btn-light me-2" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                <i className="bi bi-chevron-left"></i>
              </button>
              <span className="pagination-info">1-10 của {totalProducts}</span>
              <button className="btn btn-sm btn-light ms-2" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage * 10 >= totalProducts}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;