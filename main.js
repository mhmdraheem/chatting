let massageArea = document.querySelector(".massaging");
let contactsMenu = document.querySelector(".contacts-menu");
let contacts = document.querySelector(".contacts");
const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et excepturi deleniti laboriosam praesentium reiciendis earum. Tempora, reiciendis aperiam illum quis eos aliquam vel officiis quasi delectus. Rem unde molestiae tenetur fugiat repellendus natus sit similique dolores et! Qui, doloremque suscipit, voluptatem vel optio blanditiis officia harum modi labore, cum nihil! Amet maiores repudiandae velit ex, blanditiis, adipisci laudantium sed sapiente earum laboriosam quaerat fugiat quis, minus ut suscipit dignissimos ratione? Doloremque, debitis, nisi sequi, corrupti ex fugiat ea laboriosam numquam in sunt architecto fuga inventore! Consequuntur eligendi deleniti minima explicabo, nulla reiciendis quidem eius modi! Et optio labore sapiente aliquam temporibus, voluptatem fugit dolorum voluptatibus veniam dicta rem eos nostrum, veritatis vero officia aspernatur nulla fugiat? Quae corporis ipsum nobis harum perspiciatis sapiente, dolor libero vel dolorum consectetur, dolore reprehenderit facilis dicta! Eligendi deleniti molestias quae molestiae porro quibusdam voluptate laboriosam fugiat laborum necessitatibus facere maxime ratione maiores expedita vel voluptates quisquam corporis, minus inventore. Accusantium maiores exercitationem laudantium repudiandae, eligendi debitis voluptatem error ab facere sequi esse soluta animi eius doloribus et earum suscipit dolorem aperiam quod nam temporibus perspiciatis praesentium. Voluptate reprehenderit nam eius non sit delectus deleniti hic, molestias unde numquam praesentium ullam iusto asperiores et enim labore recusandae. Voluptates odio officia, sed amet sapiente at atque labore quas aliquid? Nemo quis veritatis nisi quisquam eos doloribus illum possimus! Ullam officiis quis consequatur tempore. Quod inventore impedit, eos excepturi ducimus quasi saepe iure. Excepturi deleniti consectetur, nisi obcaecati et quod aliquid officiis est eligendi perferendis, fugit voluptate itaque fugiat eos! Assumenda rerum praesentium repellat quia cum! Totam doloremque corrupti at quibusdam beatae praesentium quidem debitis rerum sit, odio repellat, autem voluptatem doloribus? Aliquid at illum repudiandae praesentium debitis omnis vero tempore odit, corrupti dignissimos, aspernatur aperiam. Alias, blanditiis adipisci quos atque quo sunt et tempora ducimus eos.";

const myId = "1001";
let chats = {};
let activeDataModel;

setDataModel()
  .then((dataModel) => renderContactsMenu(dataModel))
  .then(() => registerFooterCallbacks());

adjustDisplay();
window.addEventListener("resize", adjustDisplay);

async function setDataModel() {
  let json;
  if (localStorage.getItem("chats")) {
    json = JSON.parse(localStorage.getItem("chats"));
  } else {
    json = await loadJsonDocument("./chats.json");
    persist(json);
  }
  chats = json;
  return json;
}

async function loadJsonDocument(filename) {
  let file = await fetch(filename);
  return file.json();
}

function persist(json) {
  localStorage.setItem("chats", JSON.stringify(json));
}

function renderContactsMenu(chatsMap) {
  Object.entries(chatsMap).forEach((json) => {
    let contactRow = createContactsRow(json);
    contacts.appendChild(contactRow);
  });

  document.querySelector(".contacts-menu .header input").onkeyup = () => {
    filterContacts();
  };
}

function createContactsRow(json) {
  let key = json[0];
  let obj = json[1];

  let id = document.createElement("div");
  id.classList.add("id");
  id.style.display = "none";
  id.innerHTML = key;

  let name = document.createElement("div");
  name.classList.add("name");
  name.innerHTML = obj.contact.name;

  let lastMessage = obj.messages[obj.messages.length - 1];
  let msg = document.createElement("div");
  msg.classList.add("msg");
  if (lastMessage) {
    msg.innerHTML = lastMessage.text;
  } else {
    msg.innerHTML = "";
  }

  let contact = document.createElement("div");
  contact.classList.add("contact");
  contact.appendChild(name);
  contact.appendChild(msg);

  let avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = "img/" + obj.contact.avatar;

  let date = document.createElement("span");
  date.classList.add("date");
  if (lastMessage) {
    date.innerHTML = getTime12(lastMessage.date);
  } else {
    date.innerHTML = getTime12(Date.now());
  }

  let li = document.createElement("li");
  li.appendChild(avatar);
  li.appendChild(contact);
  li.appendChild(date);

  let contactRow = document.createElement("div");
  contactRow.classList.add("contact-row");
  contactRow.appendChild(id);
  contactRow.appendChild(li);
  contactRow.onclick = (e) => contactRowCLickCallback(e, contactRow);

  return contactRow;
}

