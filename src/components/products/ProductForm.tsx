import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Category {
  id: number;
  name: string;
}

interface ProductFormProps {
  onSubmit: (formData: any) => Promise<void>;
  initialData?: any;
  onCancel: () => void;
}

interface ValidationErrors {
  [key: string]: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  
  const [formData, setFormData] = useState(initialData || {
    name: "",
    description: "",
    original_price: "",
    discount_percent: "",
    expiration_date: "",
    stock_quantity: "",
    category_id: "",
    product_type: "",
    discounted_price: "0"
  });

  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzM5NzAxNTc3LCJleHAiOjE3Mzk3MDUxNzcsIm5iZiI6MTczOTcwMTU3NywianRpIjoieHdmc3Z4cU1QRHhSU2pzUCIsInN1YiI6IjE5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.vCs6e0HQFn0zhOv07DQCRVry-FId3Rc3oZhAO5Bcoeo";

  // Simulating predefined categories that match the backend IDs
  useEffect(() => {
    // Instead of fetching, we're using the predefined categories as mentioned
    const predefinedCategories: Category[] = [
      { id: 1, name: "Thực phẩm tươi sống" },
      { id: 2, name: "Đồ uống" },
      { id: 3, name: "Bánh kẹo" },
      { id: 4, name: "Sữa và các sản phẩm từ sữa" },
      { id: 5, name: "Đồ gia dụng" },
      { id: 6, name: "Chăm sóc cá nhân" },
      { id: 7, name: "Đồ dùng nhà bếp" }
    ];

    // Simulating API loading
    setTimeout(() => {
      setCategories(predefinedCategories);
      setIsLoadingCategories(false);
    }, 500);
  }, []);

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
    } else if (formData.name.length > 255) {
      newErrors.name = "Tên sản phẩm không được vượt quá 255 ký tự";
    }

    if (!formData.original_price) {
      newErrors.original_price = "Giá gốc không được để trống";
    } else if (Number(formData.original_price) < 0) {
      newErrors.original_price = "Giá gốc phải lớn hơn hoặc bằng 0";
    }

    if (!formData.discount_percent) {
      newErrors.discount_percent = "Phần trăm giảm giá không được để trống";
    } else if (Number(formData.discount_percent) < 0 || Number(formData.discount_percent) > 100) {
      newErrors.discount_percent = "Phần trăm giảm giá phải từ 0 đến 100";
    }

    if (!formData.stock_quantity) {
      newErrors.stock_quantity = "Số lượng tồn kho không được để trống";
    } else if (Number(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = "Số lượng tồn kho phải lớn hơn hoặc bằng 0";
    }

    if (!formData.category_id) {
      newErrors.category_id = "Vui lòng chọn danh mục sản phẩm";
    }

    if (!formData.product_type.trim()) {
      newErrors.product_type = "Loại sản phẩm không được để trống";
    } else if (formData.product_type.length > 100) {
      newErrors.product_type = "Loại sản phẩm không được vượt quá 100 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Calculate discounted price when original price or discount percent changes
      if (name === 'original_price' || name === 'discount_percent') {
        const originalPrice = parseFloat(newData.original_price) || 0;
        const discountPercent = parseFloat(newData.discount_percent) || 0;
        const discountedPrice = originalPrice * (1 - discountPercent / 100);
        newData.discounted_price = discountedPrice.toString();
      }
      
      return newData;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
        }
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setSubmitError(
        error.response?.data?.message || 
        "Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-form-container">
      <div className="breadcrumb mb-4">
        <span 
          className="text-decoration-none text-muted cursor-pointer"
          onClick={onCancel}
        >
          QUẢN LÝ SẢN PHẨM
        </span>
        <span className="mx-2 text-muted">/</span>
        <span className="text-primary">THÊM SẢN PHẨM</span>
      </div>

      {submitError && (
        <div className="alert alert-danger mb-4" role="alert">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-3">
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">
                Tên sản phẩm <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Mô tả sản phẩm
              </label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Danh mục sản phẩm <span className="text-danger">*</span>
              </label>
              <select 
                className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                disabled={isLoadingCategories}
              >
                <option value="">Chọn danh mục sản phẩm</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <div className="invalid-feedback">{errors.category_id}</div>}
              {categoryError && <div className="text-danger mt-1">{categoryError}</div>}
              {isLoadingCategories && <div className="text-muted mt-1">Đang tải danh mục...</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Loại sản phẩm <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.product_type ? 'is-invalid' : ''}`}
                name="product_type"
                value={formData.product_type}
                onChange={handleChange}
                placeholder="Nhập loại sản phẩm"
              />
              {errors.product_type && <div className="invalid-feedback">{errors.product_type}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Giá gốc <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-control ${errors.original_price ? 'is-invalid' : ''}`}
                name="original_price"
                value={formData.original_price}
                onChange={handleChange}
                min="0"
              />
              {errors.original_price && <div className="invalid-feedback">{errors.original_price}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Phần trăm giảm giá (%) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-control ${errors.discount_percent ? 'is-invalid' : ''}`}
                name="discount_percent"
                value={formData.discount_percent}
                onChange={handleChange}
                min="0"
                max="100"
              />
              {errors.discount_percent && <div className="invalid-feedback">{errors.discount_percent}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Số lượng tồn kho <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-control ${errors.stock_quantity ? 'is-invalid' : ''}`}
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                min="0"
              />
              {errors.stock_quantity && <div className="invalid-feedback">{errors.stock_quantity}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Ngày hết hạn
              </label>
              <input
                type="date"
                className="form-control"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">
                Tải ảnh sản phẩm lên <span className="text-danger">*</span>
              </label>
              <div className="upload-container border rounded-3 p-4 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="d-none"
                  onChange={handleFileUpload}
                  accept="image/*"
                />
                {isUploading ? (
                  <div>
                    <div className="text-muted mb-2">Đang tải... {uploadProgress}%</div>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="upload-icon mb-3">
                      <i className="bi bi-cloud-upload fs-1 text-primary"></i>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Duyệt tập tin
                    </button>
                    <div className="text-muted mt-2">
                      Bạn có thể tải lên tối đa 3mp
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button 
            type="button" 
            className="btn btn-light px-4"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="btn btn-primary px-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang thêm...' : 'Thêm'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;