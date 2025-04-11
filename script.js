/**
 * Main application initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initParticles();
    initRotatingTitles();
    initTimeline();
    initMouseFollower();
    initAIAssistant();
    initHeroAnimations();
    initSmoothScrolling();
    initProjectModals();
});

/**
 * Particles.js initialization
 */
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#01b9ff" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { 
                    enable: true, 
                    distance: 150, 
                    color: "#01b9ff", 
                    opacity: 0.2, 
                    width: 1 
                },
                move: { 
                    enable: true, 
                    speed: 2, 
                    direction: "none", 
                    random: false, 
                    straight: false, 
                    out_mode: "out" 
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
}

/**
 * Rotating titles in hero section
 */
function initRotatingTitles() {
    const titles = document.querySelectorAll(".title");
    let titleIndex = 0;

    function showNextTitle() {
        titles.forEach(title => title.style.opacity = "0");
        gsap.to(titles[titleIndex], {
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut"
        });
        titleIndex = (titleIndex + 1) % titles.length;
    }

    if (titles.length > 0) {
        // Show first title immediately
        titles[0].style.opacity = "1";
        
        // Start rotation after first title is visible
        setTimeout(() => {
            setInterval(showNextTitle, 3000);
        }, 1000);
    }
}

/**
 * Interactive timeline initialization
 */
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Initialize timeline items
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    function checkTimelineVisibility() {
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY || window.pageYOffset;
        
        timelineItems.forEach(item => {
            const itemPosition = item.getBoundingClientRect().top + scrollPosition;
            const itemHeight = item.offsetHeight;
            
            if (scrollPosition > itemPosition - windowHeight + itemHeight * 0.5) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }
    
    window.addEventListener('scroll', checkTimelineVisibility);
    window.addEventListener('load', checkTimelineVisibility);
}

/**
 * Mouse follower initialization
 */
function initMouseFollower() {
    const follower = document.querySelector('.mouse-follower');
    if (!follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let speed = 0.2;

    function animate() {
        // Calculate distance between mouse and follower
        let distX = mouseX - followerX;
        let distY = mouseY - followerY;
        
        // Easing motion
        followerX += distX * speed;
        followerY += distY * speed;
        
        // Apply styles
        follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
        
        requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Change size when hovering interactive elements
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(follower, {
                width: '50px',
                height: '50px',
                duration: 0.3
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(follower, {
                width: '30px',
                height: '30px',
                duration: 0.3
            });
        });
    });

    animate();
}

/**
 * AI Assistant functionality
 */
function initAIAssistant() {
    const aiAssistant = document.getElementById('aiAssistant');
    if (!aiAssistant) return;

    const aiModal = document.getElementById('aiModal');
    const closeModal = document.querySelector('.close-ai-modal');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiUserInput = document.getElementById('aiUserInput');
    const aiChat = document.getElementById('aiChat');
    const voiceBtn = document.getElementById('voiceBtn');
    
    // Knowledge base
    const knowledgeBase = {
        "who are you": "I'm an AI assistant created to provide information about Saadoun Ben Maatar, an Embedded Systems Engineer and PCB Designer.",
        "background": "Saadoun has a Master's Degree in Embedded Systems Electronics from Ziane Achour University (2022-2024).",
        "skills": "Saadoun specializes in: Embedded Systems, PCB Design, IoT Development, STM Microcontrollers, ESP32, and Raspberry Pi.",
        "projects": "Key projects include: Smart Neonatal Care (SNC) system for premature infant monitoring, and various IoT solutions.",
        "contact": "You can contact Saadoun via email or LinkedIn. The contact information is available in the contact section.",
        "experience": "Saadoun has experience in industrial automation, telecommunications security, and has developed Chrome extensions and Android applications.",
        "default": "I'm sorry, I didn't understand that question. Could you try asking about Saadoun's background, skills, projects, or experience?"
    };
    
    // Modal control
    aiAssistant.addEventListener('click', () => toggleModal(true));
    closeModal?.addEventListener('click', () => toggleModal(false));
    
    window.addEventListener('click', function(event) {
        if (event.target === aiModal) toggleModal(false);
    });
    
    // Chat functionality
    if (aiSendBtn) aiSendBtn.addEventListener('click', handleUserInput);
    if (aiUserInput) aiUserInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleUserInput());
    
    // Voice recognition
    initVoiceRecognition();
    
    // Floating animation
    gsap.to(aiAssistant, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    function toggleModal(show) {
        if (show) {
            aiModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            gsap.from(aiModal, { opacity: 0, duration: 0.3 });
            aiUserInput?.focus();
        } else {
            gsap.to(aiModal, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    aiModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }

    function handleUserInput() {
        const userMessage = aiUserInput.value.trim();
        if (!userMessage) return;
        
        addMessageToChat('user', userMessage);
        aiUserInput.value = '';
        
        showTypingIndicator();
        
        // Simulate thinking delay
        setTimeout(() => {
            hideTypingIndicator();
            addMessageToChat('ai', generateResponse(userMessage.toLowerCase()));
        }, 1000 + Math.random() * 1000);
    }

    function addMessageToChat(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}-message`;
        
        messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'AI'}:</strong> ${message}`;
        
        if (sender === 'user') {
            messageDiv.style.cssText = `
                text-align: right;
                border-left: none;
                border-right: 3px solid #01b9ff;
                background-color: rgba(0, 255, 255, 0.1);
            `;
        }
        
        aiChat.appendChild(messageDiv);
        aiChat.scrollTop = aiChat.scrollHeight;
    }

    function generateResponse(question) {
        for (const [key, value] of Object.entries(knowledgeBase)) {
            if (question.includes(key)) return value;
        }
        return knowledgeBase.default;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<strong>AI is typing...</strong>';
        aiChat.appendChild(typingDiv);
        aiChat.scrollTop = aiChat.scrollHeight;
    }

    function hideTypingIndicator() {
        document.getElementById('typing-indicator')?.remove();
    }

    function initVoiceRecognition() {
        if (!voiceBtn || !('webkitSpeechRecognition' in window)) {
            voiceBtn?.style.setProperty('display', 'none');
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        voiceBtn.addEventListener('click', function() {
            recognition.start();
            voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            voiceBtn.style.backgroundColor = '#ff0000';
            
            recognition.onresult = (event) => {
                aiUserInput.value = event.results[0][0].transcript;
                handleUserInput();
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
            };
            
            recognition.onend = () => {
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceBtn.style.backgroundColor = '#01b9ff';
            };
        });
    }
}

/**
 * Hero section animations
 */
function initHeroAnimations() {
    const heroContent = document.querySelector('#hero .hero-content');
    if (!heroContent) return;

    // Initial state
    gsap.set(heroContent.children, { opacity: 0, y: 20 });

    // Animate in sequence
    const tl = gsap.timeline();
    tl.from(heroContent.querySelector('h2'), {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power2.out"
    })
    .from(heroContent.querySelector('h1'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.4")
    .from(heroContent.querySelectorAll('.title'), {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.3")
    .from(heroContent.querySelector('.resume-btn'), {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out"
    }, "-=0.2");
}

/**
 * Smooth scrolling for navigation
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const toolbarHeight = document.querySelector('.toolbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - toolbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });
}

/**
 * Project modals functionality - Enhanced version
 */
function initProjectModals() {
    const projectModal = document.getElementById('project-modal');
    if (!projectModal) return;

    // DOM elements
    const elements = {
        modal: projectModal,
        content: projectModal.querySelector('.modal-content'),
        closeBtn: projectModal.querySelector('.close-modal'),
        title: document.getElementById('modal-title'),
        gallery: document.getElementById('modal-images'),
        description: document.getElementById('modal-description'),
        githubLink: document.getElementById('github-link'),
        prevBtn: document.getElementById('prev-project'),
        nextBtn: document.getElementById('next-project')
    };

    // Project data - Expanded with more details
    const projectsData = {
        "snc": {
            title: "Smart Neonatal Care (SNC)",
            description: "A comprehensive monitoring system for premature infants in incubators with real-time vital signs tracking and AI-powered anomaly detection.",
            longDescription: `
                <p>The Smart Neonatal Care system revolutionizes infant care in NICUs by providing:</p>
                <ul>
                    <li>Continuous monitoring of 7 vital parameters including heart rate, oxygen saturation, and temperature</li>
                    <li>Non-contact sensors to minimize stress on premature infants</li>
                    <li>AI algorithms with 98.7% accuracy in detecting anomalies</li>
                    <li>Real-time alerts to medical staff via mobile and desktop dashboards</li>
                </ul>
                <p><strong>Impact:</strong> Reduced nursing workload by 40% while improving detection of critical events by 35%.</p>
            `,
            images: [
                "imagesproject1.jpg",
                "snc-dashboard.jpg",
                "snc-hardware.jpg",
                "snc-algorithm.jpg"
            ],
            technologies: ["STM32", "ESP32-C3", "TensorFlow Lite", "React.js", "PCB Design"],
            github: "https://github.com/wail08/smart-neonatal-care",
            youtube: "https://www.youtube.com/watch?v=L1JTGYhLOXE",
            duration: "6 months (2023)",
            team: "3 engineers + 2 medical consultants"
        },
        "mpu9250": {
            title: "ESP32 with MPU9250 IMU",
            description: "Complete tutorial on interfacing 9-axis motion tracking with ESP32, including sensor fusion and 3D visualization.",
            longDescription: `
                <p>This comprehensive guide covers all aspects of working with the MPU9250 9-axis IMU:</p>
                <ul>
                    <li>Detailed hardware setup with circuit diagrams</li>
                    <li>Sensor calibration procedures for accurate readings</li>
                    <li>Implementation of Mahony filter for sensor fusion</li>
                    <li>3D orientation visualization using Three.js</li>
                </ul>
                <p><strong>Key Features:</strong> Plug-and-play code examples, performance optimization tips, and troubleshooting guide.</p>
            `,
            images: [
                "esp32 c3 mini2.png",
                "esp32 c3 mini.png",
                "mpu9250-circuit.jpg",
                "orientation-visualization.jpg"
            ],
            technologies: ["ESP32", "Arduino", "MPU9250", "Three.js", "Web Bluetooth"],
            github: "https://github.com/wail08/esp32-mpu9250",
            duration: "2 months (2022)",
            team: "Solo project"
        },
        "lilygo": {
            title: "LilyGo T-Call SIM800",
            description: "IoT solution using ESP32 with cellular connectivity for remote monitoring applications.",
            longDescription: `
                <p>This project demonstrates how to create a battery-powered IoT device with:</p>
                <ul>
                    <li>GSM connectivity using SIM800L module</li>
                    <li>TP4056 lithium battery management</li>
                    <li>Low-power design for extended battery life</li>
                    <li>MQTT communication for cloud integration</li>
                </ul>
            `,
            images: [
                "LilyGo T-Call SIM800 Series.png",
                "lilygo-circuit.jpg",
                "lilygo-dashboard.jpg"
            ],
            technologies: ["ESP32", "SIM800L", "MQTT", "LiPo Battery"],
            github: "https://github.com/wail08/lilygo-t-call",
            duration: "3 months (2023)",
            team: "2 engineers"
        }
    };

    // State management
    const state = {
        currentProjectId: null,
        isAnimating: false,
        activeImageIndex: 0
    };

    // Initialize event listeners
    setupEventListeners();

    function setupEventListeners() {
        // Learn more buttons
        document.querySelectorAll('.learn-more-btn').forEach(button => {
            button.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project');
                if (projectId && projectsData[projectId]) {
                    openProjectModal(projectId);
                }
            });
        });

        // Modal controls
        elements.closeBtn.addEventListener('click', closeModal);
        elements.modal.addEventListener('click', function(e) {
            if (e.target === elements.modal) {
                closeModal();
            }
        });

        // Navigation buttons
        if (elements.prevBtn) elements.prevBtn.addEventListener('click', showPreviousProject);
        if (elements.nextBtn) elements.prevBtn.addEventListener('click', showNextProject);

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (elements.modal.style.display === 'block') {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowLeft') showPreviousProject();
                if (e.key === 'ArrowRight') showNextProject();
            }
        });
    }

    function openProjectModal(projectId) {
        if (state.isAnimating) return;
        state.isAnimating = true;
        state.currentProjectId = projectId;
        state.activeImageIndex = 0;

        const project = projectsData[projectId];
        if (!project) return;

        // Set content
        elements.title.textContent = project.title;
        elements.description.innerHTML = project.longDescription || project.description;
        elements.githubLink.href = project.github || '#';
        elements.githubLink.style.display = project.github ? 'block' : 'none';

        // Clear and rebuild gallery
        elements.gallery.innerHTML = '';
        project.images.forEach((imageSrc, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `${project.title} - Image ${index + 1}`;
            img.loading = 'lazy';
            img.dataset.index = index;
            
            img.addEventListener('click', () => openImageOverlay(imageSrc, project.title));
            
            imgContainer.appendChild(img);
            elements.gallery.appendChild(imgContainer);
        });

        // Show modal with animation
        elements.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        gsap.timeline()
            .from(elements.modal, { opacity: 0, duration: 0.3 })
            .from(elements.content, { 
                y: 50, 
                opacity: 0, 
                duration: 0.4, 
                ease: "back.out(1.2)" 
            })
            .from(elements.title, {
                y: -20,
                opacity: 0,
                duration: 0.3
            }, "-=0.3")
            .from(elements.gallery.children, {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.3
            }, "-=0.2")
            .call(() => {
                state.isAnimating = false;
            });
    }

    function closeModal() {
        if (state.isAnimating) return;
        state.isAnimating = true;

        gsap.timeline()
            .to(elements.content, { 
                y: 50, 
                opacity: 0, 
                duration: 0.3, 
                ease: "power2.in" 
            })
            .to(elements.modal, { 
                opacity: 0, 
                duration: 0.2 
            })
            .call(() => {
                elements.modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                state.isAnimating = false;
                state.currentProjectId = null;
            });
    }

    function showNextProject() {
        if (state.isAnimating || !state.currentProjectId) return;
        
        const projectIds = Object.keys(projectsData);
        const currentIndex = projectIds.indexOf(state.currentProjectId);
        const nextIndex = (currentIndex + 1) % projectIds.length;
        
        closeModal();
        setTimeout(() => {
            openProjectModal(projectIds[nextIndex]);
        }, 300);
    }

    function showPreviousProject() {
        if (state.isAnimating || !state.currentProjectId) return;
        
        const projectIds = Object.keys(projectsData);
        const currentIndex = projectIds.indexOf(state.currentProjectId);
        const prevIndex = (currentIndex - 1 + projectIds.length) % projectIds.length;
        
        closeModal();
        setTimeout(() => {
            openProjectModal(projectIds[prevIndex]);
        }, 300);
    }

    function openImageOverlay(src, alt) {
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        
        const imgContainer = document.createElement('div');
        imgContainer.className = 'enlarged-image-container';
        
        const img = new Image();
        img.src = src;
        img.alt = alt;
        img.className = 'enlarged-image';
        
        imgContainer.appendChild(img);
        overlay.appendChild(imgContainer);
        document.body.appendChild(overlay);
        
        // Animation
        gsap.from(overlay, { opacity: 0, duration: 0.3 });
        gsap.from(imgContainer, { 
            scale: 0.4, 
            duration: 0.1, 
            ease: "back.out(1.7)" 
        });
        
        // Close handler
        overlay.addEventListener('click', () => {
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.1,
                onComplete: () => overlay.remove()
            });
        });
        
        // Keyboard close
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        overlay.remove();
                        document.removeEventListener('keydown', closeOnEscape);
                    }
                });
            }
        });
    }
}


