// PAGE INITIALIZATION

let allUpdates = [];
let currentPage = 1;
const updatesPerPage = 10;

function initializePage() {
    const delay = 75;
    const h1 = document.getElementById('title');
    const text = h1.textContent;
    h1.textContent = '';

    text.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        h1.appendChild(span);
    });

    const spans = h1.querySelectorAll('span');
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.classList.add('bounce');
        }, index * delay);
    });
}

// RELEASE UPDATES

function fetchReleaseUpdates() {
    fetch('./data/updates.json')
        .then(response => response.json())
        .then(data => {
            allUpdates = data.updates;
            displayUpdates();
            setupShowMoreButton();
        })
        .catch(error => {
            console.error('Error fetching updates:', error);
        });
}

function displayUpdates() {
    const updatesContainer = document.getElementById('updates-container');
    const startIndex = (currentPage - 1) * updatesPerPage;
    const endIndex = startIndex + updatesPerPage;
    const updatesToShow = allUpdates.slice(startIndex, endIndex);

    updatesToShow.forEach(update => {
        const updateElement = document.createElement('p');
        updateElement.innerHTML = `<b>${update.date}</b> - ${update.content}`;
        updatesContainer.appendChild(updateElement);
    });
}

function setupShowMoreButton() {
    const showMoreButton = document.getElementById('show-more');
    if (allUpdates.length > currentPage * updatesPerPage) {
        showMoreButton.style.display = 'block';
        showMoreButton.addEventListener('click', showMoreUpdates);
    } else {
        showMoreButton.style.display = 'none';
    }
}

function showMoreUpdates() {
    currentPage++;
    displayUpdates();
    setupShowMoreButton();
}

// SIDEBAR

function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarLinks = document.getElementById('sidebar-links');
    const headers = document.querySelectorAll('h3');

    // Populate sidebar with header links
    headers.forEach((header, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#header-${index}`;
        a.textContent = header.textContent;
        li.appendChild(a);
        sidebarLinks.appendChild(li);

        // Add id to the header for linking
        header.id = `header-${index}`;
    });

    // Toggle sidebar
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        document.body.classList.toggle('sidebar-open');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (event) => {
        if (!sidebar.contains(event.target) && event.target !== sidebarToggle) {
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
        }
    });

    // Smooth scroll to header when sidebar link is clicked
    sidebarLinks.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const targetId = event.target.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// FADE IN EFFECT

const fadeInElements = document.getElementsByClassName('profile');

async function fadeIn() {
    await new Promise(resolve => setTimeout(resolve, 500));
    fadeInElements[0].style.opacity = 1;
    await new Promise(resolve => setTimeout(resolve, 500));
    fadeInElements[1].style.opacity = 1;
    await new Promise(resolve => setTimeout(resolve, 500));
    fadeInElements[2].style.opacity = 1;
}

// IMAGE GALLERY FUNCTIONALITY

let currentImageIndex = 1;

function showImage(index) {
    const imageElements = document.querySelectorAll('.slider-image');
    imageElements.forEach((image, i) => {
        if (i + 1 === index) {
            image.style.display = 'block';
        } else {
            image.style.display = 'none';
        }
    });
}

function nextImage() {
    if (currentImageIndex < 3) { // Change 3 to the total number of images in your set
        currentImageIndex++;
    } else {
        currentImageIndex = 1;
    }
    showImage(currentImageIndex);
}

function prevImage() {
    if (currentImageIndex > 1) {
        currentImageIndex--;
    } else {
        currentImageIndex = 3; // Change 3 to the total number of images in your set
    }
    showImage(currentImageIndex);
}

showImage(currentImageIndex);

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    fetchReleaseUpdates();
    initializeSidebar();
    fadeIn();
});
