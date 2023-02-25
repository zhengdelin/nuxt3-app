export function injectGlobalAPI(query: QueryHandlers) {
  const API_TYPE = "/web";
  return {
    getCategories: () => query.get(`${API_TYPE}/categorys`),
  };
}
