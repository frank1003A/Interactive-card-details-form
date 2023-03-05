"use-strict";

// Card Holder Number
const numberoutput = document.getElementById("output-number");
const cardnumber = document.getElementById("card_number");
const numberFormatError = document.getElementById("cardnumberinstructions");

// Card Holder Name
const cardholder_name = document.getElementById("cardholder_name");
const cardname_output = document.getElementById("output-name");
const nameFormatError = document.getElementById("cardholdernameinstructions");

// Card Expiration
const cardexpr_month = document.getElementById("expiration_month");
const cardexpr_year = document.getElementById("expiration_year");
const exprFormatError = document.getElementById("expirationdateinstruction");
const cardexprmnth_output = document.querySelector(".mm");
const cardexpryr_output = document.querySelector(".yy");

// Card CVC
const card_cvc = document.getElementById("card_cvc");
const cardcvc_output = document.getElementById("output-cvc");
const cvcFormatError = document.getElementById("cardcvcinstructions");
const exprDateContainer = document.getElementById("exprdatescontainer");

//
const form = document.getElementById("card-info");

//
const completePage = document.getElementById("thankyou");

//
const button = document.getElementById("submitbtn");

// display none for each of the format error
numberFormatError.style.display = "none";
nameFormatError.style.display = "none";
exprFormatError.style.display = "none";
cvcFormatError.style.display = "none";

let isValuesLengthValid = false;

const updateElement = (el, value) => {
  el.innerHTML = value;
};

//
const outputs = new Map(
  Object.entries([
    {
      name: "cardholdername",
      default: "Jane Appleseed",
    },
    { name: "cardnumber", default: "0000 0000 0000 0000" },
    { name: "expirymonth", default: "mm" },
    { name: "expiryyear", default: "yy" },
    { name: "cardcvc", default: "123" },
  ])
);

const form_regex = [
  {
    form: form["cardholder_name"],
    regex: /(\d)/g,
  },
  {
    form: form["card_number"],
    regex: /[^0-9 ]/g,
  },
  {
    form: form["expiration_month"],
    regex: /[^0-9 ]/g,
  },
  {
    form: form["expiration_year"],
    regex: /[^0-9 ]/g,
  },
  {
    form: form["card_cvc"],
    regex: /[^0-9 ]/g,
  },
];

const handleCardRenders = (currentvalue, category) => {
  let foundMatch = false;
  for (const value of outputs.values()) {
    if (value.name === category) {
      foundMatch = true;
      return currentvalue !== "" || currentvalue == undefined
        ? currentvalue
        : value.default;
    }
  }
  if (!foundMatch) {
    return "invalid";
  }
};

const toggleTextContent = (element, textContent) => {
  let text = element.innerHTML;
  if (element !== undefined) {
    element.innerHTML = textContent;
  } else {
    element.innerHTML = text;
  }
};

const toggleErrorElement = (condition, currentel) => {
  if (condition === true) {
    currentel.nextElementSibling.style.display = "block";
    currentel.nextElementSibling.style.visibility = "visible";
    currentel.nextElementSibling.style.opacity = "1";
    currentel.nextElementSibling.style.color = "#ff5252";
    currentel.style.borderColor = "#ff5252";
  } else {
    currentel.nextElementSibling.style.display = "none";
    currentel.nextElementSibling.style.visibility = "hidden";
    currentel.nextElementSibling.style.opacity = "0";
    currentel.nextElementSibling.style.borderColor = "revert";
    currentel.style.borderColor = "";
  }
};

function patternMatch({ input, template }) {
  try {
    let j = 0;
    let plaintext = "";
    let countj = 0;
    while (j < template.length) {
      if (countj > input.length - 1) {
        template = template.substring(0, j);
        break;
      }

      if (template[j] == input[j]) {
        j++;
        countj++;
        continue;
      }

      if (template[j] == "x") {
        template =
          template.substring(0, j) + input[countj] + template.substring(j + 1);
        plaintext = plaintext + input[countj];
        countj++;
      }
      j++;
    }

    return template;
  } catch {
    return "";
  }
}

cardholder_name.addEventListener("input", function (e) {
  const regex = /(\d)|\./g;
  const value = e.target.value;
  let test1 = regex.test(value);
  if (test1) {
    toggleTextContent(this.nextElementSibling, "Wrong format - letters only");
  } else {
    updateElement(cardname_output, handleCardRenders(value, "cardholdername"));
  }
  toggleErrorElement(test1, this);
});

