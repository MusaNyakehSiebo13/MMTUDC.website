/*
	main.js
	Improved JS for the MMTU Debating Council page.
	Features:
	- Accessible mobile menu toggle with click-outside handling
	- Tab activation (shows/hides tab-content blocks when data-target is used)
	- Join form validation with basic email check
	- Inserts today's date into #debate-date
	- Smooth internal scrolling
	- Small, optional hero parallax effect (subtle)
*/

(() => {
	const qs = sel => document.querySelector(sel);
	const qsa = sel => Array.from(document.querySelectorAll(sel));

	function initMenuToggle() {
		const menuToggle = qs('.menu-toggle');
		const navLinks = qs('.navbar-links');
		if (!menuToggle || !navLinks) return;

		const show = () => {
			navLinks.style.display = 'flex';
			menuToggle.setAttribute('aria-expanded', 'true');
		};
		const hide = () => {
			navLinks.style.display = '';
			menuToggle.setAttribute('aria-expanded', 'false');
		};

		menuToggle.addEventListener('click', (e) => {
			const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
			if (expanded) hide(); else show();
		});

		// click outside to close
		document.addEventListener('click', (e) => {
			if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
				hide();
			}
		});

		// keyboard ESC to close
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') hide();
		});
	}

	function initTabs() {
		const tabs = qsa('.tab-item');
		if (!tabs.length) return;

		tabs.forEach(tab => {
			tab.addEventListener('click', () => {
				tabs.forEach(t => t.classList.remove('active'));
				tab.classList.add('active');

				const targetId = tab.dataset.target;
				if (!targetId) return;

				qsa('.tab-content').forEach(el => el.style.display = 'none');
				const target = document.getElementById(targetId);
				if (target) target.style.display = 'block';
			});
		});
	}

	function initJoinForm() {
		const form = qs('#join-form');
		if (!form) return;

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const name = form.querySelector('[name="name"]')?.value.trim();
			const email = form.querySelector('[name="email"]')?.value.trim();
			if (!name || !email) {
				alert('Please fill in both name and email');
				return;
			}
			const re = /^\S+@\S+\.\S+$/;
			if (!re.test(email)) { alert('Please enter a valid email'); return; }

			// TODO: wire up to backend endpoint via fetch
			alert('Thank you for joining, ' + name + '!');
			form.reset();
		});
	}

	function insertDebateDate() {
		const el = qs('#debate-date');
		if (!el) return;
		const today = new Date();
		el.textContent = `Next Debate: ${today.toDateString()}`;
	}

	function initSmoothScroll() {
		qsa('.navbar-links a[href^="#"]').forEach(a => {
			a.addEventListener('click', function (e) {
				const href = this.getAttribute('href');
				const target = document.querySelector(href);
				if (target) {
					e.preventDefault();
					target.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			});
		});
	}

	function initHeroParallax() {
		const hero = qs('.hero');
		const bg = qs('.hero-bg');
		if (!hero || !bg) return;

		// only a subtle effect
		const onScroll = () => {
			const rect = hero.getBoundingClientRect();
			const windowHeight = window.innerHeight || document.documentElement.clientHeight;
			if (rect.bottom > 0 && rect.top < windowHeight) {
				const pct = Math.min(Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0), 1);
				bg.style.transform = `translateY(${(pct - 0.5) * 8}px)`; // -4px .. +4px
			}
		};

		let ticking = false;
		window.addEventListener('scroll', () => {
			if (!ticking) {
				window.requestAnimationFrame(() => { onScroll(); ticking = false; });
				ticking = true;
			}
		}, { passive: true });

		onScroll();
	}

	document.addEventListener('DOMContentLoaded', () => {
		initMenuToggle();
		initTabs();
		initJoinForm();
		insertDebateDate();
		initSmoothScroll();
		initHeroParallax();
	});

})();