document.querySelector(".add-contact-btn").onclick = () => {
  document.querySelector(".overlay-popup").classList.remove("hidden");
};

document.querySelector(".add-contact-floating-btn").onclick = () => {
  document.querySelector(".overlay-popup").classList.remove("hidden");
};

document.getElementById("save-contact-btn").onclick = () => {
  let name = document.getElementById("new-contact-name").value;
  let phone = document.getElementById("new-contact-phone").value;
  let avatar = document.getElementById("new-contact-avatar").files[0];

  if (name && phone) {
    let id = Date.now().toString();
    let newContact = {
      contact: {
        id: id,
        name: name,
        avatar: avatar ? avatar.name : "default.jpg",
      },
      messages: [],
    };

    chats[newContact.contact.id] = newContact;
    persist(chats);

    let newContactRow = createContactsRow([id, newContact]);
    contacts.prepend(newContactRow);

    document.querySelector(".overlay-popup").classList.add("hidden");
  }
};

function filterContacts() {
  let contactRows = document.querySelectorAll(".contact-row");
  contactRows.forEach((contactRow) => filterContactsRows(contactRow));
}

function getTime12(date) {
  return moment(date).format("hh:mm a");
}

function renderMassagingView() {
  let header = document.querySelector(".massaging .header");
  header.classList.remove("hidden");

  let backButon = document.createElement("i");
  backButon.classList.add("back-button", "fa-solid", "fa-arrow-left", "hidden");
  backButon.textContent = "";
  backButon.addEventListener("click", () => {
    backButon.classList.toggle("hidden");
    massageArea.classList.add("massaging--hidden");
    contactsMenu.classList.remove("contacts-menu--hidden");
  });
  header.appendChild(backButon);

  let avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = "img/" + activeDataModel.contact.avatar;
  header.appendChild(avatar);

  let name = document.createElement("div");
  name.classList.add("header-name");
  name.innerHTML = activeDataModel.contact.name;
  header.appendChild(name);

  activeDataModel.messages.forEach((message) => addMessageToView(message));

  let footer = document.querySelector(".massaging .footer");
  footer.classList.remove("hidden");
}

function addMessageToView(message) {
  let body = document.querySelector(".massaging .body");

  let msgDate = moment(message.date);

  if (isDifferentDay(msgDate, body)) {
    let daySeparator = createDaySeparator(msgDate);
    body.appendChild(daySeparator);
  }

  let msgTime = document.createElement("span");
  msgTime.classList.add("message-time");
  msgTime.innerHTML = msgDate.format("hh:mm a");

  let msg = document.createElement("div");
  msg.classList.add("message");
  msg.appendChild(msgTime);

  message.senderId === myId ? msg.classList.add("sent") : msg.classList.add("received");

  msg.appendChild(document.createTextNode(message.text));
  msg.appendChild(msgTime);

  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
}

function createDaySeparator(msgDate) {
  let daySeparator = document.createElement("div");
  daySeparator.classList.add("day-separator");
  daySeparator.innerHTML = msgDate.format("ddd, D/M/YYYY");
  return daySeparator;
}

function isDifferentDay(msgDate, body) {
  let separators = body.querySelectorAll(".day-separator");
  if (separators.length > 0) {
    let lastSeparatorDateVal = separators[separators.length - 1].innerHTML;
    let lastSeparatorDate = moment(lastSeparatorDateVal, "DDD, DD/MM/YYYY");
    return msgDate.get("date") != lastSeparatorDate.get("date");
  } else {
    return true;
  }
}

function filterContactsRows(contactRow) {
  let name = contactRow.querySelector(".contact .name");
  let msg = contactRow.querySelector(".contact .msg");
  let nameVal = name.innerHTML.toLowerCase();
  let msgVal = msg.innerHTML.toLowerCase();
  let searchVal = search.value.toLowerCase();
  let isSearchEmpty = search.value.lenght == 0;
  const spanStart = '<span class="matched">';
  const spanEnd = "</span>";

  if (nameVal.includes("span")) {
    nameVal = nameVal.replaceAll(spanStart, "").replaceAll(spanEnd, "");
  }

  if (isSearchEmpty || nameVal.includes(searchVal)) {
    contactRow.classList.remove("hidden");
    name.innerHTML = nameVal.replace(searchVal, spanStart + searchVal + spanEnd);
  } else {
    contactRow.classList.add("hidden");
  }
}

