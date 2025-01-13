"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronRight, ChevronDown, Plus } from "lucide-react";

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

  useEffect(() => {
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

    fetchCategories();
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

      const updatedCategories = await axios.get(
        "http://localhost:3412/api/category/getCategories"
      );
      const danhMucs = updatedCategories.data.danhMucs;
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
      console.error("Lỗi khi thêm danh mục:", error);
      setMessage("Thêm danh mục thất bại!");
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
                <span
                  onClick={() => toggleAddForm(category._id)}
                  className={`font-medium py-1 px-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                    isSelected ? "bg-gray-100" : ""
                  }`}
                >
                  {category.ten}
                </span>
                <button
                  onClick={() => toggleAddForm(category._id)}
                  className="ml-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-md transition-opacity"
                >
                  <Plus className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {isSelected && (
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
