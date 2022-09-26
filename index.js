const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const table = document.getElementById("table");

// inputs
const idInput = document.getElementById("idInput");
const fNameInput = document.getElementById("firstName");
const lNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");

submitBtn.addEventListener("click", createUser);
updateBtn.addEventListener("click", updateUser);

// Get all users from database
// IIFE
(async function getAllUsers() {
  const URL = "https://crud-05ts.onrender.com/api/getUsers";

  const response = await fetch(URL, {
    method: "GET",
  });

  const allUsers = await response.json();
  for (let i = 0; i < allUsers.data.length; i++) {
    updateTable(allUsers.data[i]);
  }
  console.log(allUsers);
})();

// update table function
function updateTable(data) {
  console.log("here in update table: ", data);

  const userId = data._id;
  const firstName = data.firstName;
  const lastName = data.lastName;
  const emailId = data.emailId;

  const tr = document.createElement("tr");

  tr.setAttribute("id", userId);

  function createTableData(val) {
    const td = document.createElement("td");
    const node = document.createTextNode(val);
    td.appendChild(node);
    tr.appendChild(td);
  }

  createTableData(userId.slice(0, 6));
  createTableData(firstName);
  createTableData(lastName);
  createTableData(emailId);

  const td = document.createElement("td");

  const updateButton = document.createElement("button");
  updateButton.innerHTML = "Update";
  updateButton.classList.add("update-button");
  td.appendChild(updateButton);

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.classList.add("delete-button");
  td.appendChild(deleteButton);

  deleteButton.addEventListener("click", () => deleteUser(userId));
  updateButton.addEventListener("click", () => {
    const tableRow = document.getElementById(userId);

    idInput.value = userId;
    fNameInput.value = tableRow.children[1].innerHTML;
    lNameInput.value = tableRow.children[2].innerHTML;
    emailInput.value = tableRow.children[3].innerHTML;

    console.log(
      "on clicking update button: -----",
      tableRow.children[1].innerHTML
    );
    submitBtn.classList.add("hidden");
    updateBtn.classList.remove("hidden");
  });

  tr.appendChild(td);

  table.appendChild(tr);
}

// get input values
function getInputValues() {
  return {
    firstName: fNameInput.value,
    lastName: lNameInput.value,
    emailId: emailInput.value,
  };
}

// Create a User
async function createUser(e) {
  e.preventDefault();

  const userInputData = getInputValues();

  const URL = "https://crud-05ts.onrender.com/api/createUser";

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: userInputData.firstName,
      lastName: userInputData.lastName,
      emailId: userInputData.emailId,
    }),
  });

  const createdUser = await response.json();
  if (createdUser.data) {
    updateTable(createdUser.data);
  }

  fNameInput.value = "";
  lNameInput.value = "";
  emailInput.value = "";
}

// update a user
async function updateUser(e) {
  const userId = idInput.value;
  e.preventDefault();
  const URL = "https://crud-05ts.onrender.com/api/updateUser/" + userId;

  const userDataInput = getInputValues();

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: userDataInput.firstName,
      lastName: userDataInput.lastName,
      emailId: userDataInput.emailId,
    }),
  });

  const data = await response.json();

  console.log("data updated: ----", data);

  const updatedUser = data.updatedUser;
  console.log(updatedUser);

  const tr = document.createElement("tr");

  function createTableData(val) {
    const td = document.createElement("td");
    const node = document.createTextNode(val);
    td.appendChild(node);
    tr.appendChild(td);
  }

  createTableData(updatedUser._id);
  createTableData(updatedUser.firstName);
  createTableData(updatedUser.lastName);
  createTableData(updatedUser.emailId);

  function createTd(val) {
    const td = document.createElement("td");
    const node = document.createTextNode(val);
    td.appendChild(node);
    return td;
  }

  const tableRow = document.getElementById(userId);
  tableRow.children[1].replaceWith(createTd(updatedUser.firstName));
  tableRow.children[2].replaceWith(createTd(updatedUser.lastName));
  tableRow.children[3].replaceWith(createTd(updatedUser.emailId));

  submitBtn.classList.remove("hidden");
  updateBtn.classList.add("hidden");

  fNameInput.value = "";
  lNameInput.value = "";
  emailInput.value = "";
}

// delete a user
async function deleteUser(userId) {
  const URL = "https://crud-05ts.onrender.com/api/deleteUser/" + userId;

  const response = await fetch(URL, {
    method: "DELETE",
  });

  const data = await response.json();
  const tableRow = document.getElementById(userId);
  -table.removeChild(tableRow);
  console.log("user has been deleted: ", data);
}