function contactRowCLickCallback(e, contactRow) {
  if ((active = document.querySelector(".contact-row.active"))) {
    active.classList.remove("active");
  }
  contactRow.classList.add("active");

  setActiveDataModel(contactRow);
  clearMassagingView();
  renderMassagingView();
  if (collapsedMessages()) {
    massageArea.classList.remove("massaging--hidden");
    contactsMenu.classList.add("contacts-menu--hidden");
    document.querySelector(".back-button").classList.remove("hidden");
  }
}

function adjustDisplay() {
  if (window.innerWidth <= 768) {
    if (!collapsedMessages()) {
      massageArea.classList.add("massaging--hidden");
    }
    if (!expandedContacts()) {
      contactsMenu.classList.add("contacts-menu--expanded");
    }
  } else {
    if (collapsedMessages()) {
      massageArea.classList.remove("massaging--hidden");
    }
    if (expandedContacts()) {
      contactsMenu.classList.remove("contacts-menu--expanded");
    }
  }
}

function collapsedMessages() {
  return massageArea.classList.contains("massaging--hidden");
}

function expandedContacts() {
  return contactsMenu.classList.contains("contacts--expanded");
}

function setActiveDataModel(contactRow) {
  activeDataModel = chats[contactRow.querySelector(".id").innerHTML];
}

function clearMassagingView() {
  clearHeader();
  clearMessages();
  clearFooter();
}

function clearHeader() {
  let header = document.querySelector(".massaging .header");
  while (header.firstChild) {
    header.removeChild(header.lastChild);
  }
}

function clearMessages() {
  let messages = document.querySelector(".massaging .body");
  while (messages.firstChild) {
    messages.removeChild(messages.lastChild);
  }
}

function clearFooter() {
  document.querySelector(".massaging .footer .chat-txt").value = "";
  hideEmojiPicker();
}

function registerFooterCallbacks() {
  let footer = document.querySelector(".massaging .footer");
  let msgField = footer.querySelector(".chat-txt");

  let paperclip = footer.querySelector(".paperclip");
  let input = footer.querySelector(".paperclip input");
  paperclip.onclick = () => input.click();

  let emojiPicker = document.querySelector("emoji-picker");
  let emojiBtnShow = document.querySelector(".emoji-btn-show");
  let emojiBtnHide = document.querySelector(".emoji-btn-hide");

  emojiBtnShow.onclick = () => {
    emojiPicker.show();
    emojiBtnShow.classList.add("active");
    emojiBtnHide.classList.add("active");
  };

  emojiBtnHide.onclick = () => {
    hideEmojiPicker();
  };

  emojiPicker.addEventListener("emoji-picked", (e) => {
    msgField.value = msgField.value + e.detail.emojiVal;
    msgField.focus();
  });

  let chatMsgForm = footer.querySelector(".chat-msg-form");
  chatMsgForm.onsubmit = (e) => {
    e.preventDefault();
    addMessage(msgField);
  };

  let sendMsgButton = footer.querySelector(".send-msg-btn");
  sendMsgButton.onclick = () => addMessage(msgField);
}

function hideEmojiPicker() {
  let emojiPicker = document.querySelector("emoji-picker");
  let emojiBtnShow = document.querySelector(".emoji-btn-show");
  let emojiBtnHide = document.querySelector(".emoji-btn-hide");

  emojiPicker.hide();
  emojiBtnShow.classList.remove("active");
  emojiBtnHide.classList.remove("active");
}

const sendSound = new Audio("sounds/send.mp3");
const receiveSound = new Audio("sounds/receive.mp3");
function addMessage(msgField) {
  if (msgField.value) {
    let newMsg = createMsg(msgField.value);
    activeDataModel.messages.push(newMsg);
    persist(chats);

    addMessageToView(newMsg);
    clearInputTextField(msgField);
    updateContactsMenuMessage(newMsg);

    sendSound.play();

    setTimeout(() => {
      let randomResponse = generateRandomResponse();
      let responseMsg = createMsg(randomResponse, activeDataModel.contact.id);
      activeDataModel.messages.push(responseMsg);
      persist(chats);

      addMessageToView(responseMsg);
      updateContactsMenuMessage(responseMsg);

      receiveSound.play();
    }, 2000);
  }
}

function createMsg(msgText) {
  return {
    text: msgText,
    senderId: myId,
    date: moment(),
  };
}

function clearInputTextField(msgField) {
  msgField.value = "";
}

function updateContactsMenuMessage(newMsg) {
  document.querySelector(".contacts-menu .contact-row.active .msg").innerText = newMsg.text;
  document.querySelector(".contacts-menu .contact-row.active .date").innerText = getTime12(newMsg.date);
}

function generateRandomResponse(maxWords = 20) {
  let words = loremIpsum.split(" ");
  let responseLength = Math.floor(Math.random() * maxWords) + 1;
  let response = words.slice(0, responseLength).join(" ");
  return response;
}
