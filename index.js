const incomeSection = document.querySelector(".income-area");
const expensesSection = document.querySelector(".expenses-area");
const availableMoney = document.querySelector(".available-money");
const addTransactionPanel = document.querySelector(".add-transaction-panel");

const nameInput = document.querySelector("#name");
const amountInput = document.querySelector("#amount");
const categorySelect = document.querySelector("#category");

const addTransactionBtn = document.querySelector(".add-transaction");
const saveBtn = document.querySelector(".save");
const cancelBtn = document.querySelector(".cancel");
const deleteAllBtn = document.querySelector(".delete-all");

let ID = 0;
let categoryIcon;
let selectedCategory;


/*
1, 2,3 -> [{ id: 0, value: 123}]
*/

const showPanel = () => {
  addTransactionPanel.style.display = "flex";
};

const closePanel = () => {
  addTransactionPanel.style.display = "none";
  clearInputs();
};

const checkForm = () => {
  if (
    nameInput.value !== "" &&
    amountInput.value !== "" &&
    categorySelect.value !== "none"
  ) {
    createNewTransaction();
  } else {
    alert("Fill in all fields!");
  }
};

const clearInputs = () => {
  nameInput.value = "";
  amountInput.value = "";
  categorySelect.selectedIndex = 0;
};

const transactions = [];
const createNewTransaction = () => {

  console.log(transactions);

  const newTransaction = document.createElement('div');
  newTransaction.classList.add('transaction');
  newTransaction.setAttribute('id', `id-${ID}`);
  checkCategory(selectedCategory);

  const amount = +(
    `${selectedCategory === '+Income' ? '' : '-'}` + amountInput.value
  );

  const transaction = {
    name: nameInput.value,
    amount: amount,
    id: `id-${ID}`,
    type: selectedCategory,
  };

  transactions.push(transaction);

  newTransaction.innerHTML = `
        ${categoryIcon} <p class="transaction-name">
        ${nameInput.value}
        </p>
        <p class="transaction-amount">
        ${amountInput.value} </p> PLN
        <button class="delete" onclick="deleteTransatcion(${ID})"><i class="fas fa-times"></i></button>
        <button class="edit" onclick="editTransatcion(${ID})"><i class="fa-solid fa-pencil"></i></button>
        <button class="save-edit" onclick="saveTransatcion(${ID})"><i class="fa-solid fa-floppy-disk"></i></button>
    `;

  amount > 0
    ? incomeSection.appendChild(newTransaction) &&
      newTransaction.classList.add('income')
    : expensesSection.appendChild(newTransaction) &&
      newTransaction.classList.add('expense');
  console.log(parseFloat(amount));

  countMoney();
  closePanel();
  ID++;
  clearInputs();
  const saveEdit = newTransaction.querySelector('.save-edit');
  saveEdit.style.display = 'none';
  console.log(saveEdit);
};

const selectCategory = () => {
  selectedCategory = categorySelect.options[categorySelect.selectedIndex].text;
};

const checkCategory = (transaction) => {
  switch (transaction) {
    case "+Income":
      categoryIcon = '<i class="fa-solid fa-sack-dollar" style="color: #a1da00;"></i>';
      break;
    case "- House":
      categoryIcon = '<i class="fa-solid fa-house-user" style="color: #0073df;"></i>';
      break;
    case "- Food":
      categoryIcon = '<i class="fa-solid fa-carrot" style="color: #0073df;"></i>';
      break;
    case "- Culture":
      categoryIcon = '<i class="fa-solid fa-film" style="color: #0073df;"></i>';
      break;
  }
};

const countMoney = () => {
  const money = transactions.map(tr => tr.amount);
  const newMoney = money.reduce((a, b) => a + b, 0);
  availableMoney.textContent = `${newMoney} PLN`;
  setMoneyAvailabilityText(newMoney);
};

const setMoneyAvailabilityText = (newMoney) => {
  if (newMoney > 0) {
    description.innerHTML = "You can still spend";
  } else if (newMoney === 0) {
    description.innerHTML = "The balance is zero";
  } else {
    description.innerHTML = "The balance is negative. You are on the minus";
  }
};

const deleteTransatcion = (id) => {
  const transactionToDelete = document.getElementById(`id-${id}`);

  transactionToDelete.classList.contains("income")
    ? incomeSection.removeChild(transactionToDelete)
    : expensesSection.removeChild(transactionToDelete);

    transactions.splice(id, 1);
  countMoney();
};

const editTransatcion = (id) => {
  const transactionToEdit = document.getElementById(`id-${id}`);
  const transactionName = transactionToEdit.querySelector('.transaction-name');
  const transactionAmount = transactionToEdit.querySelector('.transaction-amount');
  transactionName.contentEditable = true;
  transactionAmount.contentEditable = true;
  const saveEdit = transactionToEdit.querySelector('.save-edit');
  saveEdit.style.display = "block";
  const editBtn = transactionToEdit.querySelector('.edit');
  editBtn.style.display = "none";
};

const saveTransatcion = (id) => {
  const transaction = transactions.find(
    (transaction) => transaction.id === `id-${id}`
  );

  const transactionToSave = document.getElementById(`id-${id}`);
  const transactionName = transactionToSave.querySelector('.transaction-name');
  const transactionAmount = transactionToSave.querySelector(
    '.transaction-amount'
  );

  transactionName.contentEditable = false;
  transactionAmount.contentEditable = false;
  const saveEdit = transactionToSave.querySelector('.save-edit');
  saveEdit.style.display = 'none';
  const editBtn = transactionToSave.querySelector('.edit');
  editBtn.style.display = 'block';

  
  transactions.find((transaction) => transaction.id === `id-${id}`).amount =
    Number(
      `${transaction.type === '+Income' ? '' : '-'}` +
        transactionAmount.innerText
    );

    countMoney();
};

const deleteAllTransactions = () => {
  incomeSection.innerHTML = "<h3>Income</h3>";
  expensesSection.innerHTML = "<h3>Outgo</h3>";
  availableMoney.textContent = "0 PLN";
  description.innerHTML = "The balance is zero";
};

addTransactionBtn.addEventListener("click", showPanel);
cancelBtn.addEventListener("click", closePanel);
saveBtn.addEventListener("click", checkForm);
deleteAllBtn.addEventListener("click", deleteAllTransactions);
