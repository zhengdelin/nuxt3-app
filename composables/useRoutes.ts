import { RouteLocationNamedRaw } from "vue-router";
export function extendCurrentRouteQuery(query: RouteLocationNamedRaw["query"]) {
  const route = useRoute();
  return Object.assign({}, route.query, query);
}
