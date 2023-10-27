import React from 'react';

/**
 * Custom React Hook for managing URL search parameters.
 */
export function useSearchParams() {
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
  const get = (key: string) => searchParams.get(key);

  /**
   * Set the value of a search parameter and update the URL.
   *
   * @param key - The search parameter key.
   * @param value - The new value for the search parameter.
   */
  const set = (key: string, value: string) => {
    searchParams.set(key, value);

    // Update the URL without a page refresh
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  /**
   * Get all search parameters as an object.
   *
   * @returns An object containing all search parameters.
   */
  const getAll = () => {
    const params: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  const setAll = (params: { [key: string]: string }) => {
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        searchParams.set(key, params[key]);
      }
    }
    updateUrl(searchParams);
  };

  // Helper function to update the URL without a page refresh
  const updateUrl = (newSearchParams: URLSearchParams) => {
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  return { get, set, getAll, setAll };
}
