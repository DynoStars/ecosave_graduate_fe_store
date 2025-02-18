import React from "react";

interface ProductDetailProps {
  product: any;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Giá gốc: {product.original_price} vnd</li>
          <li className="list-group-item">Giảm giá: {product.discount_percent}%</li>
          <li className="list-group-item">Giá sau giảm: {product.discounted_price} vnd</li>
          <li className="list-group-item">Loại sản phẩm: {product.product_type}</li>
          <li className="list-group-item">Ngày hết hạn: {product.expiration_date}</li>
          <li className="list-group-item">Số lượng tồn kho: {product.stock_quantity}</li>
          <li className="list-group-item">Danh mục: {product.category.name}</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetail;