const activateButton = document.getElementById('activate');

document.getElementById('activate').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'activate' });
    });
  });
  

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getActivationState' }, (response) => {
      if (response && response.isActivated) {
        activateButton.textContent = 'Deactivate';
      } else {
        activateButton.textContent = 'Activate';
      }
    });
});
  
activateButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleActivation' });
      activateButton.textContent = activateButton.textContent === 'Activate' ? 'Deactivate' : 'Activate';
    });
});