const menuButton = document.querySelectorAll(".menu-button");
const screenOverlay = document.querySelector(".screen-overlay");
const themeButton = document.querySelector(".theme-button i");

//Store Theme prefernce in localStorage
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  themeButton.classList.replace("fa-moon", "fa-sun");
} else {
  themeButton.classList.replace("fa-sun", "fa-moon");
}

themeButton.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
  themeButton.classList.toggle("fa-sun", isDarkMode);
  themeButton.classList.toggle("fa-moon", !isDarkMode);
});

//Toggle sidebar visibility when menu buttons are clicked
menuButton.forEach((Button) => {
  Button.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-hidden");
  });
});

//Toggle sidebar visibility when menu buttons are clicked
screenOverlay.addEventListener("click", () => {
  document.body.classList.toggle("sidebar-hidden");
});

// Hide sidebar on small screens byDefault
if (window.innerWidth >= 768) {
  document.body.classList.remove("sidebar-hidden");
}

// Function to toggle the dropdown menu
function toggleUserMenu() {
    const dropdownMenu = document.getElementById("dropdown-menu");
    // Check current display status and toggle
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
}

// Add event listener to the user icon
const userIcon = document.getElementById("user_icon");
userIcon.addEventListener("click", toggleUserMenu);

// Close the dropdown menu if clicking outside of it
document.addEventListener("click", (event) => {
    const dropdownMenu = document.getElementById("dropdown-menu");
    const userIcon = document.getElementById("user_icon");

    // Check if the click was outside the dropdown menu and user icon
    if (!dropdownMenu.contains(event.target) && !userIcon.contains(event.target)) {
        dropdownMenu.style.display = "none";
    }
});


  






//Fetching data from YOUTUBE API ---------------------------
const videoCardContainer = document.querySelector(".video-list");

let api_key = "AIzaSyDC2neVJb03pHLTh-swPLOpA-z02zjeU80";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
let searchHttp = "https://www.googleapis.com/youtube/v3/search?";

fetch(
    video_http +
      new URLSearchParams({
        key: api_key,
        part: "snippet",
        chart: "mostPopular",
        maxResults: 12,
        regionCode: "IN",
      })
  )
    .then((res) => res.json())
    .then((data) => {
    console.log(data);
       data.items.forEach(item => {
        getChannelIcon(item);
       })
    })
    .catch((err) => {
      console.log(err);
    });

// Function to fetch channel information --------------------
const getChannelIcon = (video_data) => {
    fetch(
      channel_http +
        new URLSearchParams({
          key: api_key,
          part: "snippet",
          id: video_data.snippet.channelId,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        video_data.channelThumbnail =
          data.items[0].snippet.thumbnails.default.url;
    console.log(data);
        make_video_card(video_data);
      })
      .catch((error) => {
        console.log("Error fetching channel information:", error);
      });
  };

// Function to fetch videos based on Search-input and Categories --------------
const fetchVideosByQuery = (searchQuery) => {
  videoCardContainer.innerHTML = ""; 

  fetch(
    searchHttp +
      new URLSearchParams({
        key: api_key,
        part: "snippet",
        maxResults: 12,
        q: searchQuery,
        type: "video",
        regionCode: "IN", 
      })
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      data.items.forEach((item) => {
        make_video_card(item);
      });
    })
    .catch((err) => {
      console.log("Error fetching videos:", err);
    });
};

// Make cards dynamically with API's --------------------
const make_video_card = (data) => {
    const channelThumbnail = data.channelThumbnail ? data.channelThumbnail : "images/user.jpg";

    videoCardContainer.innerHTML += `
    <a href="https://youtube.com/watch?v=${data.id}" class="video-card">
        <div class="thumbnail-container">
            <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="${data.snippet.title}">
            <p class="duration">10:03</p>
        </div>
        <div class="video-info">
            <img src="${channelThumbnail}" alt="${data.snippet.channelTitle}" class="icon">
            <div class="video-details">
                <h2 class="title">${data.snippet.title}</h2>
                <p class="channel-name">${data.snippet.channelTitle}</p>
                <p class="views">27K Views • 4 months ago</p>
            </div>
        </div>
    </a>
    `;
};

// Handle Click and Display videos by category --------------------
const categoryButtons = document.querySelectorAll(".category-button");
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category-button.active").classList.remove("active");
        button.classList.add("active");
    
        const category = button.getAttribute("data-category");
            fetchVideosByQuery(category);
        });
});

// Handle search form submission --------------------
const searchForm = document.getElementById("search-form");
const searchInput = document.querySelector(".search-input");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); 
    const query = searchInput.value.trim();
    if (query) {
        fetchVideosByQuery(query);
    }
});