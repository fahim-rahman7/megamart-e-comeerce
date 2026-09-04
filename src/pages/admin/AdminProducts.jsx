import React, { useState } from "react";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoryListQuery,
} from "../../service/api";
import Loading from "../../components/ui/Loading";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";
import { toast } from "react-toastify";

// Inline SVG Icon Components
const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UploadCloudIcon = () => (
  <svg className="w-6 h-6 text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const AdminProducts = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Modal State for Delete Confirmation
  const [productToDelete, setProductToDelete] = useState(null);

  // RTK Query Hooks
  const { data, isLoading, isFetching } = useGetProductsQuery({
    page,
    limit: 8,
    search,
    ...(selectedCategoryFilter && { category: selectedCategoryFilter }),
  });
  const { data: categoryData } = useGetCategoryListQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const categoryList = Array.isArray(categoryData)
    ? categoryData
    : categoryData?.categories || categoryData?.data || [];

  const productsList = data?.products || data?.data || (Array.isArray(data) ? data : []);

  const initialFormState = {
    title: "",
    slug: "",
    description: "",
    category: "",
    price: "",
    discountPercentage: 0,
    isActive: true,
  };

  const [formValues, setFormValues] = useState(initialFormState);
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [tagsInput, setTagsInput] = useState("");
  const [variants, setVariants] = useState([{ sku: "", color: "", size: "", stock: 0 }]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "title" && !editingProductId) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormValues((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariantField = () => {
    setVariants((prev) => [...prev, { sku: "", color: "", size: "", stock: 0 }]);
  };

  const removeVariantField = (index) => {
    if (variants.length === 1) {
      return toast.warning("At least one variant is required.");
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (item) => {
    setEditingProductId(item._id);
    setFormValues({
      title: item.title || "",
      slug: item.slug || "",
      description: item.description || "",
      category: item.category?._id || item.category || "",
      price: item.price || "",
      discountPercentage: item.discountPercentage || 0,
      isActive: item.isActive !== undefined ? item.isActive : true,
    });
    setTagsInput(Array.isArray(item.tags) ? item.tags.join(", ") : "");
    setVariants(
      item.variants && item.variants.length > 0
        ? item.variants.map((v) => ({
            sku: v.sku || "",
            color: v.color || "",
            size: v.size || "",
            stock: v.stock ?? 0,
          }))
        : [{ sku: "", color: "", size: "", stock: 0 }]
    );
    setThumbnail(null);
    setImages([]);
    setIsModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const res = await deleteProduct(productToDelete._id).unwrap();
      toast.success(res?.message || "Product deleted successfully!");
      setProductToDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete product.");
    }
  };

  const resetForm = () => {
    setFormValues(initialFormState);
    setThumbnail(null);
    setImages([]);
    setTagsInput("");
    setVariants([{ sku: "", color: "", size: "", stock: 0 }]);
    setEditingProductId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingProductId) {
      if (!thumbnail) return toast.error("Product thumbnail is required.");
      if (!images || images.length === 0) return toast.error("At least one product gallery image is required.");
    }

    if (!formValues.category) return toast.error("Please select a category.");

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.sku.trim()) return toast.error(`Variant #${i + 1}: SKU is required.`);
      if (!v.color.trim()) return toast.error(`Variant #${i + 1}: Color is required.`);
      if (!v.size.trim()) return toast.error(`Variant #${i + 1}: Size is required.`);
      if (v.stock === "" || v.stock === null || v.stock < 0) {
        return toast.error(`Variant #${i + 1}: Valid stock quantity is required.`);
      }
    }

    const formData = new FormData();
    formData.append("title", formValues.title.trim());
    formData.append("slug", formValues.slug.trim().toLowerCase());
    formData.append("description", formValues.description.trim());
    formData.append("category", formValues.category);
    formData.append("price", formValues.price);
    formData.append("discountPercentage", formValues.discountPercentage || 0);
    formData.append("isActive", formValues.isActive);

    formData.append("variants", JSON.stringify(variants));
    const tagsArray = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    formData.append("tags", JSON.stringify(tagsArray));

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    if (images && images.length > 0) {
      Array.from(images).forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      if (editingProductId) {
        const res = await updateProduct({ id: editingProductId, formData }).unwrap();
        toast.success(res?.message || "Product updated successfully!");
      } else {
        const res = await createProduct(formData).unwrap();
        toast.success(res?.message || "Product created successfully!");
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save product.");
    }
  };

  // Helper function to calculate total inventory across variants
  const getTotalStock = (variantsArr) => {
    if (!Array.isArray(variantsArr)) return 0;
    return variantsArr.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products Catalog</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage product inventory, specifications, dynamic variants, and pricing.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all duration-150 shadow-sm hover:shadow active:scale-[0.98]"
        >
          <PlusIcon />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search by title, SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => {
              setSelectedCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-48 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          >
            <option value="">All Categories</option>
            {categoryList.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title || cat.name || "Untitled"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading || isFetching ? (
          <div className="p-12 flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Inventory</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {productsList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <svg className="w-10 h-10 mb-2 stroke-current opacity-50" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="font-medium text-slate-600">No products found</p>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  productsList.map((item) => {
                    const totalStock = getTotalStock(item.variants);
                    return (
                      <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-11 h-11 rounded-lg object-cover border border-slate-200 shadow-2xs flex-shrink-0 bg-slate-100"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 truncate max-w-xs">{item.title}</div>
                              <div className="text-xs text-slate-400 truncate max-w-xs">{item.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">
                            {item.category?.title || item.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">৳{item.price}</div>
                          {item.discountPercentage > 0 && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                              {item.discountPercentage}% OFF
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs font-medium text-slate-700">
                            {totalStock > 0 ? (
                              <span className="text-slate-800 font-semibold">{totalStock} units</span>
                            ) : (
                              <span className="text-rose-600 font-semibold">Out of stock</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{item.variants?.length || 0} variant(s)</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                              item.isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                            {item.isActive ? "Active" : "Draft"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(item)}
                              title="Edit product"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => openDeleteModal(item)}
                              title="Delete product"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {data?.pagination && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600">
            <span className="text-xs sm:text-sm">
              Showing page <strong className="text-slate-900">{data.pagination.page}</strong> of{" "}
              <strong className="text-slate-900">{data.pagination.totalPage || 1}</strong>
            </span>
            <div className="inline-flex items-center gap-2">
              <button
                disabled={!data.pagination.hasPrevPage}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 shadow-2xs transition-colors"
              >
                Previous
              </button>
              <button
                disabled={!data.pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 shadow-2xs transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto transition-opacity">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingProductId ? "Edit Product Details" : "Create New Product"}
                </h2>
                <p className="text-xs text-slate-500">
                  {editingProductId ? "Update stock, gallery, or pricing information." : "Fill in the parameters below to create a catalog item."}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {/* Basic Details Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formValues.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Premium Cotton T-Shirt"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Slug *</label>
                    <input
                      type="text"
                      name="slug"
                      required
                      value={formValues.slug}
                      onChange={handleInputChange}
                      placeholder="premium-cotton-t-shirt"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
                  <textarea
                    name="description"
                    rows="3"
                    required
                    value={formValues.description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed product summary..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Pricing & Classification */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Pricing & Category</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Category *</label>
                    <select
                      name="category"
                      required
                      value={formValues.category}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value="">Select Category</option>
                      {categoryList.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.title || cat.name || "Untitled Category"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Base Price (৳) *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      required
                      value={formValues.price}
                      onChange={handleInputChange}
                      placeholder="29.99"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={formValues.discountPercentage}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Variants Section */}
              <div className="space-y-3 bg-slate-50/70 border border-slate-200/80 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Product Variants</h3>
                    <p className="text-[11px] text-slate-500">Each variant must contain valid SKU, color, size, and stock quantity.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariantField}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <PlusIcon /> Add Variant
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  {variants.map((v, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          placeholder="SKU *"
                          required
                          value={v.sku}
                          onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                          className="w-full border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          placeholder="Color *"
                          required
                          value={v.color}
                          onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                          className="w-full border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          placeholder="Size *"
                          required
                          value={v.size}
                          onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                          className="w-full border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          placeholder="Stock *"
                          required
                          value={v.stock}
                          onChange={(e) => handleVariantChange(index, "stock", Number(e.target.value))}
                          className="w-full border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariantField(index)}
                            className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded transition-colors"
                            title="Remove variant"
                          >
                            <CloseIcon />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="menswear, summer, sale"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {/* Media Upload Drops */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Thumbnail Dropzone */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Thumbnail Image {editingProductId ? "(Optional)" : "*"}
                  </label>
                  <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer text-center group">
                    <UploadCloudIcon />
                    <span className="text-xs font-medium text-slate-700 group-hover:text-indigo-600">
                      {thumbnail ? thumbnail.name : "Choose Thumbnail"}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or WEBP up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      required={!editingProductId}
                      onChange={(e) => setThumbnail(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Gallery Dropzone */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Gallery Images {editingProductId ? "(Optional)" : "*"}
                  </label>
                  <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer text-center group">
                    <UploadCloudIcon />
                    <span className="text-xs font-medium text-slate-700 group-hover:text-indigo-600">
                      {images && images.length > 0 ? `${images.length} File(s) Selected` : "Choose Gallery Images"}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Select one or multiple images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      required={!editingProductId}
                      onChange={(e) => setImages(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formValues.isActive}
                  onChange={handleInputChange}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                  Publish product immediately (Active status)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all duration-150 active:scale-[0.98]"
                >
                  {editingProductId
                    ? isUpdating
                      ? "Saving Changes..."
                      : "Save Changes"
                    : isCreating
                    ? "Uploading Product..."
                    : "Upload Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={productToDelete?.title}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminProducts;