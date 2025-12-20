/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

/* ====== MENU SHOW ====== */
//    Validate if Constant exsists 
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

/*=== MENU HIDDEN ===*/
// Validate if Constant Exsist
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu')

    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== ADD BLUR TO HEADER ===============*/

const blurHeader = () => {
    const header = document.getElementById('header')
    this.scrollY >= 50 ? header.classList.add('blur-header')
        : header.classList.remove('blur-header')
}
window.addEventListener('scroll', blurHeader)

/*=============== FORM SUBMIT (FORMSPREE) ===============*/
const contactForm = document.getElementById('contact-form')
const contactMessage = document.getElementById('contact-message')
const submitButton = document.getElementById('contact-submit')
const buttonText = submitButton?.querySelector('.button-text')
const buttonLoader = submitButton?.querySelector('.button-loader')

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        // UI: show loader
        submitButton.disabled = true
        submitButton.classList.add('loading')
        contactMessage.textContent = ''

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })

            if (response.ok) {
                contactMessage.textContent = 'Message sent successfully.'
                contactForm.reset()
            } else {
                contactMessage.textContent = 'Message not sent. Please try again later.'
            }
        } catch (error) {
            contactMessage.textContent = 'Network error. Please try again.'
        } finally {
            submitButton.classList.remove('loading')
            setTimeout(() => {
                contactMessage.textContent = ''
            }, 5000)
            submitButton.disabled = false
        }
    })
}
/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up')

    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
        : scrollUp.classList.remove('show-scroll')

}

window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight, sectionTop = current.offsetTop - 58, sectionId = current.getAttribute('id');
        const sectionsClass = document.querySelectorAll('.nav__menu a[href*=' + sectionId + ']');

        sectionsClass.forEach(link => {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });
    });
};

window.addEventListener('scroll', scrollActive);

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 200,
    reset: true  // Animation Repeat
})

sr.reveal('.home__data, .home__social, .contact_container, .footer_container')
sr.reveal('.home__image', { origin: 'bottom' })
sr.reveal('.about__data', { origin: 'left' })
sr.reveal('.about__image', { origin: 'right' })
sr.reveal('.skills_data', { origin: 'left' })
sr.reveal('.skill_box', { origin: 'right' })
sr.reveal('.services_card', { interval: 100 })
sr.reveal('.projects_card', { origin: 'right' })
