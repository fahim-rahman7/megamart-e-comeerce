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

const AdminProducts = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Modal State for Delete Confirmation
  const [productToDelete, setProductToDelete] = useState(null);

  // RTK Query Hooks
  const { data, isLoading, isFetching } = useGetProductsQuery({
    page,
    limit: 8,
    search,
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

  // Trigger Delete Confirmation Modal
  const openDeleteModal = (product) => {
    setProductToDelete(product);
  };

  // Execute Deletion via RTK Query
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <p className="text-sm text-gray-500">Manage catalog products, stock, and pricing</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
        >
          + Add New Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading || isFetching ? (
          <div className="p-8 flex justify-center">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Thumbnail</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {productsList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  productsList.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{item.title}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {item.category?.title || item.category?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">৳{item.price}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.isActive ? "Active" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:underline font-medium text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="text-red-600 hover:underline font-medium text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {data?.pagination && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
            <span>
              Page {data.pagination.page} of {data.pagination.totalPage || 1}
            </span>
            <div className="space-x-2">
              <button
                disabled={!data.pagination.hasPrevPage}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                disabled={!data.pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col my-8">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-800">
                {editingProductId ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formValues.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Classic Cotton T-Shirt"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={formValues.slug}
                    onChange={handleInputChange}
                    placeholder="classic-cotton-t-shirt"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  rows="3"
                  required
                  value={formValues.description}
                  onChange={handleInputChange}
                  placeholder="Detailed product information..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formValues.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
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
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Price (৳) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    value={formValues.price}
                    onChange={handleInputChange}
                    placeholder="29.99"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formValues.discountPercentage}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border border-gray-200 p-4 rounded-xl space-y-3 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-700 uppercase">
                    Product Variants * (SKU, Color, Size & Stock required)
                  </span>
                  <button
                    type="button"
                    onClick={addVariantField}
                    className="text-xs text-blue-600 font-medium hover:underline"
                  >
                    + Add Variant
                  </button>
                </div>

                {variants.map((v, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                    <input
                      type="text"
                      placeholder="SKU *"
                      required
                      value={v.sku}
                      onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                      className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Color *"
                      required
                      value={v.color}
                      onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                      className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Size *"
                      required
                      value={v.size}
                      onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                      className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Stock *"
                        required
                        value={v.stock}
                        onChange={(e) => handleVariantChange(index, "stock", Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none"
                      />
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariantField(index)}
                          className="text-red-500 font-bold px-1 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="menswear, summer, casual"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Thumbnail Image {editingProductId ? "(Optional on Edit)" : "*"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required={!editingProductId}
                    onChange={(e) => setThumbnail(e.target.files[0])}
                    className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Gallery Images {editingProductId ? "(Optional on Edit)" : "*"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    required={!editingProductId}
                    onChange={(e) => setImages(e.target.files)}
                    className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formValues.isActive}
                  onChange={handleInputChange}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Publish product immediately (Active)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  {editingProductId
                    ? isUpdating
                      ? "Saving..."
                      : "Save Changes"
                    : isCreating
                    ? "Uploading..."
                    : "Upload Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
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