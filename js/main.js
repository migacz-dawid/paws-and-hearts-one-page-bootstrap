// Close mobile menu, link click
const navbarLinks = document.querySelectorAll('.navbar-collapse .nav-link')
const navbarCollapse = document.querySelector('.navbar-collapse')
// Close menu, clicking outside of it
const navbar = document.querySelector('.navbar-collapse')
const toggler = document.querySelector('.navbar-toggler')
// AboutUs Counter
const counterItems = document.querySelectorAll('.counter')
const counterBox = document.querySelector('#about')
//MODAL
const allModals = document.querySelectorAll('.modal')
// Contact form
const msgStatus = document.querySelector('.contact-status')
const username = document.querySelector('#name')
const email = document.querySelector('#email')
const msg = document.querySelector('#msg')
const checkBox = document.querySelector('#consent')
const contactSatus = document.querySelector('.contact-error')
const sendBtn = document.querySelector('.contact-btn')
//Donation Counter
const targetAmount = 50000
const currentAmount = 37500
const counter = document.getElementById('donation-counter')
const progressBar = document.getElementById('donation-progress')
const donationSection = document.getElementById('donation')

let hasAnimated = false

//-----------------------------------------------------
// Close mobile menu, link click
const handleNavLinkClick = () => {
	const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse)
	if (bsCollapse) bsCollapse.hide()
}

navbarLinks.forEach(link => {
	link.addEventListener('click', handleNavLinkClick)
})

//-----------------------------------------------------
// Close menu, clicking outside of it
const handleDocumentClick = event => {
	const clickedOutsideNavbar = !navbar.contains(event.target)
	const clickedOutsideToggler = !toggler.contains(event.target)
	const isNavbarOpen = navbar.classList.contains('show')

	if (isNavbarOpen && clickedOutsideNavbar && clickedOutsideToggler) {
		const bsCollapse = bootstrap.Collapse.getInstance(navbar)
		if (bsCollapse) bsCollapse.hide()
	}
}

//-----------------------------------------------------
// AboutUs Counter
const options = {
	// rootMargin: '-100px'
	threshold: 0.75,
	rootMargin: '0px'
}

const startCounter = (entries, observer) => {
	if (entries[0].isIntersecting) {

		counterItems.forEach(counter => {
			const updateCounter = () => {
				const finalNumber = parseInt(counter.getAttribute('data-target'))
				const value = parseInt(counter.textContent)
				const speed = finalNumber / 300

				if (value < finalNumber) {
					counter.textContent = `${Math.floor(value + speed)}`
					setTimeout(updateCounter, 1)
				} else {
					counter.textContent = finalNumber
				}
			}
			updateCounter()
		})

		observer.unobserve(entries[0].target) 
	}
}


//-----------------------------------------------------
//Donation Counter
const animateDonationCounter = () => {
	if (hasAnimated) return
	hasAnimated = true

	let count = 0
	const interval = setInterval(() => {
		if (count >= currentAmount) {
			clearInterval(interval)
		} else {
			count += 250
			counter.textContent = count.toLocaleString('pl-PL')
			progressBar.style.width = (count / targetAmount) * 100 + '%'
		}
	}, 20)
}
const handleIntersection = (entries, observer) => {
	if (entries[0].isIntersecting) {
		animateDonationCounter()
		observer.unobserve(entries[0].target)
	}
}

const observerOptions = {
	threshold: 0.5
}

//-----------------------------------------------------
// SWIPER
const swiper = new Swiper('.swiper', {
	loop: true,
	slidesPerView: 'auto',
	centeredSlides: true,
	spaceBetween: 40,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},
})

//-----------------------------------------------------
//MODAL
allModals.forEach(modal => {
	let triggerButton = null

	const handleShow = event => {
		triggerButton = event.relatedTarget
	}

	const handleShown = () => {
		setTimeout(() => {
			if (triggerButton) {
				triggerButton.blur()
				triggerButton = null
				modal.removeAttribute('inert')
			}
		}, 400)
	}

	const handleHide = () => {
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur()
			modal.setAttribute('inert', '')
		}
	}

	modal.addEventListener('show.bs.modal', handleShow)
	modal.addEventListener('shown.bs.modal', handleShown)
	modal.addEventListener('hide.bs.modal', handleHide)
})


//-----------------------------------------------------
//Contact Form
const showError = message => {
	// contactSatus.classList.add('contact-status--active')
	contactSatus.textContent = message
}

const clearError = () => {
	// contactSatus.classList.remove('contact-status--active')
	contactSatus.textContent = ''
}

const checkForm = () => {
	if (username.value === '' || email.value === '' || msg.value === '') {
		showError('Nie uzupełniono wszystkich pól!')
		return false
	} else {
		clearError()
		return true
	}
}

const checkMail = email => {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	if (re.test(email.value) && email.value !== '') {
		clearError()
		return true
	} else {
		showError('Email jest niepoprawny')
		return false
	}
}

const ischecked = () => {
	if (!checkBox.checked) {
		showError('Nie wyrażono zgody!')
		return false
	} else {
		clearError()
		return true
	}
}

const sendStatus = () => {
	username.value = ''
	email.value = ''
	msg.value = ''
	checkBox.checked = false
	alert('Email został wysłany')
}

const validateForm = event => {
	clearError()

	if (!checkForm()) {
		event.preventDefault()
		return
	}

	if (!checkMail(email)) {
		event.preventDefault()
		return
	}

	if (!ischecked()) {
		event.preventDefault()
		return
	}

	sendStatus()
}

//-----------------------------------------------------
//Footer Year
const footerYear = document.querySelector('.footer-year')

const handleCurrentYear = () => {
	const year = new Date().getFullYear()
	footerYear.innerText = year
}
handleCurrentYear()

// Close menu, clicking outside of it
document.addEventListener('click', handleDocumentClick)
// AboutUs Counter
const observer = new IntersectionObserver(startCounter, options)
observer.observe(counterBox)
//Donation Counter
const observer2 = new IntersectionObserver(handleIntersection, observerOptions)
observer2.observe(donationSection)
//Form Btn
sendBtn.addEventListener('click', e => {
	e.preventDefault() // Don't send email. Demonstration purposes
	validateForm(e)
})
