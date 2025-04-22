let users = [];
let isLoading = true;
let currentSelectedUser = null;

// Listen for window resize events to adjust UI
window.addEventListener('resize', handleResize);

// Initial setup based on screen size
function handleResize() {
  const isMobile = window.innerWidth <= 768;
  
  // If mobile and a user is selected, ensure user details are visible
  if (isMobile && currentSelectedUser) {
    document.getElementById("userDetails").scrollIntoView({ behavior: 'smooth' });
  }
}

async function refresh() {
  fetchUsers();
}

async function fetchUsers() {
  const errorContainer = document.getElementById("errorContainer");
  const errorMessage = document.getElementById("errorMessage");
  const refreshButton = document.getElementById("refreshButton");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const userDetails = document.getElementById("userDetails");
  const userList = document.getElementById("userList");

  errorContainer.classList.remove("visible", "error", "success");
  refreshButton.classList.remove("error", "success");
  loadingIndicator.classList.add("visible");
  userDetails.innerHTML = "";
  userList.innerHTML = "";
  currentSelectedUser = null;
  isLoading = true;

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    userDetails.style.display = "block";

    const instruction = document.createElement("p");
    instruction.textContent = "Select a user to view details.";
    instruction.className = "instruction-text";
    userDetails.appendChild(instruction);

    users = await response.json();

    displayUserList(users);

    errorMessage.textContent = "Users loaded successfully! Click to refresh.";
    errorContainer.classList.add("visible", "success");
    refreshButton.classList.add("success");
  } catch (error) {
    errorMessage.textContent = "Failed to load user profiles. Please try again.";
    errorContainer.classList.add("visible", "error");
    refreshButton.classList.add("error");
    userDetails.style.display = "none";

    console.log("Fetch Error: ", error);
  } finally {
    isLoading = false;
    loadingIndicator.classList.remove("visible");
  }
}

function displayUserList(users) {
  const userList = document.getElementById("userList");
  userList.innerHTML = ""; // Clear previous list
  
  // Add a heading for the list section
  const listHeading = document.createElement('h2');
  listHeading.textContent = 'Users';
  listHeading.className = 'section-heading';
  userList.appendChild(listHeading);

  // Create a container for user items for better styling
  const userListContainer = document.createElement('div');
  userListContainer.className = 'user-list-container';
  userList.appendChild(userListContainer);

  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.textContent = user.name;
    userElement.classList.add('user-item');
    userElement.setAttribute('aria-label', `View ${user.name}'s details`);
    userElement.setAttribute('tabindex', '0');
    
    // Support both click and keyboard interaction
    userElement.addEventListener('click', () => selectUser(user, userElement));
    userElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectUser(user, userElement);
      }
    });
    
    userListContainer.appendChild(userElement);
  });

  // Add a responsive hint for mobile users
  if (window.innerWidth <= 768) {
    const mobileHint = document.createElement('p');
    mobileHint.className = 'mobile-hint';
    mobileHint.textContent = 'Tap a name to view details';
    userList.appendChild(mobileHint);
  }
}

function selectUser(user, userElement) {
  document.querySelectorAll('.user-item').forEach(item => {
    item.classList.remove('active');
    item.setAttribute('aria-selected', 'false');
  });

  userElement.classList.add('active');
  userElement.setAttribute('aria-selected', 'true');
  currentSelectedUser = user;

  displayUserDetails(user);
  
  // On mobile, scroll to the details section
  if (window.innerWidth <= 768) {
    document.getElementById("userDetails").scrollIntoView({ behavior: 'smooth' });
  }
}

function displayUserDetails(user) {
  const userDetails = document.getElementById("userDetails");
  
  userDetails.innerHTML = `
    <div class="user-details-card">
      <header class="user-header">
        <h2>${user.name}</h2>
        <p class="user-username">@${user.username}</p>
      </header>
      
      <div class="contact-info">
        <div class="info-group">
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> <a href="mailto:${user.email}">${user.email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${user.phone}">${user.phone}</a></p>
          <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank" rel="noopener">${user.website}</a></p>
        </div>
        
        <div class="info-group">
          <h3>Address</h3>
          <address>
            ${user.address.street}, ${user.address.suite}<br>
            ${user.address.city}, ${user.address.zipcode}
          </address>
        </div>
        
        <div class="info-group">
          <h3>Company</h3>
          <p class="company-name">${user.company.name}</p>
          <p class="company-catchphrase"><em>"${user.company.catchPhrase}"</em></p>
          <p><strong>Business:</strong> ${user.company.bs}</p>
        </div>
      </div>
      
      <div class="back-link-container">
        <a href="#userList" class="back-to-list" aria-label="Back to user list">Back to list</a>
      </div>
    </div>
  `;

  // For mobile, add a back link functionality
  const backLink = userDetails.querySelector('.back-to-list');
  if (backLink) {
    backLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById("userList").scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// Handle network status changes
window.addEventListener('online', () => {
  if (users.length === 0) {
    fetchUsers(); // Reload when coming back online
  }
});

// Event listener for refresh button
document.getElementById("refreshButton").addEventListener("click", refresh);

// Initial fetch of users
document.addEventListener('DOMContentLoaded', fetchUsers);