cardnumber.addEventListener("input", function (e) {
  const regex = /[^0-9 ]/g;
  const formatedvalue = patternMatch({
    input: e.target.value,
    template: "xxxx xxxx xxxx xxxx",
  });
  const value = e.target.value;
  this.value = formatedvalue;
  let test1 = regex.test(value);
  if (test1) {
    toggleTextContent(this.nextElementSibling, "wrong format, numbers only");
  } else {
    updateElement(numberoutput, handleCardRenders(formatedvalue, "cardnumber"));
  }
  toggleErrorElement(test1, this);
});

cardnumber.addEventListener("focusout", function () {
  validateValueLength(this, 16);
});

cardexpr_month.addEventListener("input", function (e) {
  const regex = /[^0-9 ]/g;
  const value = e.target.value;
  let test1 = regex.test(value);
  if (test1) {
    toggleTextContent(exprFormatError, "wrong format, numbers only");
  } else {
    updateElement(cardexprmnth_output, handleCardRenders(value, "expirymonth"));
  }
  toggleExpiryDates(test1, exprFormatError, this);
});

cardexpr_month.addEventListener("focusout", function () {
  validateExpiryDateValuesLength(this, exprFormatError, 2);
});

cardexpr_year.addEventListener("input", function (e) {
  let regex = /[^0-9 ]/g;
  const value = e.target.value;
  let test1 = regex.test(value);
  if (test1) {
    toggleTextContent(exprFormatError, "wrong format, numbers only");
  } else {
    updateElement(cardexpryr_output, handleCardRenders(value, "expiryyear"));
  }
  toggleExpiryDates(test1, exprFormatError, this);
});

cardexpr_year.addEventListener("focusout", function () {
  validateExpiryDateValuesLength(this, exprFormatError, 2);
});

card_cvc.addEventListener("keyup", function (e) {
  const value = e.target.value;
  if (/[^0-9 ]/g.test(value)) {
    toggleTextContent(this.nextElementSibling, "wrong format, numbers only");
  } else {
    updateElement(cardcvc_output, handleCardRenders(value, "cardcvc"));
  }
  toggleErrorElement(/[^0-9 ]/g.test(value), this);
});

card_cvc.addEventListener("focusout", function () {
  validateValueLength(this, 3);
});

const toggleBlankOnConfirm = (el, errorEl, text) => {
  if (el.value == "") toggleTextContent(errorEl, text);
  toggleErrorElement(el.value == "", el);
};

const checkExpiryDatesBlank = (el, errorEl, text) => {
  if (el.value == "") toggleTextContent(errorEl, text);
  toggleExpiryDates(el.value == "", exprFormatError, el);
};

const noConditionErrorToggle = (input_element) => {
  input_element.nextElementSibling.style.display = "block";
  input_element.nextElementSibling.style.visibility = "visible";
  input_element.nextElementSibling.style.opacity = "1";
  input_element.nextElementSibling.style.color = "#ff5252";
  input_element.style.borderColor = "#ff5252";
};

const noConditionSuccessToggle = (input_element) => {
  input_element.nextElementSibling.style.display = "none";
  input_element.nextElementSibling.style.visibility = "hidden";
  input_element.nextElementSibling.style.opacity = "0";
  input_element.nextElementSibling.style.borderColor = "revert";
  input_element.style.borderColor = "";
};

const toggleExpiryDates = (condition, label_element, input_element) => {
  if (condition) {
    label_element.style.display = "block";
    label_element.style.visibility = "visible";
    label_element.style.opacity = "1";
    label_element.style.color = "#ff5252";
    input_element.style.borderColor = "#ff5252";
  } else {
    label_element.style.display = "none";
    label_element.style.visibility = "hidden";
    label_element.style.opacity = "0";
    label_element.style.borderColor = "revert";
    input_element.style.borderColor = "";
  }
};

const validateValueLength = (input_element, length) => {
  const numbersLength = input_element.value.split(/[ ]/g).join("").length;
  if (/[ ]/g.test(input_element.value)) {
    if (input_element.value.length > 0 && numbersLength < length) {
      toggleTextContent(
        input_element.nextElementSibling,
        `number cannot be less than ${length}`
      );
      noConditionErrorToggle(input_element);
    } else {
      noConditionSuccessToggle(input_element);
    }
  } else {
    if (input_element.value.length > 0 && input_element.value.length < length) {
      toggleTextContent(
        input_element.nextElementSibling,
        `number cannot be less than ${length}`
      );
      noConditionErrorToggle(input_element);
    } else {
      noConditionSuccessToggle(input_element);
    }
  }
};

