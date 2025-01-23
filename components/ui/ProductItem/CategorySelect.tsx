import { CategoryDTO } from "@/types/category.type";

interface CategoryNode extends CategoryDTO {
  children: CategoryNode[];
}

const buildCategoryTree = (categories: CategoryDTO[]): CategoryNode[] => {
  const categoryMap = new Map<string, CategoryNode>();
  const rootNodes: CategoryNode[] = [];

  categories.forEach((category) => {
    categoryMap.set(category._id, { ...category, children: [] });
  });

  categories.forEach((category) => {
    const node = categoryMap.get(category._id)!;
    if (category.parentId === null) {
      rootNodes.push(node);
    } else {
      const parentNode = categoryMap.get(category.parentId);
      if (parentNode) {
        parentNode.children.push(node);
      }
    }
  });

  return rootNodes;
};

export default buildCategoryTree;
