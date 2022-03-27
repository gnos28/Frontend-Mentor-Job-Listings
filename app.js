let dropDownItems = [];
let inputValue = "";
let filterList = [];
let renderedList = [];
let rawDatas = [];

const renderList = (list) => {
  console.log(list);
  const content = document.querySelector(".content");
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => card.remove());

  list.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const divIcon = document.createElement("div");
    divIcon.classList.add("icon");
    const img = document.createElement("img");
    img.src = item.logo.substring(2);
    img.alt = "logo";
    divIcon.appendChild(img);
    card.appendChild(divIcon);

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");
    const h2 = document.createElement("h2");
    h2.innerText = item.company;
    cardHeader.appendChild(h2);
    if (item.new) {
      const spanNew = document.createElement("span");
      spanNew.classList.add("hint", "new");
      spanNew.innerText = "NEW !";
      cardHeader.appendChild(spanNew);
    }
    if (item.featured) {
      const spanFeatured = document.createElement("span");
      spanFeatured.classList.add("hint", "featured");
      spanFeatured.innerText = "FEATURED";
      cardHeader.appendChild(spanFeatured);
    }
    card.appendChild(cardHeader);

    const position = document.createElement("div");
    position.classList.add("position");
    position.innerText = item.position;
    card.appendChild(position);

    const infos = document.createElement("div");
    infos.classList.add("infos");
    const postedAt = document.createElement("span");
    postedAt.innerText = item.postedAt;
    const contract = document.createElement("span");
    contract.innerText = item.contract;
    const location = document.createElement("span");
    location.innerText = item.location;
    infos.appendChild(postedAt);
    infos.appendChild(contract);
    infos.appendChild(location);
    card.appendChild(infos);

    const tags = document.createElement("div");
    tags.classList.add("tags");
    item.languages.forEach((language) => {
      const tag = document.createElement("span");
      tag.classList.add("tag");
      tag.innerText = language;
      tags.appendChild(tag);
    });
    item.tools.forEach((tool) => {
      const tag = document.createElement("span");
      tag.classList.add("tag");
      tag.innerText = tool;
      tags.appendChild(tag);
    });
    card.appendChild(tags);

    content.appendChild(card);
  });
};

const clearAll = () => {
  filterList = [];
  const inputItems = document.querySelectorAll(".input-item");
  inputItems.forEach((item) => item.remove());

  updateRenderedList();

  renderList(renderedList);
};

const setFocus = () => {
  const inputInput = document.querySelector(".input-input");
  inputInput.focus();
};

const handleUnselect = (e) => {
  const toDel = e.target.parentElement.value;
  filterList = filterList.filter((item) => item !== toDel);

  const inputItems = document.querySelectorAll(".input-item");
  inputItems.forEach((item) => {
    if (item.children[0].textContent === toDel) item.remove();
  });

  updateRenderedList();

  renderList(renderedList);
};

const updateRenderedList = () => {
  renderedList = rawDatas.filter((raw) => {
    let toKeep = false;

    if (!filterList.length) toKeep = true;

    const entries = Object.entries(raw);
    entries.forEach((entry) => {
      if (typeof entry[1] !== "object") {
        if (filterList.includes(entry[1])) toKeep = true;
      } else {
        entry[1].forEach((v) => {
          if (filterList.includes(v)) toKeep = true;
        });
      }
    });
    return toKeep;
  });
};

const addInput = (input) => {
  // rajouter un check pour vérifier qu'on ajoute pas un élement déjà présent dans la liste

  const inputInput = document.querySelector(".input-input");
  const inputInputContainer = document.querySelector(".input-input-container");

  const inputContainer = document.querySelector(".input-container");
  const inputItem = document.createElement("div");
  inputItem.classList.add("input-item");
  inputItem.contentEditable = false;
  inputItem.value = input;
  const span = document.createElement("span");
  span.innerText = input;
  const unselectItem = document.createElement("div");
  unselectItem.classList.add("input-item-unselect");
  unselectItem.innerText = "x";
  unselectItem.addEventListener("click", handleUnselect);

  inputItem.appendChild(span);
  inputItem.appendChild(unselectItem);
  inputContainer.insertBefore(inputItem, inputInputContainer);

  inputInput.value = "";

  filterList.push(input);

  updateRenderedList();

  renderList(renderedList);
};

