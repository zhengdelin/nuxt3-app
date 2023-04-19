import { WatchSource, ToRefs, isRef } from "vue";
import { QPaginationQuery, QPaginationParams } from "../types";

interface UsePaginationPageParams {
  page?: QPaginationQuery["page"];
  pageSize?: QPaginationQuery["page_size"];
}

interface UsePaginationInitResultType<T = any> {
  data: T[];
  paginationParams: QPaginationParams | undefined;
}
type UsePaginationInitResult<T> = ComputedRef<UsePaginationInitResultType<T>> | UsePaginationInitResultType<T>;

interface UsePagination<T> extends UsePaginationPageParams {
  /**
   * 是否為無線滾動
   */
  infiniteScroll?: boolean;
  /**
   * 初始化函數 回資料和分頁資料
   * 如果回傳的是響應式資料，則不會重新呼叫api(用於：Nuxt3)
   * 如果回傳的是非響應式資料，則會自動監控參數變動然後重新呼叫api
   *
   * @param pageParams
   */
  init(pageParams: ToRefs<Required<UsePaginationPageParams>>): Promise<UsePaginationInitResult<T>>;

  /**
   * UsePagination將會監測這個東西，有變動後重設頁數和資料
   */
  watchSourceToReset?: WatchSource | WatchSource[];

  /**
   * 當init函數回傳的為響應式資料將會無效
   */
  watchSourceToRequest?: WatchSource | WatchSource[];
}

export interface PaginationParams extends Required<UsePaginationPageParams> {
  total: number;
  totalPage: number;
}

const INITIAL_PAGINATION_PARAMS = {
  page: 1,
  page_size: 10,
  total: 0,
};

export async function usePagination<T = any>({
  init,
  infiniteScroll = false,
  page: defaultPage = 1,
  pageSize: defaultPageSize = 10,
  watchSourceToReset,
  watchSourceToRequest = [],
}: UsePagination<T>) {
  if (!(watchSourceToRequest instanceof Array)) {
    watchSourceToRequest = [watchSourceToRequest];
  }
  const page = ref(defaultPage);
  const pageSize = ref(defaultPageSize);
  const data = ref<T[]>([]);
  let toReset = false;

  const refresh = () => init({ page, pageSize });

  const { dataToWatch, paginationParams: originPaginationParams } = await (async function () {
    const initResult = await refresh();
    if (isRef(initResult)) {
      return {
        dataToWatch: computed(() => initResult.value.data),
        paginationParams: computed(() => initResult.value.paginationParams),
      };
    } else {
      const data = ref<T[]>([]);
      const paginationParams = ref<UsePaginationInitResultType["paginationParams"]>(INITIAL_PAGINATION_PARAMS);
      watch([page, pageSize, ...watchSourceToRequest], async () => {
        // 重新呼叫request
        const result = await refresh();
        if (!isRef(result)) {
          data.value = result.data as any;
          paginationParams.value = result.paginationParams;
        }
      });
      return {
        dataToWatch: data,
        paginationParams,
      };
    }
  })();

  addData(dataToWatch.value);
  watch(dataToWatch, addData);
  if (watchSourceToReset) {
    watch(watchSourceToReset, reset);
  }

  const paginationParams = computed<PaginationParams>(() => {
    const p = originPaginationParams.value || INITIAL_PAGINATION_PARAMS;
    return new Proxy(
      {
        page: p.page,
        pageSize: p.page_size,
        total: p.total,
        totalPage: Math.ceil(p.total / p.page_size),
      },
      {
        set(_, p, newValue) {
          if (p === "page") {
            page.value = newValue;
          }
          return true;
        },
      },
    );
  });
  const isEnd = computed(() => {
    const { page: curPage, pageSize: curPageSize, total } = paginationParams.value;
    return curPage * curPageSize > total;
  });

  function load() {
    if (isEnd.value) {
      return;
    }
    page.value++;
  }

  // watch(page, watchAndAddData);

  // function watchAndAddData() {
  //   const unwatch = watch(dataToWatch, (v: any) => {
  //     if (infiniteScroll) {
  //       data.value.push(...v);
  //     } else {
  //       data.value = v;
  //     }
  //     unwatch();
  //   });
  // }

  function addData(v: any) {
    if (toReset || !infiniteScroll) {
      data.value = v;
      toReset = false;
      return;
    }
    data.value.push(...v);
  }

  function reset() {
    page.value = 1;
    toReset = true;
  }

  return { page, pageSize, load, reset, data, paginationParams };
}
