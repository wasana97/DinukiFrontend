export const removeEmptyKeys = obj => {
  Object.entries(obj).forEach(
    ([key, val]) =>
      (val && typeof val === "object" && removeEmptyKeys(val)) ||
      ((val === null || val === "" || val === undefined) && delete obj[key])
  );
  return obj;
};
