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

// --- Inline Icons for clean aesthetic ---
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

const ImageIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AdminCategories = () => {
  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Extract category list
  const categoryList = Array.isArray(data)
    ? data
    : data?.categories || data?.data || [];

  // Filtered categories based on search input
  const filteredCategories = categoryList.filter(
    (cat) =>
      cat.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Quick stats calculations
  const totalCategories = categoryList.length;
  const activeCategories = categoryList.filter((c) => c.isActive !== false).length;
  const inactiveCategories = totalCategories - activeCategories;

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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

  const removeSelectedImage = () => {
    setThumbnail(null);
    setThumbnailPreview(editingCategoryId ? categoryList.find(c => c._id === editingCategoryId)?.thumbnail || "" : "");
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

  // Submit Handler
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

  // Delete Handler
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
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage storefront hierarchy, media thumbnails, and visibility states.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
        >
          <PlusIcon />
          <span>Add Category</span>
        </button>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total</span>
          <span className="text-xl font-bold text-slate-900">{totalCategories}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Active</span>
          <span className="text-xl font-bold text-emerald-600">{activeCategories}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Disabled</span>
          <span className="text-xl font-bold text-slate-500">{inactiveCategories}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Search & Action Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Filter categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <span className="text-xs font-medium text-slate-400">
            Showing {filteredCategories.length} of {totalCategories} items
          </span>
        </div>

        {/* Categories Table */}
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Thumbnail</th>
                  <th className="py-3.5 px-5">Category Title</th>
                  <th className="py-3.5 px-5">Slug</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ImageIcon />
                        <p className="text-sm font-medium">No categories found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-5">
                        {cat.thumbnail ? (
                          <div className="h-11 w-11 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                            <img
                              src={cat.thumbnail}
                              alt={cat.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="h-11 w-11 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center flex-shrink-0">
                            <ImageIcon />
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-slate-800">
                        {cat.title}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-mono text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200/50">
                          /{cat.slug}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                            cat.isActive !== false
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                              : "bg-slate-100 text-slate-500 ring-1 ring-slate-400/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              cat.isActive !== false ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          {cat.isActive !== false ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Category"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => setCategoryToDelete(cat)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Category"
                          >
                            <TrashIcon />
                          </button>
                        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900">
                {editingCategoryId ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formValues.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Footwear & Apparel"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm text-slate-400 select-none">/</span>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={formValues.slug}
                    onChange={handleInputChange}
                    placeholder="footwear-apparel"
                    className="w-full pl-7 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Thumbnail Image {editingCategoryId ? "(Optional)" : "*"}
                </label>

                {thumbnailPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={thumbnailPreview}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                      <div className="text-xs">
                        <p className="font-medium text-slate-700">Selected Image</p>
                        <p className="text-slate-400">{thumbnail ? thumbnail.name : "Existing Category Icon"}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Clear image"
                    >
                      <XIcon />
                    </button>
                  </div>
                ) : (
                  <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadIcon />
                      <p className="mt-2 text-xs font-medium text-slate-600">
                        <span className="text-indigo-600 font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or WEBP up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <label className="text-sm font-semibold text-slate-800 block">Category Status</label>
                  <p className="text-xs text-slate-500">Enable to display on storefront</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormValues((prev) => ({ ...prev, isActive: !prev.isActive }))
                  }
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    formValues.isActive ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      formValues.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs shadow-indigo-200 transition-colors"
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