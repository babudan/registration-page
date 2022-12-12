const isValid = function (value) {
    if (typeof value === undefined || value == null || value.length == 0) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "string")
    return true;
  };

  const isNumber = function (number) {
  if (/^[0-9]/.test(number)) return true;
  return false;
};

  const isValidNumber = function (number) {
    if (/^[0]?[6789]\d{9}$/.test(number)) return true;
    return false;
  };

  const isValidEmail = function (mail) {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail)) return true;
      return false;
  };

  const isValidName = function (string) {
    let regex = /^[a-zA-Z ]+$/;
    if (regex.test(string)) {
        return true;
    }
    return false;
};

const isValidadress = function (name) {
    if (/^[a-z ,.'-]+$/i.test(name)) return true;
    return false;
  };

  const isValidPassword = function (password) {
    if(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,100}$/.test(password)) return true;
    return false;
  };

  module.exports = {isValid,isValidEmail,isValidName,isValidadress,isValidNumber,isValidPassword,isNumber}