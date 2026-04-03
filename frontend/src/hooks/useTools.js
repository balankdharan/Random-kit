import { useState, useEffect } from "react";

// Hook to fetch tools
export const useTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tools`,
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          // Transform API data to match frontend format
          const transformedTools = data.data.map((tool) => ({
            id: tool._id,
            name: tool.name,
            description: tool.description,
            slug: tool.slug,
            category: tool.category?.name || "Uncategorized",
            categoryId: tool.category?._id,
            categorySlug: tool.category?.slug,
            icon: tool.icon || "⚙️", // Fallback icon if not in DB
          }));

          setTools(transformedTools);
          setError(null);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (err) {
        console.error("Error fetching tools:", err);
        setError(err.message);
        setTools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  return { tools, loading, error };
};
