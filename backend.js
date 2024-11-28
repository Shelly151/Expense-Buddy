// Dummy authentication and user login
function login() {
  const username = document.getElementById('username').value;
  if (username) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('user-name').innerText = username;
  }
}

function logout() {
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('username').value = '';
}

function toggleManualFields(isManual) {
  document.querySelectorAll('.participant-amount').forEach(input => {
    input.style.display = isManual ? 'block' : 'none';
  });
  validateParticipantAmounts();
}

// Add a new participant input field
function addParticipant() {
  const participantDiv = document.createElement('div');
  participantDiv.className = 'participant';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'participant-name';
  nameInput.placeholder = 'Participant Name';

  const amountInput = document.createElement('input');
  amountInput.type = 'number';
  amountInput.className = 'participant-amount';
  amountInput.placeholder = 'Amount (manual split)';
  amountInput.style.display = document.querySelector('input[name="splitOption"]:checked').value === 'manual' ? 'block' : 'none';
  amountInput.onkeyup = validateParticipantAmounts;

  participantDiv.appendChild(nameInput);
  participantDiv.appendChild(amountInput);
  document.getElementById('participants').appendChild(participantDiv);
}

// Validate if participant amounts equal the total amount for manual splits
function validateParticipantAmounts() {
  const totalAmount = parseFloat(document.getElementById('amount').value);
  const participantAmounts = Array.from(document.querySelectorAll('.participant-amount'))
    .map(input => parseFloat(input.value) || 0);

  const sumOfAmounts = participantAmounts.reduce((sum, amount) => sum + amount, 0);
  const errorMessage = document.getElementById('error-message');

  if (sumOfAmounts !== totalAmount) {
    errorMessage.style.display = 'block';
  } else {
    errorMessage.style.display = 'none';
  }
}

// Add expense and update balances
let expenses = [];
function addExpense() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const splitOption = document.querySelector('input[name="splitOption"]:checked').value;

  const participants = Array.from(document.querySelectorAll('.participant')).map(participant => {
    const name = participant.querySelector('.participant-name').value;
    const individualAmount = splitOption === 'manual' ? parseFloat(participant.querySelector('.participant-amount').value || 0) : amount / document.querySelectorAll('.participant').length;
    return { name, amount: individualAmount };
  });

  const sumOfManualAmounts = participants.reduce((sum, p) => sum + p.amount, 0);
  if (splitOption === 'manual' && sumOfManualAmounts !== amount) {
    document.getElementById('error-message').style.display = 'block';
    return;
  }

  if (description && amount > 0 && participants.length > 0) {
    const expense = { description, amount, splitOption, participants };
    expenses.push(expense);
    updateBalances();
  }
}

function updateBalances() {
  const balancesDiv = document.getElementById('balances');
  balancesDiv.innerHTML = ''; // Clear existing balances

  expenses.forEach(exp => {
    const div = document.createElement('div');
    div.innerText = `${exp.description}: $${exp.amount}`;
    balancesDiv.appendChild(div);

    if (exp.splitOption === 'manual') {
      exp.participants.forEach(participant => {
        const participantDiv = document.createElement('div');
        participantDiv.innerText = `${participant.name} owes: $${participant.amount.toFixed(2)}`;
        balancesDiv.appendChild(participantDiv);
      });
    } else {
      const splitAmount = (exp.amount / exp.participants.length).toFixed(2);
      exp.participants.forEach(participant => {
        const participantDiv = document.createElement('div');
        participantDiv.innerText = `${participant.name} owes: $${splitAmount}`;
        balancesDiv.appendChild(participantDiv);
      });
    }
  });
}

// Validate total amount input
function validateTotalAmount() {
  const amount = parseFloat(document.getElementById('amount').value);
  if (isNaN(amount) || amount <= 0) {
    document.getElementById('error-message').innerText = 'Total amount must be greater than 0';
    document.getElementById('error-message').style.display = 'block';
  } else {
    document.getElementById('error-message').style.display = 'none';
  }
}
