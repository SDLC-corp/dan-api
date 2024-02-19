const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const emailCustom = (value, helpers) => {
  const passRE = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");

  if (!passRE.test(value)) {
    return helpers.message('Please Enter Valid Email.');
  }
  return value;
};

const customCountryChk = (value, helpers) => {
  if(!value){
    return helpers.message('Please Enter Country Name.');
  }
  if (value && value.toLowerCase() == "country") {
    return helpers.message('Please Enter Valid Country Name.');
  }
  return value;
};

module.exports = {
  objectId,
  password,
  emailCustom,
  customCountryChk
};