const validateExpiryDateValuesLength = (
  input_element,
  toggleElement,
  length
) => {
  if (input_element.value.length > 0 && input_element.value.length < length) {
    toggleTextContent(toggleElement, `number cannot be less than ${length}`);
    noConditionErrorToggle(exprDateContainer);
    input_element.style.borderColor = "#ff5252";
  } else {
    noConditionSuccessToggle(exprDateContainer);
    input_element.style.borderColor = "";
  }
};

const isComplete = () => {
  let isFormComplete = false;
  if (
    form["cardholder_name"].value == "" ||
    form["card_number"].value == "" ||
    form["expiration_month"].value == "" ||
    form["expiration_year"].value == "" ||
    form["card_cvc"].value == ""
  ) {
    isFormComplete = false;
  } else {
    isFormComplete = true;
  }
  return isFormComplete;
};

const isValid = () => {
  let isFormValid = false;
  let formValidationArray = [];
  for (let i = 0; i < form_regex.length; i++) {
    if (i !== 2 && i !== 3) {
      if (form_regex[i].form.value.match(form_regex[i].regex) == null) {
        isFormValid = true;
        formValidationArray = [...formValidationArray, isFormValid];
        noConditionSuccessToggle(form_regex[i].form);
      } else {
        isFormValid = false;
        formValidationArray = [...formValidationArray, isFormValid];
        noConditionErrorToggle(form_regex[i].form);
      }
    }
  }
  if (formValidationArray.includes(false)) isFormValid = false;
  return isFormValid;
};

const isExpiryDatesValid = (index) => {
  let isFormValid = false;
  let formValidationArray = [];
  let iterator = [2, 3];
  for (let i = 0; i < iterator.length; i++) {
    if (
      form_regex[iterator[i]].form.value.match(form_regex[iterator[i]].regex) ==
      null
    ) {
      isFormValid = true;
      formValidationArray = [...formValidationArray, isFormValid];
      noConditionSuccessToggle(exprDateContainer);
    } else {
      isFormValid = false;
      formValidationArray = [...formValidationArray, isFormValid];
      noConditionErrorToggle(exprDateContainer);
    }
  }
  if (formValidationArray.includes(false)) isFormValid = false;
  return isFormValid;
};

const isBlank = () => {
  for (let i = 0; i < form.elements.length - 1; i++) {
    if (i !== 2 && i !== 3) {
      toggleBlankOnConfirm(
        form.elements[i],
        form.elements[i].nextElementSibling,
        `${form.elements[i].title} can't be blank`
      );
    }
  }
};

const isBlankExpiryDates = () => {
  checkExpiryDatesBlank(
    form["expiration_month"],
    exprFormatError,
    "can't be blank"
  );
  checkExpiryDatesBlank(
    form["expiration_year"],
    exprFormatError,
    "can't be blank"
  );
};

const isFormValueLengthValid = () => {
  let isValid = false;
  let lengths = [16, 3];
  let iterator = [1, 4];
  let validationArray = [];
  for (let i = 0; i < iterator.length; i++) {
    if (i == 0) {
      let currentLength = form.elements[iterator[i]].value
        .split(/[ ]/g)
        .join("").length;
      if (currentLength < lengths[i])
        validationArray = [...validationArray, isValid];
    }
    if ((i = 1)) {
      let currentLength = form.elements[iterator[i]].value.length;
      if (currentLength < lengths[i])
        validationArray = [...validationArray, isValid];
    }
  }
  validationArray.length > 0 ? (isValid = false) : (isValid = true);
  return isValid;
};

const isExpiryDatesLengthValid = () => {
  let isValid = false;
  let iterator = [2, 3];
  let validationArray = [];
  for (let i = 0; i < iterator.length; i++) {
    let currentLength = form.elements[iterator[i]].value.length;
    if (currentLength < 2)
      validationArray = [...validationArray, isValid];
  }
  validationArray.length > 0 ? (isValid = false) : (isValid = true);
  return isValid;
}

const moveToNextPage = () => {
  if (
    isComplete() &&
    isValid() &&
    isExpiryDatesValid() &&
    isFormValueLengthValid() && 
    isExpiryDatesLengthValid()
  ) {
    form.style.display = "none";
    completePage.classList.remove("thankyoupage");
    completePage.classList.add("thankyoupage-visible")
  } else {
    alert("invalid-form");
    return;
  }
};

form.addEventListener("submit", function (event) {
  // stop form submission
  event.preventDefault();

  // form submit validations
  isBlank();
  isBlankExpiryDates();
  moveToNextPage();
});