const formSubmit = (e) => {
  e.preventDefault();
  addInput(e.target[0].value);
};

const errorAnimation = () => {
  console.log("errorAnimation");

  const formDiv = document.querySelector("form > div")
  formDiv.classList.add("errorAnimation")
  window.setTimeout(() => {
    formDiv.classList.remove("errorAnimation")
  }, 800)
};

const updateDropDownItems = (list) => {
  const inputDropDown = document.querySelector(".inputDropDown");
  while (inputDropDown.firstChild)
    inputDropDown.removeChild(inputDropDown.firstChild);

  list.forEach((item, index) => {
    if (index < 5) {
      const span = document.createElement("span");
      span.innerText = item;
      inputDropDown.appendChild(span);
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

      let inFilterList = false;
      filterList.forEach((filterItem) => {
        if (filterItem.toLowerCase() === dropDownItems[i].toLowerCase())
          inFilterList = true;
      });

      if (!inFilterList) dropDownList.push(dropDownItems[i]);
    }

  if (!dropDownList.length) {
    errorAnimation();
    e.target.value = newInput.substring(0, newInput.length - 1);
  }

  updateDropDownItems(dropDownList);
};

fetch("./data.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    rawDatas = data;
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

      renderedList.push(element);
    });

    dropDownItems = [...new Set(dropDownItems)];

    dropDownItems.sort();

    document
      .querySelector(".input-input")
      .addEventListener("keyup", handleKeyup);

    document.querySelector("form").addEventListener("submit", formSubmit);

    document.querySelector("form > div").addEventListener("click", setFocus);

    document.querySelector(".input-clear").addEventListener("click", clearAll);

    renderList(renderedList);
  });

// CUSTOM DATA LIST

$(document).on("dblclick", "input[list]", function (event) {
  event.preventDefault();
  var str = $(this).val();
  $("div[list=" + $(this).attr("list") + "] span").each(function (k, obj) {
    if ($(this).html().toLowerCase().indexOf(str.toLowerCase()) < 0) {
      $(this).hide();
    }
  });
  $("div[list=" + $(this).attr("list") + "]").toggle(100);
  $(this).focus();
});

$(document).on("blur", "input[list]", function (event) {
  event.preventDefault();
  var list = $(this).attr("list");
  setTimeout(function () {
    $("div[list=" + list + "]").hide(100);
  }, 100);
});

$(document).on("click", "div[list] span", function (event) {
  event.preventDefault();
  var list = $(this).parent().attr("list");
  var item = $(this).html();

  $("input[list=" + list + "]").val(item);
  $("div[list=" + list + "]").hide(100);

  addInput(item);
});

$(document).on("keydown", "input[list]", function (event) {
  if (event.which == 8) {
    if (!event.target.value.length) {
      // pop dernier element filterList
      const deleted = filterList.pop();
      // effacer dernier element du DOM
      const inputItems = document.querySelectorAll(".input-item");
      inputItems.forEach((item) => {
        if (item.children[0].textContent === deleted) item.remove();
      });
    }

    $(this).focus();
  }
});

$(document).on("keyup", "input[list]", function (event) {
  event.preventDefault();

  var list = $(this).attr("list");
  var divList = $("div[list=" + $(this).attr("list") + "]");

  if (event.which == 27) {
    // esc
    $(divList).hide(200);
    $(this).focus();
  } else if (event.which == 13) {
    // enter
    if ($("div[list=" + list + "] span:visible").length == 1) {
      var str = $("div[list=" + list + "] span:visible").html();
      $("input[list=" + list + "]").val(str);
      $("div[list=" + list + "]").hide(100);
      // console.log("enter", str);
    }
  } else if (event.which == 9) {
    // tab
    $("div[list]").hide();
  } else {
    $("div[list=" + list + "]").show(100);
    var str = $(this).val();
    $("div[list=" + $(this).attr("list") + "] span").each(function () {
      if ($(this).html().toLowerCase().indexOf(str.toLowerCase()) < 0) {
        $(this).hide(200);
      } else {
        $(this).show(200);
      }
    });
    // console.log("other", str)
  }
  // console.log("divList", divList)
});
