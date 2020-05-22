export const isInt = val =>
  !isNaN(val) &&
  !/^0.+/gi.test(val) &&
  (Number.isInteger(val) ||
    (typeof val === "string" && "" + parseInt(val, 10) === val));

export const isFloat = val =>
  !isNaN(val) &&
  !isInt(val) &&
  !/^0[^.]+/gi.test(val) &&
  val.toString().length > 0;

export const isColor = val => /^#?[0-9A-F]{6}$/i.test(val);

export const autoCast = value => {
  if (!value) {
    return value;
  }

  if (isColor(value)) {
    return ("#" + value).replace("##", "#");
  }

  if (isInt(value)) {
    return parseInt(value, 10);
  }

  if (isFloat(value)) {
    return parseFloat(value);
  }

  if (value.toLowerCase() === "true") {
    return true;
  }

  if (value.toLowerCase() === "false") {
    return false;
  }

  return value;
};

export const castString = str => {
  if (typeof str !== "string" && !(str instanceof String)) {
    str = "" + str;
  }

  return str.toLowerCase();
};

export const isEmail = email => {
  const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(email);
};

export const isNic = nic => {
  const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(nic);
};
