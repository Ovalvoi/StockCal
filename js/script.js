function getRawValue(id) {
  return document.getElementById(id).getAttribute('data-raw-value') || document.getElementById(id).value || '0';
}

function parseInputValue(value) {
  if (typeof value === 'string') {
    value = value.trim().replace(/,/g, ''); // Remove commas
  }
  const num = Number(value);
  return isFinite(num) ? num : null;
}

input.addEventListener('input', function (e) {
  const value = e.target.value;
  const parsed = parseInputValue(value);
  if (parsed === null) {
    e.target.classList.add('invalid');
  } else {
    e.target.classList.remove('invalid');
  }
});

function formatNumber(num) {
  return num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function calculateInvestmentResults() {
  try {
    var initialPrice = parseInputValue(getRawValue('initialPrice'));
    var currentPrice = parseInputValue(getRawValue('currentPrice'));
    var moneyInvested = parseInputValue(getRawValue('moneyInvested'));

    if (initialPrice <= 0 || currentPrice <= 0) {
      document.getElementById('investment-result').innerHTML = 'Please enter valid positive numeric values for all fields.';
      return;
    }

    // Percentage Change Calculation
    var percentageChange = ((currentPrice - initialPrice) / initialPrice) * 100;
    // Total Amount Calculation
    var amount = moneyInvested + (moneyInvested * percentageChange / 100);

    // Result Output Element
    var resultElement = document.getElementById('investment-result');
    resultElement.className = 'result-container';

    var output = "";
    // What-If Calculation
    output += `Your investment has a percentage change of <span class="${percentageChange < 0 ? 'red-text' : 'green-text'}">${percentageChange.toFixed(2)}%</span><br>`;
    if (moneyInvested > 0) {
      output += `In money, you would have a total of <span class="${percentageChange < 0 ? 'red-text' : 'green-text'}">$${formatNumber(amount)}</span><br>`;
    }
    // Break-Even Calculation
    if (percentageChange < 0) {
      var percentageGainNeeded = ((100 / (100 + percentageChange)) - 1) * 100;
      output += `<br>To break even, you need a gain of <span class="green-text">${percentageGainNeeded.toFixed(2)}%.</span>`;
      // Only perform this calculation and output if moneyInvested is provided
      if (moneyInvested > 0) {
        output += `In money, you would need to regain <span class="green-text">$${formatNumber(moneyInvested - amount)}</span> to reach your initial investment.`;
      }
    }
    resultElement.innerHTML = output;
  } catch (error) {
    console.error('Calculation error:', error);
    document.getElementById('investment-result').innerHTML = '<span class="red-text">Error: Please enter valid numeric values.</span>';
  }
}
// Replace the existing event listener attachment section with this:
['moneyInvested', 'initialPrice', 'currentPrice'].forEach(function(id) {
  let input = document.getElementById(id);
  
  input.addEventListener('input', function(e) {
    const value = e.target.value;
    const parsed = parseInputValue(value);
    
    // Handle invalid input styling
    if (parsed === null && value.trim() !== '') {
      e.target.classList.add('invalid');
    } else {
      e.target.classList.remove('invalid');
    }
    
    // Store raw value and calculate
    let rawValue = value.replace(/[^\d.-]/g, '');
    e.target.setAttribute('data-raw-value', rawValue);
    calculateInvestmentResults();
  });
  
  input.addEventListener('blur', function(e) {
    // Format only when user finishes typing
    let rawValue = e.target.getAttribute('data-raw-value') || '';
    let numericValue = parseFloat(rawValue);
    if (!isNaN(numericValue)) {
      e.target.value = formatNumber(numericValue);
    } else if (e.target.value.trim() !== '') {
      e.target.value = '';
    }
    e.target.classList.remove('invalid');
  });
  
  // Initialize input fields
  let initialValue = input.value;
  if (initialValue && initialValue.trim() !== '') {
    let numericInitialValue = parseFloat(initialValue.replace(/[^\d.-]/g, ''));
    if (!isNaN(numericInitialValue)) {
      let formattedInitialValue = formatNumber(numericInitialValue);
      input.value = formattedInitialValue;
      input.setAttribute('data-raw-value', numericInitialValue.toString());
    }
  }
});

// Initial calculation
calculateInvestmentResults();