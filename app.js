let dropDownItems = [];
let inputValue = "";

const errorAnimation = () => {
  console.log("errorAnimation");
};

const updateDropDownItems = (list) => {
  const inputDropDown = document.querySelector(".inputDropDown");
  while (inputDropDown.firstChild)
    inputDropDown.removeChild(inputDropDown.firstChild);

  list.forEach((item, index) => {
    if (index < 5) {
      const option = document.createElement("option");
      option.value = item;
      inputDropDown.appendChild(option);
    }
  });
};

const handleKeyup = (e) => {
  const newInput = e.target.value;
  let inDropDownItems = false;
  const dropDownList = [];

  for (let i = 0; i < dropDownItems.length; i++)
    if (dropDownItems[i].toLowerCase().includes(newInput.toLowerCase())) {
      inDropDownItems = true;
      dropDownList.push(dropDownItems[i]);
    }

  if (!dropDownList.length) {
    errorAnimation();
    e.target.value = newInput.substring(0, newInput.length - 1);
  }

  updateDropDownItems(dropDownList);

  console.log(dropDownList);
};

fetch("./data.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.forEach((element) => {
      dropDownItems.push(element.company);
      dropDownItems.push(element.contract);
      element.languages.forEach((language) => dropDownItems.push(language));
      dropDownItems.push(element.level);
      dropDownItems.push(element.location);
      dropDownItems.push(element.position);
      dropDownItems.push(element.postedAt);
      dropDownItems.push(element.role);
      element.tools.forEach((tool) => dropDownItems.push(tool));
    });

    dropDownItems = [...new Set(dropDownItems)];

    dropDownItems.sort();

    document
      .querySelector(".input-input")
      .addEventListener("keyup", handleKeyup);
  });
