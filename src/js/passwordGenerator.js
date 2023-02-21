export function passwordGenerator() {
  //init
  let password = "";
  let generatorProps = {
    characterLength: 6,
    includeUppercase: false,
    includeLowercase: false,
    includeNumber: false,
    includeSymbol: false,
  };
  let extraSafe = [];

  //init
  const copyBtn = document.querySelector(".copy-button");
  const outputPassword = document.querySelector(".output-password");
  const characterInputValue = document.querySelector(".slider-input-value");
  const characterInputRange = document.querySelector(
    "input[name = 'characterLength']"
  );
  const additionalOptions = document.querySelectorAll(
    ".additional-options input[type=checkbox]"
  );
  const strengthLeves = document.querySelectorAll(".strength-levels .level");
  const generateButton = document.querySelector(".generate-button");

  //functions
  function init() {
    console.log("password generator - init");
    enableRangeInput();
    enabledditionalOptions();
    enableButtons();
    strengthLevel();
  }
  function enableButtons() {
    copyBtn.addEventListener("click", copyToClipboard);
    generateButton.addEventListener("click", generatePassword);
  }
  function updateOutputPassword(newPassword) {
    outputPassword.textContent = newPassword;
  }
  function updateCharacterLenghtValue(newValue) {
    characterInputValue.textContent = newValue;
  }
  function handleRangeInput(e) {
    const maxValue = e.target.max;
    const currentValue = e.target.value;
    const value = (currentValue * 100) / maxValue;

    strengthLevel();
    updateGeneratorProps(e);
    updateCharacterLenghtValue(e.target.value);
    e.target.style.backgroundSize = value + "%";
  }
  function updateGeneratorProps(e) {
    const isCheckbox = e.target.type === "checkbox";

    if (isCheckbox && e.target.checked) {
      extraSafe.push(e.target.name);
    } else {
      extraSafe = extraSafe.filter((item) => item !== e.target.name);
    }
    generatorProps[e.target.name] = isCheckbox
      ? e.target.checked
      : parseInt(e.target.value);

    strengthLevel();
  }
  function strengthLevel() {
    const points = generatorProps.characterLength + 5 * extraSafe.length;

    updateStrengthLevel(
      points < 5
        ? 0
        : points < 15
        ? 1
        : points < 20
        ? 2
        : points < 28
        ? 3
        : points < 34
        ? 4
        : 5
    );

    generateButton.disabled = generatorProps.characterLength < 4;
  }
  function updateStrengthLevel(level) {
    //clear
    strengthLeves.forEach((item) => (item.style.background = "transparent"));

    //add level
    strengthLeves.forEach((item, index) => {
      if (index < level) item.style.background = "white";
    });
  }
  function enabledditionalOptions() {
    additionalOptions.forEach((option) =>
      option.addEventListener("click", updateGeneratorProps)
    );
  }
  function generatePassword() {
    const newPass = passwordEngine(generatorProps);
    updateOutputPassword(newPass);
  }
  function enableRangeInput() {
    characterInputRange.addEventListener("input", handleRangeInput);
  }
  function copyToClipboard() {
    const copy = outputPassword.textContent;

    navigator.clipboard
      .writeText(outputPassword.textContent)
      .then(() => {
        outputPassword.textContent = "Copied!";
        console.log("Text successfully copied to clipboard");
        setTimeout(() => {
          outputPassword.textContent = copy;
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy text to clipboard: ", err);
      });
  }
  function passwordEngine({
    characterLength,
    includeUppercase,
    includeLowercase,
    includeNumber,
    includeSymbol,
  }) {
    const CHARSETS = [];

    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeNumber &&
      !includeSymbol
    ) {
      CHARSETS.push("abcdefghijklmnopqrstuvwxyz");
    }

    if (includeUppercase) {
      CHARSETS.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }
    if (includeLowercase) {
      CHARSETS.push("abcdefghijklmnopqrstuvwxyz");
    }
    if (includeNumber) {
      CHARSETS.push("0123456789");
    }
    if (includeSymbol) {
      CHARSETS.push('!@#$%^&*()_+-=[]{}|;:,.<>?/~`"');
    }

    if (CHARSETS.length === 0) {
      return "";
    }

    let password = "";
    let remainingChars = characterLength;

    while (remainingChars > 0) {
      const charSet = CHARSETS[Math.floor(Math.random() * CHARSETS.length)];
      const charIndex = Math.floor(Math.random() * charSet.length);
      password += charSet.charAt(charIndex);
      remainingChars--;
    }

    return password;
  }

  return {
    init: init,
  };
}
