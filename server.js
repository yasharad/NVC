document.addEventListener('DOMContentLoaded', loadHistory);

function makeRequest() {
    const caseNumber = document.getElementById('caseNumber').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = ''; // Clear previous error message
    
    if (!caseNumber) {
        errorMessage.textContent = 'Case Number is required!';
        return; // Stop execution if the input is empty
    }

    const url = `http://localhost:3000/proxy?caseNumber=${caseNumber}`;

    const loadingHud = document.getElementById('loadingHud');
    loadingHud.classList.add('active'); // Show the loading HUD

    // Use XMLHttpRequest for better compatibility with Safari
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            const responseContainer = document.getElementById('response');
            responseContainer.innerHTML = ''; // Clear previous content
            const data = JSON.parse(xhr.responseText);
            responseContainer.appendChild(formatData(data)); // Format data nicely
            addToHistory(caseNumber); // Add to history
        } else {
            console.error('Fetch error:', xhr.statusText);
            document.getElementById('response').textContent = 'Error: ' + xhr.statusText;
        }
        loadingHud.classList.remove('active'); // Hide the loading HUD
    };
    xhr.onerror = function () {
        console.error('Fetch error:', xhr.statusText);
        document.getElementById('response').textContent = 'Error: ' + xhr.statusText;
        loadingHud.classList.remove('active'); // Hide the loading HUD
    };
    xhr.send();
}

function formatData(data, parentElement = document.createElement('div')) {
    for (const key in data) {
        if (data.hasOwnProperty(key) && key !== 'location' && key !== 'error') { // Skip 'location' and 'error' keys
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            if (typeof data[key] === 'object' && data[key] !== null) {
                // If the value is an object, recurse into it
                itemDiv.innerHTML = `<h4>${key}:</h4>`;
                itemDiv.appendChild(formatData(data[key], document.createElement('div')));
            } else {
                itemDiv.innerHTML = `<h4>${key}:</h4> ${data[key]}`;
            }
            parentElement.appendChild(itemDiv);
        }
    }
    return parentElement;
}

function addToHistory(caseNumber) {
    let history = JSON.parse(localStorage.getItem('caseHistory')) || [];
    if (!history.includes(caseNumber)) {
        history.push(caseNumber);
        localStorage.setItem('caseHistory', JSON.stringify(history));
        updateHistorySelect(history);
    }
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('caseHistory')) || [];
    updateHistorySelect(history);
}

function updateHistorySelect(history) {
    const select = document.getElementById('caseHistory');
    select.innerHTML = '<option value="">Select from history</option>'; // Clear previous options
    history.forEach(caseNumber => {
        const option = document.createElement('option');
        option.value = caseNumber;
        option.textContent = caseNumber;
        select.appendChild(option);
    });
}

function selectFromHistory() {
    const selectedCaseNumber = document.getElementById('caseHistory').value;
    if (selectedCaseNumber) {
        document.getElementById('caseNumber').value = selectedCaseNumber;
    }
}