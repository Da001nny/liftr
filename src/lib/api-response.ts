/**
 * liftr: Authoritative API Response Contract
 * 
 * Non-negotiable rule: Every single endpoint in liftr MUST return this exact response shape:
 * {
 *   data: {
 *     items: T[],
 *     total: number,
 *     page: number,
 *     limit: number
 *   },
 *   error?: string | null
 * }
 * 
 * This applies to EVERY endpoint without exception:
 * - Single-item responses (e.g. GET /api/profile) wrap the item in items: [item], total: 1, page: 1, limit: 1.
 * - Multi-item list responses wrap the items array with total, page, limit.
 * - Empty responses return items: [], total: 0, page: 1, limit: 0.
 * - Raw arrays or bare unwrapped objects are STRICTLY FORBIDDEN.
 */

export interface ApiResponseData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: ApiResponseData<T>;
  error?: string | null;
}

/**
 * Creates a compliant ApiResponse object for single or multiple items.
 * 
 * @param items A single item or array of items
 * @param total Total count (defaults to items.length)
 * @param page Current page number (defaults to 1)
 * @param limit Page size / item limit (defaults to items.length or 1)
 */
export function formatApiResponse<T>(
  items: T | T[] | null | undefined,
  total?: number,
  page: number = 1,
  limit?: number
): ApiResponse<T> {
  let itemsArray: T[];

  if (items === null || items === undefined) {
    itemsArray = [];
  } else if (Array.isArray(items)) {
    itemsArray = items;
  } else {
    itemsArray = [items];
  }

  const effectiveTotal = total !== undefined ? total : itemsArray.length;
  const effectiveLimit = limit !== undefined ? limit : (itemsArray.length > 0 ? itemsArray.length : 1);

  return {
    data: {
      items: itemsArray,
      total: effectiveTotal,
      page,
      limit: effectiveLimit,
    },
    error: null,
  };
}

/**
 * Creates an error response adhering to the exact same contract.
 */
export function formatApiErrorResponse<T = never>(
  errorMessage: string,
  page: number = 1,
  limit: number = 0
): ApiResponse<T> {
  return {
    data: {
      items: [],
      total: 0,
      page,
      limit,
    },
    error: errorMessage,
  };
}
