document.addEventListener("DOMContentLoaded", loadExpenses);

const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("expense-amount");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editingExpenseId = null;

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const expenseName = expenseNameInput.value.trim();
  const expenseAmount = parseFloat(expenseAmountInput.value.trim());

  if (!expenseName || isNaN(expenseAmount) || expenseAmount <= 0) {
    alert("Please enter a valid expense name and amount.");
    return;
  }

  if (editingExpenseId) {
    const expense = expenses.find((exp) => exp.id === editingExpenseId);
    expense.name = expenseName;
    expense.amount = expenseAmount;
    editingExpenseId = null;
  } else {
    const expense = {
      id: Date.now(),
      name: expenseName,
      amount: expenseAmount,
    };
    expenses.push(expense);
  }

  saveExpenses();
  loadExpenses();
  expenseNameInput.value = "";
  expenseAmountInput.value = "";
});

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function displayExpense(expense) {
  const row = document.createElement("tr");
  row.id = expense.id;

  row.innerHTML = `
    <td>${expense.id}</td>
    <td>${expense.name}</td>
    <td>${expense.amount}</td>
    <td>
      <button class="btn btn-primary btn-sm" onclick="editExpense(${expense.id})">Edit</button>
    </td>
    <td>
      <button class="btn btn-danger btn-sm" onclick="deleteExpense(${expense.id})">Delete</button>
    </td>
  `;

  expenseList.appendChild(row);
}

function editExpense(expenseId) {
  const expense = expenses.find((exp) => exp.id === expenseId);

  expenseNameInput.value = expense.name;
  expenseAmountInput.value = expense.amount;

  editingExpenseId = expenseId;
}

function loadExpenses() {
  expenseList.innerHTML = "";
  expenses.forEach(displayExpense);
}

function deleteExpense(expenseId) {
  expenses = expenses.filter((expense) => expense.id !== expenseId);
  saveExpenses();
  loadExpenses();
}
