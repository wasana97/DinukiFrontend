export const unique = (array) => {
    return array.filter((elem, pos, arr) => {
      return arr.indexOf(elem) == pos;
    });
};
