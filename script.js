if (localStorage.getItem("transactions") === null) {
  localStorage.setItem("transactions", JSON.stringify({
    "dataTransactions": []
  }));
}

// let balance = 0;
// let transactions = [];
let transactionDuration = "perhari"; // Default transaction duration is perhari
const transactionList = document.getElementById("transaction-list");
const balanceAmount = document.getElementById("balance-amount");
var transactions = JSON.parse(localStorage.getItem("transactions"));
const dataTransactions = transactions.dataTransactions;
console.log(transactions);

// localStorage.clear();


function setTransactionDuration() {
  const durationSelect = document.getElementById("duration");
  transactionDuration = durationSelect.value;
  clearTransactions();
}

function addTransaction() {
  const type = document.getElementById("type").value;
  const description = document.getElementById("description").value;
  let amount = parseFloat(document.getElementById("amount").value);
  const amountType = document.getElementById("amountType").value;

  if (isNaN(amount) || amount <= 0 || !description.trim()) {
    alert("Masukkan informasi transaksi yang valid.");
    return;
  }

  if (amountType === "persentase") {
    amount = (sumBalance() * amount) / 100;
  }

  const transaction = {
    description,
    amount,
    duration: transactionDuration,
    type
  };

  dataTransactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions))


  window.location.reload();
}

function renderTransactions() {
  clearTransactions();
  dataTransactions.forEach(transaction => {
    addTransactionToDOM(transaction);
  });
}

function addTransactionToDOM(transaction) {
  const row = transactionList.insertRow();
  const descriptionCell = row.insertCell(0);
  const amountCell = row.insertCell(1);
  const durationCell = row.insertCell(2);
  const typeCell = row.insertCell(3);
  const actionCell = row.insertCell(4);

  descriptionCell.textContent = transaction.description;
  amountCell.textContent = transaction.amount;
  durationCell.textContent = transaction.duration;
  typeCell.textContent = transaction.type;

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", function () {
    editTransaction(dataTransactions.indexOf(transaction),transaction);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus";
  deleteButton.addEventListener("click", function () {
    removeTransaction(dataTransactions.indexOf(transaction));
  });

  actionCell.appendChild(editButton);
  actionCell.appendChild(deleteButton);
}

function editTransaction(index,transaction) {
  const newDescription = prompt("Masukkan deskripsi baru:", transaction.description);
  let newAmount = parseFloat(prompt("Masukkan jumlah baru:", transaction.amount));

  if (isNaN(newAmount) || newAmount <= 0 || !newDescription.trim()) {
    alert("Masukkan informasi transaksi yang valid.");
    return;
  }

  // const amountDifference = newAmount - transaction.amount;
  // transaction.description = newDescription;
  // transaction.amount = newAmount;

  dataTransactions[index]["description"] = newDescription;
  dataTransactions[index]["amount"] = newAmount;
  localStorage.setItem("transactions", JSON.stringify(transactions));
  // balance += transaction.type === "pemasukan" ? amountDifference : -amountDifference;

  renderTransactions();
  updateBalance();
  checkBalance();
}

function removeTransaction(index) {
  dataTransactions.splice(index, 1)[0];
  localStorage.setItem("transactions", JSON.stringify(transactions));
  // balance -= removedTransaction.type === "pemasukan" ? removedTransaction.amount : -removedTransaction.amount;
  renderTransactions();
  updateBalance();
  checkBalance();
  window.location.reload();
}

function updateBalance() {
  balanceAmount.textContent = `Total Saldo (${transactionDuration}): ${sumBalance()}`;
}

function clearTransactions() {
  transactionList.innerHTML = "<tr><th>Deskripsi</th><th>Jumlah</th><th>Durasi</th><th>Jenis</th><th>Aksi</th></tr>";
}

function checkBalance() {
  const container = document.querySelector(".container");
  const warningMessage = document.getElementById("warning-message");

  if (sumBalance() <= 0) {
    container.classList.add("warning");
    warningMessage.textContent = "Warning: Saldo habis!";
  } else {
    container.classList.remove("warning");
    warningMessage.textContent = "";
  }
}

function sumBalance() {
  let total = 0;
  dataTransactions.forEach(element => {
    const amount = element.amount;
    if (element.type == "pemasukan") {
      total += parseInt(amount);
    } else {
      total -= parseInt(amount);
    }
  });
  return total;
}

renderTransactions();
updateBalance();
checkBalance();