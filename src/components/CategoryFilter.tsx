
import { useState } from "react";
import { Button } from "./ui/button";

interface CategoryFilterProps {
  onFilterChange: (category: string | null) => void;
}

const categories = [
  { id: "all", label: "All Events" },
  { id: "business", label: "Business" },
  { id: "social", label: "Social" },
  { id: "education", label: "Education" },
  { id: "other", label: "Other" },
];

const CategoryFilter = ({ onFilterChange }: CategoryFilterProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>("all");

  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    onFilterChange(categoryId === "all" ? null : categoryId);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          className={
            activeCategory === category.id
              ? "bg-event-purple hover:bg-purple-700"
              : ""
          }
          onClick={() => handleCategoryChange(category.id)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
