let users = [];
let isLoading = true;

async function refresh() {
  fetchUsers();
}

async function fetchUsers() {
  const errorContainer = document.getElementById("errorContainer");
  const errorMessage = document.getElementById("errorMessage");
  const refreshButton = document.getElementById("refreshButton")
  const loadingIndicator = document.getElementById("loadingIndicator");
  const userDetails = document.getElementById("userDetails");
  const userList = document.getElementById("userList");

  errorContainer.classList.remove("visible", "error", "success");
  refreshButton.classList.remove("error", "success")
  loadingIndicator.classList.add("visible");
  userDetails.innerHTML = "";
  userList.innerHTML = "";
  isLoading = true;

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    userDetails.style.display = "block";

    const instruction = document.createElement("p");
    instruction.textContent = "Select a user to view details.";
    userDetails.appendChild(instruction);

    users = await response.json();

    displayUserList(users);

    errorMessage.textContent = "Users loaded successfully! Click to refresh.";
    errorContainer.classList.add("visible", "success");
    refreshButton.classList.add("success");
  } catch (error) {
    errorMessage.textContent = "Failed to load user profile. Please try again.";
    errorContainer.classList.add("visible", "error")
    refreshButton.classList.add("error")
    userDetails.style.display = "none";

    console.log("Fetch Error: ", error)
  } finally {
    isLoading = false;
    loadingIndicator.classList.remove("visible");
  }
}

function displayUserList(users) {
  const userList = document.getElementById("userList");
  userList.innerHTML = ""; // Clear previous list

  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.textContent = user.name;
    userElement.classList.add('user-item')
    userElement.addEventListener('click', () => {
      // Remove active class from all items
      document.querySelectorAll('.user-item').forEach(item => {
        item.classList.remove('active');
      });

      // Add active class to clicked item
      userElement.classList.add('active');

      displayUserDetails(user)
    });
    userList.appendChild(userElement)
  })
}

function displayUserDetails(user) {
  const userDetails = document.getElementById("userDetails");
  userDetails.innerHTML = `
    <h2>${user.name}</h2>
    <p><strong>Username:</strong> ${user.username}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Phone:</strong> ${user.phone}</p>
    <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
    <p><strong>Address:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>
    <p><strong>Company:</strong> ${user.company.name}</p>
    <p><em>${user.company.catchPhrase}</em></p>
  `;
}

// Event listener for refresh button
document.getElementById("refreshButton").addEventListener("click", refresh)

// initial fetch of users
document.addEventListener('DOMContentLoaded', fetchUsers)