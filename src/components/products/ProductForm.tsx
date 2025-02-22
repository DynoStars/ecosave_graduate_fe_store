import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Image from 'next/image';

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

interface ImageFile {
  file: File;
  preview: string;
  order: number;
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
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  
  const [formData, setFormData] = useState(initialData || {
    name: "",
    description: "",
    original_price: "",
    discount_percent: "",
    expiration_date: "",
    stock_quantity: "",
    category_id: "",
    product_type: "",
    discounted_price: "0",
    images: []
  });

  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzQwMTI0NDMzLCJleHAiOjE3NDAxMjgwMzMsIm5iZiI6MTc0MDEyNDQzMywianRpIjoiME5JSWtaNWNrV3BjNFExWCIsInN1YiI6IjE5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.rkQzr1TWZB34ITZm-t7o8AH0Y1HQtl9cD-vIJ7wzxdY";

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setCategoryError("");
      
      const response = await api.get('/categories');
      
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setCategoryError(
        error.response?.data?.message || 
        'Không thể tải danh mục sản phẩm. Vui lòng thử lại sau.'
      );
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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

    if (selectedImages.length === 0) {
      newErrors.images = "Vui lòng chọn ít nhất một hình ảnh";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'original_price' || name === 'discount_percent') {
        const originalPrice = parseFloat(newData.original_price) || 0;
        const discountPercent = parseFloat(newData.discount_percent) || 0;
        const discountedPrice = originalPrice * (1 - discountPercent / 100);
        newData.discounted_price = discountedPrice.toString();
      }
      
      return newData;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (selectedImages.length + files.length > 3) {
      alert('Bạn chỉ có thể tải lên tối đa 3 hình ảnh');
      return;
    }

    const newImages: ImageFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 3 * 1024 * 1024) {
        alert(`File ${file.name} vượt quá kích thước cho phép (3MB)`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      
      newImages.push({
        file,
        preview,
        order: selectedImages.length + i
      });
    }

    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      return newImages.map((img, i) => ({
        ...img,
        order: i
      }));
    });
  };

  const reorderImages = (dragIndex: number, dropIndex: number) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      const [draggedImage] = newImages.splice(dragIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);
      return newImages.map((img, i) => ({
        ...img,
        order: i
      }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedImages = await Promise.all(
        selectedImages.map(async (image) => {
          const formData = new FormData();
          formData.append('image', image.file);
          
          const response = await api.post('/upload-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          return {
            image_url: response.data.url,
            image_order: image.order
          };
        })
      );

      const productData = {
        ...formData,
        images: uploadedImages
      };

      await onSubmit(productData);
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

  useEffect(() => {
    return () => {
      selectedImages.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  const renderCategorySelect = () => (
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
      {errors.category_id && (
        <div className="invalid-feedback">{errors.category_id}</div>
      )}
      {categoryError && (
        <div className="text-danger mt-1">
          {categoryError}
          <button 
            type="button" 
            className="btn btn-link btn-sm p-0 ms-2"
            onClick={() => {
              setIsLoadingCategories(true);
              fetchCategories();
            }}
          >
            Thử lại
          </button>
        </div>
      )}
      {isLoadingCategories && (
        <div className="text-muted mt-1">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Đang tải danh mục...
        </div>
      )}
    </div>
  );

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

            {renderCategorySelect()}

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
              <div className="upload-container border rounded-3 p-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="d-none"
                  onChange={handleFileUpload}
                  accept="image/*"
                  multiple
                />
                
                <div className="text-center mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={selectedImages.length >= 3}
                  >
                    Chọn hình ảnh
                  </button>
                  <div className="text-muted mt-2">
                    Tối đa 3 hình ảnh, mỗi hình không quá 3MB
                  </div>
                </div>

                {errors.images && (
                  <div className="alert alert-danger">{errors.images}</div>
                )}

                <div className="selected-images">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="selected-image-item mb-3 position-relative">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="img-thumbnail"
                        style={{ maxHeight: '150px' }}
                      />
                      <div className="image-actions mt-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeImage(index)}
                        >
                          Xóa
                        </button>
                        <span className="ms-2">Thứ tự: {index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
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