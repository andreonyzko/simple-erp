import { useSearchParams } from "react-router";

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key: string) => searchParams.get(key);

  function setParam(key: string, value: string | null) {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (!value || value.trim() === "")
        newParams.delete(key);
      else newParams.set(key, value);

      return newParams;
    });
  }

  function setParams(params: Record<string, string | null>) {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value.trim() === "" || value === undefined)
          newParams.delete(key);
        else newParams.set(key, value);
      });

      return newParams;
    });
  }

  const clearParams = () => setSearchParams(new URLSearchParams());

  return {
    searchParams,
    getParam,
    setParam,
    setParams,
    clearParams,
  };
}
