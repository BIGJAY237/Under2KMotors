(function () {
  // Constants for localStorage keys
  const STORAGE_FAVORITES = "Under2K Motors-favorites";
  const STORAGE_BRANDS = "Under2K Motors-brands";
  const STORAGE_TYPES = "Under2K Motors-types";
  const STORAGE_SESSION = "Under2K Motors-admin";
  const ADMIN_TOKEN_KEY = "Under2K Motors-admin-token";
  const API_BASE_URL = "https://under2kmotors.onrender.com"
  const WHATSAPP_PHONE = "13038831244"; // WhatsApp: +1 (303) 883-1244

  // Global variable to hold loaded cars from backend
  var loadedCars = [];

  // Default cars data with images as URLs (for backward compatibility)
  const DEFAULT_CARS = [
    {
      id: "1",
      name: "Model S Plaid",
      brand: "Tesla",
      price: 89990,
      year: 2024,
      mileage: "5,000 mi",
      type: "Electric",
      transmission: "Tri Motor All-Wheel Drive",
      fuelType: "Electric",
      color: "Pearl White",
      horsepower: "1,020 hp",
      topSpeed: "200 mph",
      acceleration: "0-60 mph in 1.99s",
      description:
        "Experience the pinnacle of electric performance with all-wheel-drive traction, Plaid badges, and a serene cabin.",
      specs: "",
      features: ["396 miles range", "Autopilot 2.0", "Premium sound"],
      images: [
        "https://images.unsplash.com/photo-1764307372847-0ec0b637bbd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGVsZWN0cmljJTIwY2FyJTIwbW9kZXJufGVufDF8fHx8MTc3NDcxNjQwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1549924231-f129b911e442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8Mnx8c2luZ3xlbnwwfHx8fDE2OTUyOTU3Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      videos: [],
      video: ""
    },
    {
      id: "2",
      name: "AMG GT",
      brand: "Mercedes-Benz",
      price: 118600,
      year: 2024,
      mileage: "2,000 mi",
      type: "Sports",
      transmission: "8-Speed Automatic",
      fuelType: "Gasoline",
      color: "Obsidian Black",
      horsepower: "523 hp",
      topSpeed: "193 mph",
      acceleration: "0-60 mph in 3.5s",
      description:
        "A sublime sports coupe with sculpted lines, active aerodynamics, and track-caliber handling every weekend.",
      specs: "",
      features: ["4.0L V8 Biturbo", "Active suspension", "Carbon ceramic brakes"],
      images: [
        "https://images.unsplash.com/photo-1771210353591-20006eba7ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwYmxhY2slMjBzZWRhbiUyMGF1dG9tb3RpdmV8ZW58MXx8fHwxNzc0NzE2NDA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1615133847765-7d35f2addc7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyJTIwZGVzaWduJTJDbWVyY2VkZXMlMjBiZW56fGVufDF8fHx8MTc4Nzk3NzM0Nnxu&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      videos: [],
      video: ""
    },
    {
      id: "3",
      name: "Range Rover Sport",
      brand: "Land Rover",
      price: 83000,
      year: 2024,
      mileage: "8,500 mi",
      type: "SUV",
      transmission: "8-speed Automatic",
      fuelType: "Gasoline",
      color: "Santorini Black",
      horsepower: "518 hp",
      topSpeed: "176 mph",
      acceleration: "0-60 mph in 4.3s",
      description:
        "A commanding SUV that blends luxury seating, off-road capability, and responsive V8 swagger.",
      specs: "",
      features: ["Terrain Response", "Adaptive air suspension", "Heated seats"],
      images: [
        "https://images.unsplash.com/photo-1767749995450-7b63ab7cd4fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVYlMjB2ZWhpY2xlfGVufDF8fHx8MTc3NDY2MzM2OXww&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1613780779252-cd07e53ab3b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbGVuZHJvdmVyJTIwc3BvcnR8ZW58MXx8fHwxNjk1NDM4MDY1fDA&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      videos: [],
      video: ""
    },
    {
      id: "4",
      name: "911 Turbo S",
      brand: "Porsche",
      price: 207000,
      year: 2024,
      mileage: "1,200 mi",
      type: "Sports",
      transmission: "8-speed PDK",
      fuelType: "Gasoline",
      color: "Carmine Red",
      horsepower: "640 hp",
      topSpeed: "205 mph",
      acceleration: "0-60 mph in 2.6s",
      description:
        "Iconic engineering, rear-engine balance, and a twin-turbo roar make this the ultimate autobahn machine.",
      specs: "",
      features: ["Porsche Active Suspension Management", "Ceramic brakes", "Adaptive aerodynamics"],
      images: [
        "https://images.unsplash.com/photo-1769869263342-b36777a32747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBzcG9ydHMlMjBjYXIlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzQ3MTY0MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NzZ8MHwxfHNlYXJjaHwxfHxwb3JzY2hlJTIwOTExfGVufDB8fHx8MTY5NTY0OTU3OA&ixlib=rb-4.0.3&q=80&w=1080"
      ],
      videos: ["https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"],
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    },
    {
      id: "5",
      name: "S-Class Coupe",
      brand: "Mercedes-Benz",
      price: 112000,
      year: 2024,
      mileage: "3,800 mi",
      type: "Luxury",
      transmission: "9-speed Automatic",
      fuelType: "Gasoline",
      color: "Obsidian Black",
      horsepower: "496 hp",
      topSpeed: "155 mph",
      acceleration: "0-60 mph in 4.3s",
      description:
        "Sculpted lines, a serene cabin, and executive-grade tech make every drive effortless.",
      specs: "",
      features: ["E-Active Body Control", "Executive rear seats", "Burmeister audio"],
      images: [
        "https://images.unsplash.com/photo-1761139844220-388b0432d675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBjb3VwZSUyMGx1eHVyeXxlbnwxfHx8fDE3NzQ3MTY0MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NzZ8MHwxfHNlYXJjaHwxfHxzJTIwY2xhc3N8ZW58MHx8fHwxNjk1NjUwMDky&ixlib=rb-4.0.3&q=80&w=1080"
      ],
      videos: [],
      video: ""
    },
    {
      id: "6",
      name: "Z4 M40i",
      brand: "BMW",
      price: 66700,
      year: 2024,
      mileage: "6,200 mi",
      type: "Convertible",
      transmission: "8-speed Automatic",
      fuelType: "Gasoline",
      color: "Portimao Blue",
      horsepower: "382 hp",
      topSpeed: "155 mph",
      acceleration: "0-60 mph in 4.4s",
      description:
        "A lightweight roadster with aggressive styling, adaptive suspension, and an engaging inline-six note.",
      specs: "",
      features: ["M Sport differential", "Adaptive LED headlights", "Harman Kardon audio"],
      images: [
        "https://images.unsplash.com/photo-1659890063603-708fd0473544?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwY29udmVydGlibGUlMjBjYXJ8ZW58MXx8fHwxNzc0NjU1NDUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NzZ8MHwxfHNlYXJjaHwxfHxibXclMjB6NHxlbnwwfHx8fDE2OTU2MDQ1ODU&ixlib=rb-4.0.3&q=80&w=1080"
      ],
      videos: [],
      video: ""
    }
  ];

  const bodyPage = document.body.dataset.page;

  // Ensure brands and types lists exist for admin controls.
  function ensureBrandTypeLists() {
    if (!localStorage.getItem(STORAGE_BRANDS)) {
      var initial = getCars().map(function (car) {
        return car.brand;
      });
      initial = initial.filter(function (value, index, arr) {
        return arr.indexOf(value) === index;
      });
      localStorage.setItem(STORAGE_BRANDS, JSON.stringify(initial));
    }
    if (!localStorage.getItem(STORAGE_TYPES)) {
      var initialTypes = getCars().map(function (car) {
        return car.type;
      });
      initialTypes = initialTypes.filter(function (value, index, arr) {
        return arr.indexOf(value) === index;
      });
      localStorage.setItem(STORAGE_TYPES, JSON.stringify(initialTypes));
    }
  }

  function getBrands() {
    ensureBrandTypeLists();
    return JSON.parse(localStorage.getItem(STORAGE_BRANDS)) || [];
  }

  function getTypes() {
    ensureBrandTypeLists();
    return JSON.parse(localStorage.getItem(STORAGE_TYPES)) || [];
  }

  function saveBrands(brands) {
    localStorage.setItem(STORAGE_BRANDS, JSON.stringify(brands));
  }

  function saveTypes(types) {
    localStorage.setItem(STORAGE_TYPES, JSON.stringify(types));
  }

  function addBrand(brand) {
    if (!brand) {
      return;
    }
    var brands = getBrands();
    if (brands.indexOf(brand) === -1) {
      brands.push(brand);
      saveBrands(brands);
    }
  }

  function removeBrand(brand) {
    var brands = getBrands();
    brands = brands.filter(function (item) {
      return item !== brand;
    });
    saveBrands(brands);
  }

  function addType(type) {
    if (!type) {
      return;
    }
    var types = getTypes();
    if (types.indexOf(type) === -1) {
      types.push(type);
      saveTypes(types);
    }
  }

  function removeType(type) {
    var types = getTypes();
    types = types.filter(function (item) {
      return item !== type;
    });
    saveTypes(types);
  }

  function getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
  }

  function saveAdminToken(token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }

  function removeAdminToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }

  async function apiFetch(path, options) {
    options = options || {};
    options.headers = options.headers || {};
    if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
      options.body = JSON.stringify(options.body);
      options.headers["Content-Type"] = "application/json";
    }
    const token = getAdminToken();
    if (token) {
      options.headers["Authorization"] = "Bearer " + token;
    }

    const response = await fetch(API_BASE_URL + path, options);
    if (!response.ok) {
      const json = await response.json().catch(() => null);
      const message = (json && json.error) || response.statusText;
      const error = new Error(message || "Server error");
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  function normalizeServerCar(car) {
    if (!car) {
      return car;
    }
    return {
      id: car.id || car._id || "",
      name: car.name || "",
      brand: car.brand || "",
      price: Number(car.price) || 0,
      year: car.year || new Date().getFullYear(),
      mileage: car.mileage || "",
      type: car.type || "",
      transmission: car.transmission || "",
      fuelType: car.fuelType || "",
      color: car.color || "",
      horsepower: car.horsepower || "",
      topSpeed: car.topSpeed || "",
      acceleration: car.acceleration || "",
      description: car.description || "",
      specs: car.specs || "",
      features: Array.isArray(car.features) ? car.features : [],
      images: Array.isArray(car.images) ? car.images : [],
      videos: Array.isArray(car.videos) ? car.videos : [],
      video: car.video || (Array.isArray(car.videos) ? car.videos[0] : "") || ""
    };
  }

  async function loadCarsFromServer() {
    try {
      const response = await fetch(API_BASE_URL + "/cars");
      if (!response.ok) {
        throw new Error("Could not load cars from server");
      }
      const cars = await response.json();
      if (Array.isArray(cars)) {
        loadedCars = cars.map(normalizeServerCar);
      }
      return loadedCars;
    } catch (error) {
      console.warn("Backend unavailable:", error);
      return [];
    }
  }

  async function validateAdminToken() {
    const token = getAdminToken();
    if (!token) {
      return false;
    }
    try {
      await apiFetch("/admin-validate", { method: "GET" });
      return true;
    } catch (error) {
      removeAdminToken();
      return false;
    }
  }

  async function saveCarToServer(payload, editingId) {
    if (!getAdminToken()) {
      throw new Error("Missing admin token");
    }
    if (editingId) {
      return apiFetch("/edit-car/" + editingId, {
        method: "PUT",
        body: payload
      });
    }
    return apiFetch("/add-car", {
      method: "POST",
      body: payload
    });
  }

  async function deleteCarFromServer(id) {
    if (!getAdminToken()) {
      throw new Error("Missing admin token");
    }
    return apiFetch("/delete-car/" + id, {
      method: "DELETE"
    });
  }




  function rootBrandTypesFromCars() {
    var cars = getCars();
    var brands = cars.map(function (car) {
      return car.brand;
    });
    var types = cars.map(function (car) {
      return car.type;
    });
    // Ensure unique
    brands = brands.filter(function (value, index, array) {
      return array.indexOf(value) === index;
    });
    types = types.filter(function (value, index, array) {
      return array.indexOf(value) === index;
    });
    return { brands: brands, types: types };
  }

  // Get cars from loaded data
  function getCars() {
    return loadedCars;
  }

  // Get a car by ID
  function getCarById(id) {
    const cars = getCars();
    return cars.find(function (car) {
      return car.id === id;
    });
  }

  // Get favorites from localStorage
  function getFavorites() {
    var stored = localStorage.getItem(STORAGE_FAVORITES);
    return stored ? JSON.parse(stored) : [];
  }

  // Save favorites to localStorage
  function saveFavorites(list) {
    localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(list));
  }

  // Check if a car is favorited
  function isFavorite(id) {
    return getFavorites().indexOf(id) !== -1;
  }

  // Toggle favorite status for a car
  function toggleFavorite(id) {
    var favorites = getFavorites();
    var index = favorites.indexOf(id);
    var isNowFavorite;
    if (index === -1) {
      favorites.push(id);
      isNowFavorite = true;
    } else {
      favorites.splice(index, 1);
      isNowFavorite = false;
    }
    saveFavorites(favorites);
    return isNowFavorite;
  }

  function highlightNav() {
    var links = document.querySelectorAll(".nav-link");
    for (var i = 0; i < links.length; i += 1) {
      var link = links[i];
      if (link.dataset.page === bodyPage) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    }
  }

  function handleNavigationToggle() {
    var menuToggle = document.querySelector(".menu-toggle");
    var mobileMenu = document.getElementById("mobileMenu");
    if (!menuToggle || !mobileMenu) {
      return;
    }

    menuToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      mobileMenu.setAttribute("aria-hidden", String(!isOpen));
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    var links = mobileMenu.querySelectorAll("a");
    for (var i = 0; i < links.length; i += 1) {
      links[i].addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        mobileMenu.setAttribute("aria-hidden", "true");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    }
  }

  function formatCurrency(value) {
    if (typeof value !== "number") {
      return value;
    }
    return value.toLocaleString("en-US");
  }

  function resolveMediaUrl(value) {
    // Return empty string for falsy values
    if (!value || typeof value !== "string") {
      return "";
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return "";
    }

    // If already a full URL (http/https), return as-is
    if (trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")) {
      return trimmedValue;
    }

    // If base64 data URL, return as-is
    if (trimmedValue.startsWith("data:")) {
      return trimmedValue;
    }

    // If path starts with /uploads/, prefix with API_BASE_URL
    if (trimmedValue.startsWith("/uploads/")) {
      return API_BASE_URL + trimmedValue;
    }

    // If path starts with /, prefix with API_BASE_URL
    if (trimmedValue.startsWith("/")) {
      return API_BASE_URL + trimmedValue;
    }

    // For relative paths, prefix with API_BASE_URL and /
    return API_BASE_URL + "/" + trimmedValue;
  }

  function getPrimaryVideoSource(car) {
    if (!car) {
      return "";
    }
    return car.video || (Array.isArray(car.videos) && car.videos[0]) || "";
  }

  // Build a WhatsApp URL with encoded message using selected car info
  function createWhatsAppLink(carName, carPrice) {
    var message =
      "Hello, I am interested in buying this car: " +
      carName +
      ". Price: $" +
      formatCurrency(carPrice) +
      ". Please provide more details.";
    return "https://wa.me/" + WHATSAPP_PHONE + "?text=" + encodeURIComponent(message);
  }

  // Helper functions for video embedding
  function getYouTubeEmbedUrl(url) {
    var videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1].split("?")[0];
    }
    return "https://www.youtube.com/embed/" + videoId;
  }

  function getVimeoEmbedUrl(url) {
    var videoId = url.split("vimeo.com/")[1].split("?")[0];
    return "https://player.vimeo.com/video/" + videoId;
  }

  function createCarCard(car, options) {
    options = options || {};
    var article = document.createElement("article");
    article.className = "car-card";

    // Use the first image from the array for card preview
    const hasImages =
      Array.isArray(car.images) &&
      car.images.length > 0 &&
      typeof car.images[0] === "string" &&
      car.images[0].trim() !== "";
    var firstImage = hasImages ? resolveMediaUrl(car.images[0]) : "";
    var firstVideo = getPrimaryVideoSource(car);
    var mediaElement = "";

    if (hasImages) {
      mediaElement = '<img src="' + firstImage + '" alt="' + car.name + '" loading="lazy" />';
    } else if (firstVideo) {
      // Fallback to video if no images available
      if (firstVideo.includes("youtube.com") || firstVideo.includes("youtu.be") || firstVideo.includes("vimeo.com")) {
        // For external videos, show a placeholder or try to get thumbnail
        mediaElement = '<div style="width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #666;">Video Available</div>';
      } else {
        mediaElement = '<video src="' + resolveMediaUrl(firstVideo) + '" controls muted loading="lazy" style="width: 100%; height: 200px; object-fit: cover;"></video>';
      }
    } else {
      mediaElement = '<div style="width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #666;">No media</div>';
    }

    var markup =
      '<div class="car-card-image">' +
      mediaElement +
      '<button class="favorite-toggle" data-car-id="' +
      car.id +
      '" aria-label="Toggle favorite">' +
      (isFavorite(car.id) ? "♥" : "♡") +
      "</button>" +
      '<span class="car-type">' +
      car.type +
      "</span>" +
      "</div>" +
      '<div class="car-card-body">' +
      '<div class="car-name">' +
      "<h3>" +
      car.name +
      "</h3>" +
      "<p>" +
      car.brand +
      "</p>" +
      "</div>" +
      '<div class="car-stats">' +
      "<div><span>Year</span><strong>" +
      car.year +
      "</strong></div>" +
      "<div><span>Mileage</span><strong>" +
      car.mileage +
      "</strong></div>" +
      "</div>" +
      '<div class="car-bottom">' +
      "<div><span>Starting from</span><p>$" +
      formatCurrency(car.price) +
      "</p></div>";
    // Add buy now button on every car card.
    markup +=
      '<a class="btn btn-primary" target="_blank" rel="noopener" href="' +
      createWhatsAppLink(car.name, car.price) +
      '">Buy Now</a>';
    if (options.viewDetails) {
      markup += '<a class="btn btn-card" href="details.html?id=' + car.id + '">View Details</a>';
    }
    markup += "</div></div>";
    article.innerHTML = markup;

    var favoriteToggle = article.querySelector(".favorite-toggle");
    if (favoriteToggle) {
      favoriteToggle.addEventListener("click", function (event) {
        event.preventDefault();
        var newState = toggleFavorite(car.id);
        favoriteToggle.textContent = newState ? "♥" : "♡";
        favoriteToggle.classList.toggle("is-active", newState);
        if (options.onFavoriteChange) {
          options.onFavoriteChange();
        }
      });
    }

    return article;
  }

  function renderCarCards(cars, container, options) {
    options = options || {};
    container.innerHTML = "";
    for (var i = 0; i < cars.length; i += 1) {
      container.appendChild(createCarCard(cars[i], options));
    }
  }

  function handleIndexPage() {
    if (bodyPage !== "home") {
      return;
    }
    var preview = document.querySelector("[data-featured-preview]");
    if (preview) {
      renderCarCards(getCars().slice(0, 3), preview, {
        viewDetails: true
      });
    }
  }

  function handleListingsPage() {
    if (bodyPage !== "listings") {
      return;
    }
    var grid = document.getElementById("listingsGrid");
    var search = document.getElementById("listingsSearch");
    var brandSelect = document.getElementById("brandFilter");
    var typeSelect = document.getElementById("typeFilter");
    var empty = document.getElementById("listingsEmpty");
    var reset = document.getElementById("resetFilters");
    if (!grid || !search || !brandSelect || !typeSelect) {
      return;
    }
    var cars = getCars();

    function populateSelect(select, values, label) {
      select.innerHTML = "";
      var options = ["All"].concat(values);
      for (var i = 0; i < options.length; i += 1) {
        var option = document.createElement("option");
        option.value = options[i];
        option.textContent = options[i] === "All" ? "All " + label : options[i];
        select.appendChild(option);
      }
    }

    function refreshListingsData() {
      cars = getCars();
      var rootValues = rootBrandTypesFromCars();
      populateSelect(brandSelect, rootValues.brands, "Brands");
      populateSelect(typeSelect, rootValues.types, "Types");
    }

    refreshListingsData();

    // Expose refresh function so admin updates can refresh listings in real-time.
    window.refreshListings = async function () {
      // Reload fresh data from backend
      await loadCarsFromServer();
      refreshListingsData();
      applyFilters();
    };

    function applyFilters() {
      var query = search.value.trim().toLowerCase();
      var brand = brandSelect.value;
      var type = typeSelect.value;
      var filtered = cars.filter(function (car) {
        var matchesQuery =
          !query ||
          car.name.toLowerCase().indexOf(query) !== -1 ||
          car.brand.toLowerCase().indexOf(query) !== -1;
        var matchesBrand = brand === "All" || car.brand === brand;
        var matchesType = type === "All" || car.type === type;
        return matchesQuery && matchesBrand && matchesType;
      });
      renderCarCards(filtered, grid, {
        viewDetails: true,
        onFavoriteChange: renderFavoritesSection
      });
      empty.style.display = filtered.length === 0 ? "block" : "none";
    }

    search.addEventListener("input", applyFilters);
    brandSelect.addEventListener("change", applyFilters);
    typeSelect.addEventListener("change", applyFilters);
    reset.addEventListener("click", function () {
      search.value = "";
      brandSelect.value = "All";
      typeSelect.value = "All";
      applyFilters();
    });

    applyFilters();
  }

  function renderFavoritesSection() {
    var container = document.getElementById("favoritesGrid");
    var empty = document.getElementById("favoritesEmpty");
    if (!container || !empty) {
      return;
    }
    var favorites = getFavorites();
    var cars = getCars().filter(function (car) {
      return favorites.indexOf(car.id) !== -1;
    });
    if (cars.length === 0) {
      container.innerHTML = "";
      empty.style.display = "block";
    } else {
      empty.style.display = "none";
      renderCarCards(cars, container, {
        viewDetails: true,
        onFavoriteChange: renderFavoritesSection
      });
    }
  }

  function handleFavoritesPage() {
    if (bodyPage !== "favorites") {
      return;
    }
    renderFavoritesSection();
  }

  function handleDetailsPage() {
    // Handle the car details page
    if (bodyPage !== "details") {
      return;
    }
    var detailContainer = document.getElementById("detailsContent");
    var notFound = document.getElementById("detailsNotFound");
    var heroMedia = document.getElementById("detailsHeroMedia");
    var title = document.getElementById("detailsTitle");
    var subtitle = document.getElementById("detailsSubtitle");
    var typeLabel = document.getElementById("detailsType");
    var price = document.getElementById("detailsPrice");
    var year = document.getElementById("detailsYear");
    var mileage = document.getElementById("detailsMileage");
    var favoriteButton = document.getElementById("detailsFavorite");
    var buyNowButton = document.getElementById("detailsBuyNow");
    var gallery = document.getElementById("detailsGallery");
    var specsGrid = document.getElementById("detailsSpecs");
    var featuresList = document.getElementById("detailsFeatures");
    var description = document.getElementById("detailsDescription");
    var videoWrapper = document.getElementById("detailsVideo");

    if (!detailContainer) {
      return;
    }

    // Get car ID from URL params
    var params = new URLSearchParams(window.location.search);
    var carId = params.get("id");
    if (!carId) {
      notFound.style.display = "block";
      detailContainer.style.display = "none";
      return;
    }

    var car = getCarById(carId);
    if (!car) {
      notFound.style.display = "block";
      detailContainer.style.display = "none";
      return;
    }

    notFound.style.display = "none";
    detailContainer.style.display = "flex";
    detailContainer.style.flexDirection = "column";

    // Set hero image background using the first image in the array
    if (heroMedia) {
      const hasImages =
        Array.isArray(car.images) &&
        car.images.length > 0 &&
        typeof car.images[0] === "string" &&
        car.images[0].trim() !== "";
      var heroImage = hasImages ? resolveMediaUrl(car.images[0]) : "";
      heroMedia.style.backgroundImage = heroImage ? 'url("' + heroImage + '")' : "";
    }

    // Populate car details
    if (title) {
      title.textContent = car.name;
    }
    if (subtitle) {
      subtitle.textContent = car.description;
    }
    if (typeLabel) {
      typeLabel.textContent = car.type;
    }
    if (price) {
      price.textContent = "$" + formatCurrency(car.price);
    }
    if (year) {
      year.textContent = car.year;
    }
    if (mileage) {
      mileage.textContent = car.mileage;
    }
    if (description) {
      description.textContent = car.description;
    }

    if (buyNowButton) {
      buyNowButton.href = createWhatsAppLink(car.name, car.price);
      buyNowButton.target = "_blank";
      buyNowButton.rel = "noopener";
    }

    function updateFavoriteButton(state) {
      if (!favoriteButton) {
        return;
      }
      favoriteButton.textContent = state ? "♥ Favorited" : "♡ Favorite";
      favoriteButton.classList.toggle("is-active", state);
    }

    if (favoriteButton) {
      var currentlyFavorite = isFavorite(car.id);
      updateFavoriteButton(currentlyFavorite);
      favoriteButton.addEventListener("click", function () {
        var newState = toggleFavorite(car.id);
        updateFavoriteButton(newState);
        renderFavoritesSection();
      });
    }

    if (gallery) {
      gallery.innerHTML = "";
      (car.images || []).forEach(function (src) {
        if (src && typeof src === "string" && src.trim() !== "") {
          var img = document.createElement("img");
          img.src = resolveMediaUrl(src);
          img.alt = car.name;
          img.loading = "lazy";
          gallery.appendChild(img);
        }
      });
    }

    // Populate specs grid
    if (specsGrid) {
      specsGrid.innerHTML = "";
      var specs = [
        { label: "Transmission", value: car.transmission },
        { label: "Fuel", value: car.fuelType },
        { label: "Color", value: car.color },
        { label: "Horsepower", value: car.horsepower },
        { label: "Top Speed", value: car.topSpeed },
        { label: "Acceleration", value: car.acceleration }
      ];
      specs.forEach(function (item) {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = "<span>" + item.label + "</span><strong>" + (item.value || "—") + "</strong>";
        specsGrid.appendChild(wrapper);
      });
    }

    // Populate features list
    if (featuresList) {
      featuresList.innerHTML = "";
      (car.features || []).forEach(function (feature) {
        var node = document.createElement("span");
        node.textContent = feature;
        featuresList.appendChild(node);
      });
    }

    // Display videos if available
    if (videoWrapper) {
      videoWrapper.innerHTML = "";
      var videoSrc = getPrimaryVideoSource(car);
      if (!videoSrc) {
        return;
      }
      var container = document.createElement("div");
      container.style.marginBottom = "1rem";

      if (videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be")) {
        var iframe = document.createElement("iframe");
        iframe.src = getYouTubeEmbedUrl(videoSrc);
        iframe.width = "100%";
        iframe.height = "315";
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        container.appendChild(iframe);
      } else if (videoSrc.includes("vimeo.com")) {
        var iframe = document.createElement("iframe");
        iframe.src = getVimeoEmbedUrl(videoSrc);
        iframe.width = "100%";
        iframe.height = "315";
        iframe.frameBorder = "0";
        iframe.allow = "autoplay; fullscreen; picture-in-picture";
        iframe.allowFullscreen = true;
        container.appendChild(iframe);
      } else {
        var video = document.createElement("video");
        video.controls = true;
        video.src = resolveMediaUrl(videoSrc);
        video.style.width = "100%";
        video.style.maxWidth = "600px";
        container.appendChild(video);
      }

      videoWrapper.appendChild(container);
    }
  }

  function handleContactForm() {
    var form = document.getElementById("contactForm");
    var status = document.getElementById("contactStatus");
    if (!form || !status) {
      return;
    }
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var formData = new FormData(form);
      var name = formData.get("name");
      var email = formData.get("email");
      var message = formData.get("message");
      try {
        await fetch(API_BASE_URL + "/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name, email: email, message: message })
        });
        status.textContent = "Thank you! Your message has been sent. Our concierge will reply within one business day.";
        form.reset();
      } catch (error) {
        status.textContent = "Error sending message. Please try again.";
        console.error("Contact form error:", error);
      }
    });
  }

  function handleLoginPage() {
    if (bodyPage !== "login") {
      return;
    }
    var form = document.getElementById("loginForm");
    var status = document.getElementById("loginStatus");
    if (!form) {
      return;
    }
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var formData = new FormData(form);
      var username = (formData.get("username") || "").trim();
      var password = (formData.get("password") || "").trim();
      
      if (!username || !password) {
        if (status) {
          status.textContent = "Please enter both username and password.";
          status.style.color = "red";
        }
        return;
      }
      
      try {
        var result = await apiFetch("/admin-login", {
          method: "POST",
          body: { username: username, password: password }
        });
        if (result && result.token) {
          saveAdminToken(result.token);
          window.location.href = "admin.html";
          return;
        }
      } catch (error) {
        console.warn("Admin login failed:", error);
        if (status) {
          if (error.status === 401) {
            status.textContent = "Invalid credentials. Please check your username and password.";
          } else if (error.message && error.message.includes("fetch")) {
            status.textContent = "Cannot connect to server. Please try again.";
          } else {
            status.textContent = error.message || "Login failed. Please try again.";
          }
          status.style.color = "red";
        }
        return;
      }
      if (status) {
        status.textContent = "Invalid credentials or backend unavailable.";
        status.style.color = "red";
      }
    });
  }

  function isAdminLoggedIn() {
    return Boolean(getAdminToken());
  }

  function logoutAdmin() {
    removeAdminToken();
    localStorage.removeItem(STORAGE_SESSION);
  }

  async function handleAdminPage() {
    // Handle the admin page functionality
    if (bodyPage !== "admin") {
      return;
    }
    if (!isAdminLoggedIn()) {
      window.location.href = "login.html";
      return;
    }
    var form = document.getElementById("adminForm");
    var feedback = document.getElementById("adminFeedback");
    var lineup = document.getElementById("adminCarList");
    var formTitle = document.getElementById("adminFormTitle");
    var logout = document.getElementById("logoutAdmin");
    var resetButton = document.getElementById("resetForm");
    var editingId = null;

    // Initialize control lists
    await populateAdminBrandTypeControls();

    // Add brand and type controls for admin
    var addBrandInput = document.getElementById("addBrandInput");
    var addBrandButton = document.getElementById("addBrandButton");
    var addTypeInput = document.getElementById("addTypeInput");
    var addTypeButton = document.getElementById("addTypeButton");

    if (addBrandButton) {
      addBrandButton.addEventListener("click", function () {
        var brandName = (addBrandInput && addBrandInput.value || "").trim();
        if (!brandName) {
          displayMessage("Please type a brand name.");
          return;
        }
        addBrand(brandName);
        displayMessage("Brand added successfully!");
        populateAdminBrandTypeControls();
        if (window.refreshListings) {
          window.refreshListings();
        }
        if (addBrandInput) {
          addBrandInput.value = "";
        }
      });
    }

    if (addTypeButton) {
      addTypeButton.addEventListener("click", function () {
        var typeName = (addTypeInput && addTypeInput.value || "").trim();
        if (!typeName) {
          displayMessage("Please type a type name.");
          return;
        }
        addType(typeName);
        displayMessage("Type added successfully!");
        populateAdminBrandTypeControls();
        if (window.refreshListings) {
          window.refreshListings();
        }
        if (addTypeInput) {
          addTypeInput.value = "";
        }
      });
    }

    function renderInventory() {
      if (!lineup) {
        return;
      }
      lineup.innerHTML = "";
      var cars = getCars();
      cars.forEach(function (car) {
        var card = document.createElement("div");
        card.className = "admin-car";
        card.innerHTML =
          "<h3>" +
          car.name +
          "</h3><p>Brand: " +
          car.brand +
          "</p><p>Price: $" +
          formatCurrency(car.price) +
          "</p><p>Type: " +
          car.type +
          "</p>";
        var buttonRow = document.createElement("div");
        buttonRow.className = "admin-car-buttons";
        var editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", function () {
          populateForm(car);
        });
        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async function () {
          if (!window.confirm("Remove this car?")) {
            return;
          }
          if (getAdminToken()) {
            try {
              await deleteCarFromServer(car.id);
              await loadCarsFromServer();
            } catch (error) {
              console.warn("Backend delete failed:", error);
              displayMessage("Failed to delete car.");
              return;
            }
          }
          var favs = getFavorites().filter(function (favId) {
            return favId !== car.id;
          });
          saveFavorites(favs);
          renderInventory();
          renderFavoritesSection();
          populateAdminBrandTypeControls();
          if (window.refreshListings) {
            window.refreshListings();
          }
          displayMessage("Car removed.");
        });
        buttonRow.appendChild(editBtn);
        buttonRow.appendChild(deleteBtn);
        card.appendChild(buttonRow);
        lineup.appendChild(card);
      });
    }

    function populateAdminBrandTypeControls() {
      var brandSelect = document.getElementById("adminBrandSelect");
      var typeSelect = document.getElementById("adminTypeSelect");
      var brandListContainer = document.getElementById("brandListContainer");
      var typeListContainer = document.getElementById("typeListContainer");
      if (brandSelect) {
        brandSelect.innerHTML = "<option value=''>Select Brand</option>";
        getBrands().forEach(function (brand) {
          var option = document.createElement("option");
          option.value = brand;
          option.textContent = brand;
          brandSelect.appendChild(option);
        });
      }
      if (typeSelect) {
        typeSelect.innerHTML = "<option value=''>Select Type</option>";
        getTypes().forEach(function (type) {
          var option = document.createElement("option");
          option.value = type;
          option.textContent = type;
          typeSelect.appendChild(option);
        });
      }
      if (brandListContainer) {
        brandListContainer.innerHTML = "";
        getBrands().forEach(function (brand) {
          var row = document.createElement("div");
          row.className = "admin-car";
          row.innerHTML =
            "<span>" +
            brand +
            "</span> <button type='button' class='btn btn-primary'>Delete</button>";
          var button = row.querySelector("button");
          button.addEventListener("click", function () {
            if (getCars().some(function (car) { return car.brand === brand; })) {
              displayMessage("Cannot delete brand with existing cars.");
              return;
            }
            removeBrand(brand);
            populateAdminBrandTypeControls();
            if (window.refreshListings) {
              window.refreshListings();
            }
          });
          brandListContainer.appendChild(row);
        });
      }
      if (typeListContainer) {
        typeListContainer.innerHTML = "";
        getTypes().forEach(function (type) {
          var row = document.createElement("div");
          row.className = "admin-car";
          row.innerHTML =
            "<span>" +
            type +
            "</span> <button type='button' class='btn btn-primary'>Delete</button>";
          var button = row.querySelector("button");
          button.addEventListener("click", function () {
            if (getCars().some(function (car) { return car.type === type; })) {
              displayMessage("Cannot delete type with existing cars.");
              return;
            }
            removeType(type);
            populateAdminBrandTypeControls();
            if (window.refreshListings) {
              window.refreshListings();
            }
          });
          typeListContainer.appendChild(row);
        });
      }
    }

    function displayMessage(text) {
      if (feedback) {
        feedback.textContent = text;
        feedback.style.color = "green";
      }
    }

    function populateForm(car) {
      if (!form) {
        return;
      }
      editingId = car.id;
      formTitle.textContent = "Edit " + car.name;
      form.elements["name"].value = car.name;
      form.elements["brand"].value = car.brand;
      form.elements["price"].value = car.price;
      form.elements["year"].value = car.year;
      form.elements["mileage"].value = car.mileage;
      form.elements["type"].value = car.type;
      form.elements["transmission"].value = car.transmission;
      form.elements["fuelType"].value = car.fuelType;
      form.elements["color"].value = car.color;
      form.elements["horsepower"].value = car.horsepower;
      form.elements["topSpeed"].value = car.topSpeed;
      form.elements["acceleration"].value = car.acceleration;
      form.elements["description"].value = car.description;
      form.elements["features"].value = (car.features || []).join("\n");

    }

    function clearForm() {
      if (!form) {
        return;
      }
      form.reset();
      editingId = null;
      if (formTitle) {
        formTitle.textContent = "Add New Car";
      }
      if (feedback) {
        feedback.textContent = "";
      }
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        clearForm();
      });
    }

    if (form) {
      form.addEventListener("submit", async function (event) {
        event.preventDefault();

        var submitButton = form.querySelector("button[type='submit']");
        var originalButtonText = submitButton ? submitButton.textContent : "";
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Saving...";
        }

        try {
          const formData = new FormData(form);
          var existing = editingId ? getCarById(editingId) : null;
          var existingImages = existing && Array.isArray(existing.images) ? existing.images.slice() : [];
          var existingVideos = existing && Array.isArray(existing.videos) ? existing.videos.slice() : [];
          var existingVideo = existing ? existing.video || existingVideos[0] || "" : "";

          const featureList = (formData.get("features") || "")
            .toString()
            .split("\n")
            .map(function (item) {
              return item.trim();
            })
            .filter(function (item) {
              return item;
            });
          formData.set("features", JSON.stringify(featureList));

          var payload = {
            id: editingId || String(Date.now()),
            name: (formData.get("name") || "").trim(),
            brand: (formData.get("brand") || "").trim(),
            price: Number(formData.get("price")) || 0,
            year: Number(formData.get("year")) || new Date().getFullYear(),
            mileage: (formData.get("mileage") || "").trim(),
            type: (formData.get("type") || "").trim(),
            transmission: (formData.get("transmission") || "").trim(),
            fuelType: (formData.get("fuelType") || "").trim(),
            color: (formData.get("color") || "").trim(),
            horsepower: (formData.get("horsepower") || "").trim(),
            topSpeed: (formData.get("topSpeed") || "").trim(),
            acceleration: (formData.get("acceleration") || "").trim(),
            description: (formData.get("description") || "").trim(),
            features: featureList,
            images: existingImages,
            videos: existingVideos,
            video: existingVideo
          };

          var savedCar = null;
          if (getAdminToken()) {
            try {
              const endpoint = editingId ? "/edit-car/" + editingId : "/add-car";
              const method = editingId ? "PUT" : "POST";

              const response = await fetch(API_BASE_URL + endpoint, {
                method: method,
                headers: {
                  Authorization: "Bearer " + getAdminToken()
                },
                body: formData
              });

              if (!response.ok) {
                const errorData = await response.json().catch(function () {
                  return {};
                });
                throw new Error(errorData.error || "HTTP " + response.status);
              }

              savedCar = await response.json();
            } catch (error) {
              console.warn("Backend save failed:", error);
              throw error;
            }
          }

          if (savedCar && savedCar.id) {
            await loadCarsFromServer();
            if (editingId) {
              displayMessage("Car updated successfully!");
            } else {
              displayMessage("Car added successfully!");
            }
          }

          if (window.refreshListings) {
            window.refreshListings();
          }

          clearForm();
          renderInventory();
          renderFavoritesSection();
        } catch (error) {
          console.error("Form submission error:", error);
          if (feedback) {
            feedback.textContent = "Error saving car: " + (error.message || "Unknown error");
            feedback.style.color = "red";
          }
        } finally {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
          }
        }
      });
    }

    if (logout) {
      logout.addEventListener("click", function () {
        logoutAdmin();
        window.location.href = "login.html";
      });
    }

    renderInventory();
  }

  document.addEventListener("DOMContentLoaded", async function () {
    await loadCarsFromServer();
    ensureBrandTypeLists();
    highlightNav();
    handleNavigationToggle();
    handleIndexPage();
    handleListingsPage();
    handleFavoritesPage();
    handleDetailsPage();
    handleContactForm();
    handleLoginPage();
    if (bodyPage === "admin") {
      var validAdmin = await validateAdminToken();
      if (!validAdmin) {
        window.location.href = "login.html";
        return;
      }
    }
    handleAdminPage();
  });
})();
