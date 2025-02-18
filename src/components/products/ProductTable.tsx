import React, { useState } from "react";
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

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  error: string;
  currentPage: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
  currentTab: "active" | "deleted";
}

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    loading,
    error,
    currentPage,
    totalProducts,
    onPageChange,
    currentTab,
  }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeProductId, setActiveProductId] = useState<number | null>(null);
  
    const toggleMenu = (productId: number) => {
      if (activeProductId === productId) {
        setIsMenuOpen(!isMenuOpen);
      } else {
        setIsMenuOpen(true);
        setActiveProductId(productId);
      }
    };
  
    return (
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
                      <img src="/product-thumbnail.jpg" alt={product.name} className="product-image" />
                    </div>
                    <div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-email text-muted">example@email.com</div>
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
                  <div className="product-type">Sản phẩm đóng hộp</div>
                </td>
                <td>
                  <div className="product-description">Sản phẩm đóng hộp</div>
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
      </div>
    );
  };  

export default ProductTable;