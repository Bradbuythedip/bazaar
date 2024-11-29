// Fade-in animation for elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
});

// Form handling
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const userType = document.querySelector('input[name="user-type"]:checked').value;
        
        // Store user preferences
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userType', userType);
        
        // Redirect to appropriate questionnaire page
        window.location.href = 'questions.html';
    });
}

// Navigation handling
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Gallery filtering and sorting
const galleryContainer = document.querySelector('.gallery');
if (galleryContainer) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const items = galleryContainer.querySelectorAll('.gallery-item');
            items.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Profile image upload preview
const profileImageInput = document.getElementById('profile-image-input');
const profileImagePreview = document.getElementById('profile-image-preview');

if (profileImageInput && profileImagePreview) {
    profileImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Bounty system functionality
class BountySystem {
    constructor() {
        this.bounties = [];
    }

    createBounty(title, description, budget, deadline) {
        const bounty = {
            id: Date.now(),
            title,
            description,
            budget,
            deadline,
            status: 'open',
            proposals: []
        };
        this.bounties.push(bounty);
        this.saveBounties();
        return bounty;
    }

    submitProposal(bountyId, designerId, proposal) {
        const bounty = this.bounties.find(b => b.id === bountyId);
        if (bounty && bounty.status === 'open') {
            bounty.proposals.push({
                designerId,
                proposal,
                timestamp: Date.now()
            });
            this.saveBounties();
            return true;
        }
        return false;
    }

    saveBounties() {
        localStorage.setItem('bounties', JSON.stringify(this.bounties));
    }

    loadBounties() {
        const stored = localStorage.getItem('bounties');
        this.bounties = stored ? JSON.parse(stored) : [];
    }
}

// Initialize bounty system
const bountySystem = new BountySystem();
bountySystem.loadBounties();