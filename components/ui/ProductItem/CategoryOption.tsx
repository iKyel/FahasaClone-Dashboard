import { SelectItem } from "../select";

import { CategoryDTO } from "@/types/category.type";

interface CategoryNode extends CategoryDTO {
  children: CategoryNode[];
}

const CategoryOption = ({
  category,
  level = 0,
}: {
  category: CategoryNode;
  level?: number;
}) => {
  const paddingLeft = level * 16; // Adjust the multiplier as needed for desired indentation

  return (
    <>
      <SelectItem value={category._id} className="w-full">
        <span className="block" style={{ paddingLeft }}>
          {category.ten}
        </span>
      </SelectItem>
      {category.children.map((child) => (
        <CategoryOption key={child._id} category={child} level={level + 1} />
      ))}
    </>
  );
};

export default CategoryOption;
