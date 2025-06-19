// Function to toggle dark mode
function toggleDarkMode() {
  var body = document.body;
  body.classList.toggle('dark-mode');
  
  // Store dark mode state in localStorage
  var isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  
  // Update TradingView widget theme dynamically
  updateTradingViewWidgetTheme(isDarkMode);
}

// Apply saved dark mode state on page load
document.addEventListener('DOMContentLoaded', () => {
  var isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
  updateTradingViewWidgetTheme(isDarkMode);
});