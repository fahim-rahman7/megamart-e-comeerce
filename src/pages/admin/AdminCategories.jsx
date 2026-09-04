import React, { useState } from "react";
import {
  useGetCategoryListQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../service/api";
import Loading from "../../components/ui/Loading";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";
import { toast } from "react-toastify";

const AdminCategories = () => {
  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Form Fields State
  const initialFormState = {
    title: "",
    slug: "",
    isActive: true,
  };
  const [formValues, setFormValues] = useState(initialFormState);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // RTK Query Hooks
  const { data, isLoading } = useGetCategoryListQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  // Handle nested array response if backend returns an object wrapper
  const categoryList = Array.isArray(data)
    ? data
    : data?.categories || data?.data || [];

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug when creating a new category
    if (name === "title" && !editingCategoryId) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormValues((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormValues(initialFormState);
    setThumbnail(null);
    setThumbnailPreview("");
    setEditingCategoryId(null);
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setFormValues({
      title: category.title || "",
      slug: category.slug || "",
      isActive: category.isActive !== undefined ? category.isActive : true,
    });
    setThumbnailPreview(category.thumbnail || "");
    setThumbnail(null);
    setIsModalOpen(true);
  };

  // Submit Handler for Create & Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.title.trim()) return toast.error("Category title is required.");
    if (!formValues.slug.trim()) return toast.error("Category slug is required.");
    if (!editingCategoryId && !thumbnail) {
      return toast.error("Category thumbnail image is required.");
    }

    const formData = new FormData();
    formData.append("title", formValues.title.trim());
    formData.append("slug", formValues.slug.trim().toLowerCase());
    formData.append("isActive", formValues.isActive);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      if (editingCategoryId) {
        const res = await updateCategory({ id: editingCategoryId, formData }).unwrap();
        toast.success(res?.message || "Category updated successfully!");
      } else {
        const res = await createCategory(formData).unwrap();
        toast.success(res?.message || "Category created successfully!");
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save category.");
    }
  };

  // Delete Handler via Reusable Modal
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const res = await deleteCategory(categoryToDelete._id).unwrap();
      toast.success(res?.message || "Category deleted successfully!");
      setCategoryToDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete category.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-500">Organize and structure storefront items</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
        >
          + Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
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
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {categoryList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categoryList.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {cat.thumbnail ? (
                          <img
                            src={cat.thumbnail}
                            alt={cat.title}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{cat.title}</td>
                      <td className="py-3 px-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            cat.isActive !== false
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {cat.isActive !== false ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-blue-600 hover:underline font-medium text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setCategoryToDelete(cat)}
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
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-scaleUp">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-gray-800">
                {editingCategoryId ? "Edit Category" : "Add New Category"}
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  placeholder="e.g. Footwear"
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
                  placeholder="footwear"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Thumbnail Image {editingCategoryId ? "(Optional)" : "*"}
                </label>
                {thumbnailPreview && (
                  <div className="mb-2 flex items-center gap-3">
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                    <span className="text-xs text-gray-500">Current Preview</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formValues.isActive}
                  onChange={handleInputChange}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Enable Category (Active)
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
                  {editingCategoryId
                    ? isUpdating
                      ? "Saving..."
                      : "Save Changes"
                    : isCreating
                    ? "Creating..."
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REUSABLE DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category?"
        message="Are you sure you want to delete this category? This action cannot be undone."
        itemName={categoryToDelete?.title}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminCategories;