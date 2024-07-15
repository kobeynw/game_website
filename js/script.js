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

const images = [
    { src: "./pictures/AI_mineshaft.PNG", alt: "Mine Shaft", title: "World 6: Mine Shaft" },
    { src: "./pictures/AI_casino.PNG", alt: "Casino", title: "World 1: Casino" },
    { src: "./pictures/player.jpeg", alt: "Tatto Parlor", title: "World 2: Tatto Parlor" },
    { src: "./pictures/player.jpeg", alt: "Oil Field", title: "World 3: Oil Field" },
    { src: "./pictures/player.jpeg", alt: "Oasis", title: "World 4: Oasis" },
    { src: "./pictures/player.jpeg", alt: "Restaurant", title: "World 5: Restaurant" }
];

let currentIndex = 1;

function createImageElement(image, className) {
    const div = document.createElement('div');
    div.className = `slider-image ${className}`;
    div.innerHTML = `
        <img src="${image.src}" alt="${image.alt}">
        <h2>${image.title}</h2>
    `;
    return div;
}

function updateSlider() {
    const sliderImages = document.querySelector('.slider-images');
    const farPrevIndex = (currentIndex - 2 + images.length) % images.length;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;
    const farNextIndex = (currentIndex + 2) % images.length;

    sliderImages.innerHTML = '';
    sliderImages.appendChild(createImageElement(images[farPrevIndex], 'far-prev'));
    sliderImages.appendChild(createImageElement(images[prevIndex], 'prev'));
    sliderImages.appendChild(createImageElement(images[currentIndex], 'current'));
    sliderImages.appendChild(createImageElement(images[nextIndex], 'next'));
    sliderImages.appendChild(createImageElement(images[farNextIndex], 'far-next'));
}

function changeImage(direction) {
    const sliderImages = document.querySelector('.slider-images');
    const imageElements = sliderImages.querySelectorAll('.slider-image');
    
    imageElements.forEach(img => {
        const currentClass = img.className.split(' ')[1];
        let newClass;
        
        if (direction === 1) {
            newClass = {
                'far-prev': 'hidden',
                'prev': 'far-prev',
                'current': 'prev',
                'next': 'current',
                'far-next': 'next'
            }[currentClass];
        } else {
            newClass = {
                'far-prev': 'prev',
                'prev': 'current',
                'current': 'next',
                'next': 'far-next',
                'far-next': 'hidden'
            }[currentClass];
        }
        
        img.className = `slider-image ${newClass}`;
    });

    setTimeout(() => {
        currentIndex = (currentIndex + direction + images.length) % images.length;
        updateSlider();
    }, 500); // This should match the transition duration in CSS
}

// MAIN FUNCTION CALLS

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    fetchReleaseUpdates();
    initializeSidebar();
    fadeIn();
    updateSlider();
});
