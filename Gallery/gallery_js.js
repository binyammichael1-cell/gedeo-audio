document.addEventListener('DOMContentLoaded', function() {
    // Typing effect for the intro text
    const textElement = document.getElementById('typing-text');
    const texts = [
        "The 2017 kids learning in Gedeo School",
        "Our Big learning journey this year",
        "Memories from Past our adventures!"
    ];
    const captions = [
        "Science experiment day",
        "Art class masterpiece",
        "Outdoor nature study",
        "Reading circle time",
        "Math puzzle challenge",
        "Storytelling session",
        "Music and movement",
        "Building blocks fun",
        "Watercolor painting",
        "Dramatic play corner",
        "Gardening activity",
        "Puppet show performance",
        "Sensory bin exploration",
        "Alphabet games",
        "Number counting",
        "Shape recognition",
        "Color mixing",
        "Team building",
        "Show and tell",
        "Field trip memories"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(typeText, typingSpeed);
    }
    
    // Generate gallery items
    const galleryContainer = document.querySelector('.gallery-container');
    const imageCount = 30;
    
    for (let i = 1; i <= imageCount; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = `images/st${i}.jpg`;
        img.alt = `Student activity ${i}`;
        img.loading = 'lazy';
        
        const imgNumber = document.createElement('div');
        imgNumber.className = 'img-number';
        imgNumber.textContent = `#${i}`;
        
        const imgCaption = document.createElement('div');
        imgCaption.className = 'img-caption';
        imgCaption.textContent = captions[i-1] || `Learning activity ${i}`;
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(imgNumber);
        galleryItem.appendChild(imgCaption);
        galleryContainer.appendChild(galleryItem);
        
        // Add animation delay for staggered appearance
        galleryItem.style.animationDelay = `${i * 0.1}s`;
        
        // Click event to enlarge image
        galleryItem.addEventListener('click', function() {
            this.classList.toggle('enlarged');
        });
    }
    
    // Start typing effect after slight delay
    setTimeout(typeText, 1000);
});