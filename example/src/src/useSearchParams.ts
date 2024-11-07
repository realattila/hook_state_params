import React from 'react';
import type { urlUpdateType } from './types';

const revalidateParam = (param: string[]) => {
  const length = param.length;
  switch (length) {
    case 0:
      return '';
    case 1:
      return param[0];
    default:
      return param;
  }
};
/**
 * Parameters for the useSearchParams function.
 */
type Params = {
  urlUpdateType: urlUpdateType;
};

/**
 * A custom hook for managing and interacting with URL search parameters.
 *
 * @param params - Parameters for configuring the behavior of the hook.
 * @returns An object containing functions to get, set, get all, and set all search parameters.
 */
export function useSearchParams({ urlUpdateType }: Params) {
  const [searchParams, setSearchParams] = React.useState(
    new URLSearchParams(window.location.search)
  );

  React.useEffect(() => {
    /**
     * Event handler to update search parameters when the URL changes.
     */
    const updateSearchParams = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    // Listen for changes in the URL
    window.addEventListener('popstate', updateSearchParams);

    return () => {
      // Clean up the event listener
      window.removeEventListener('popstate', updateSearchParams);
    };
  }, []);

  /**
   * Get the value of a specific search parameter.
   *
   * @param key - The search parameter key.
   * @returns The value of the search parameter, or null if not found.
   */
  const get = (key: string) => revalidateParam(searchParams.getAll(key));

  /**
   * Set the value of a search parameter and update the URL.
   *
   * @param key - The search parameter key.
   * @param value - The new value for the search parameter.
   */
  const set = (key: string, value: string) => {
    const tempSearchParams = new URLSearchParams(searchParams);
    tempSearchParams.set(key, value);
    updateUrl(tempSearchParams);
  };

  /**
   * Get all search parameters as an object.
   *
   * @returns An object containing all search parameters.
   */
  const getAll = React.useCallback(() => {
    const params: { [key: string]: string | string[] } = {};
    searchParams.forEach((_value, key) => {
      if (!params[key]) {
        params[key] = revalidateParam(searchParams.getAll(key));
      }
    });
    return params;
  }, [searchParams]);

  /**
   * Set multiple search parameters and update the URL.
   *
   * @param params - An object containing key-value pairs to set as search parameters.
   */
  const setAll = (params: { [key: string]: string }) => {
    const tempSearchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      tempSearchParams.set(key, value);
    });
    updateUrl(tempSearchParams);
  };

  // Helper function to update the URL without a page refresh
  const updateUrl = (newSearchParams: URLSearchParams) => {
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
    if (urlUpdateType === 'push') {
      window.history.pushState({}, '', newUrl);
    } else {
      window.history.replaceState({}, '', newUrl);
    }
  };

  return { get, set, getAll, setAll, searchParams };
}
