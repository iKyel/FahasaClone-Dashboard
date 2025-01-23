"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChevronRight, ChevronDown, Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "react-toastify";

interface Category {
  _id: string;
  ten: string;
  parentId?: string | null;
  children?: Category[];
}

const CategoryTree = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3412/api/category/getCategories"
      );
      const danhMucs = response.data.categories;

      const buildTree = (parentId: string | null) => {
        return danhMucs
          .filter((item: Category) => item.parentId === parentId)
          .map((item: Category) => ({
            ...item,
            children: buildTree(item._id),
          }));
      };

      setCategories(buildTree(null));
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setSelectedCategory(null);
      }
      if (
        editInputRef.current &&
        !editInputRef.current.contains(event.target as Node)
      ) {
        setEditingCategory(null);
        setEditingValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddCategory = async (ten: string, parentId: string | null) => {
    try {
      const response = await axios.post(
        "http://localhost:3412/api/category/addCategory",
        {
          ten,
          parentId,
        }
      );
      setMessage(response.data.message);
      await fetchCategories();
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      setMessage("Thêm danh mục thất bại!");
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category._id);
    setEditingValue(category.ten);
  };

  const handleSubmitEdit = async (categoryId: string, e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!editingValue.trim()) {
      setEditingCategory(null);
      setEditingValue("");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3412/api/category/editCategoryName/${categoryId}`,
        {
          ten: editingValue.trim(),
        },
        {
          withCredentials: true,
        }
      );

      setMessage(response.data.message);
      await fetchCategories();
      setEditingCategory(null);
      setEditingValue("");
    } catch (error) {
      toast.error("Lỗi khi sửa danh mục:");
      setMessage("Sửa danh mục thất bại!");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3412/api/category/deleteCategory/${categoryId}`,
        {
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
      await fetchCategories();
    } catch (error) {
      toast.error("Lỗi khi xóa danh mục");
      setMessage("Xóa danh mục thất bại!");
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleAddForm = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const renderCategories = (categories: Category[], level = 0) => {
    if (!categories || categories.length === 0) return null;

    return (
      <ul className={`${level === 0 ? "ml-0" : "ml-6"} space-y-2`}>
        {categories.map((category) => {
          const hasChildren = category.children && category.children.length > 0;
          const isExpanded = expandedCategories.has(category._id);
          const isSelected = selectedCategory === category._id;
          const isEditing = editingCategory === category._id;

          return (
            <li key={category._id} className="relative">
              <div className="flex items-center group">
                {hasChildren && (
                  <button
                    onClick={() => toggleCategory(category._id)}
                    className="p-1 hover:bg-gray-100 rounded-md"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                )}
                {isEditing ? (
                  <form
                    className="flex items-center"
                    onSubmit={(e) => handleSubmitEdit(category._id, e)}
                  >
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                  </form>
                ) : (
                  <>
                    <span
                      onClick={() => toggleAddForm(category._id)}
                      className={`font-medium py-1 px-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                        isSelected ? "bg-gray-100" : ""
                      }`}
                    >
                      {category.ten}
                    </span>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleAddForm(category._id)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded-md"
                      >
                        <Plus className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => startEditing(category)}
                        className="ml-1 p-1 hover:bg-gray-100 rounded-md"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="ml-1 p-1 hover:bg-red-100 rounded-md"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {isSelected && (
                <div ref={formRef}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const tenInput = (
                        e.target as HTMLFormElement
                      ).elements.namedItem(
                        `ten-${category._id}`
                      ) as HTMLInputElement;
                      const ten = tenInput.value.trim();
                      if (ten) {
                        handleAddCategory(ten, category._id);
                        tenInput.value = "";
                        setSelectedCategory(null);
                      }
                    }}
                    className="mt-2 ml-8"
                  >
                    <div className="flex items-center">
                      <input
                        type="text"
                        name={`ten-${category._id}`}
                        placeholder="Thêm danh mục con"
                        className="px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="ml-2 px-3 py-1 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                      >
                        Thêm
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {hasChildren &&
                isExpanded &&
                category.children &&
                renderCategories(category.children, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Quản Lý Danh Mục
      </h2>
      {message && <p className="text-center text-green-600 mt-4">{message}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const tenInput = (e.target as HTMLFormElement).elements.namedItem(
            "ten-root"
          ) as HTMLInputElement;
          const ten = tenInput.value.trim();
          if (ten) {
            handleAddCategory(ten, null);
            tenInput.value = "";
          }
        }}
        className="mt-6"
      >
        <div className="flex items-center">
          <input
            type="text"
            name="ten-root"
            placeholder="Thêm danh mục cấp 1"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            Thêm
          </button>
        </div>
      </form>

      <div className="mt-8">{renderCategories(categories)}</div>
    </div>
  );
};

export default CategoryTree;
