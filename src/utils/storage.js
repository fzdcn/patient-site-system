/**
 * Set storage
 *
 * @param store
 *
 */
export const setStorage = (store) => {
  const newStore = store || {};
  Object.keys(newStore).forEach((key) => {
    const value = typeof newStore[key] === 'string' ? newStore[key] : JSON.stringify(newStore[key]);
    window.sessionStorage.setItem(key, value);
  });
};

/**
 * Get storage
 *
 * @param name
 * @returns {*}
 */
export const getStorage = (name) => {
  const content = window.sessionStorage.getItem(name);

  try {
    return JSON.parse(content);
  } catch (e) {
    return content;
  }
};

/**
 * Remove storage
 *
 * @param name
 */
export const removeStorage = (name) => {
  window.sessionStorage.removeItem(name);
};

/**
 * Clear all storage
 */
export const clearStorage = () => {
  window.sessionStorage.clear();
};
