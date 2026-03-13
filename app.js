// ========== RIDEX APP ==========
document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    setTimeout(() => { preloader.classList.add('hidden'); }, 2000);

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        // Active nav links
        document.querySelectorAll('section[id]').forEach(sec => {
            const top = sec.offsetTop - 120, h = sec.offsetHeight;
            const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
            if (link) link.classList.toggle('active', window.scrollY >= top && window.scrollY < top + h);
        });
    });

    // ===== MOBILE MENU =====
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    navToggle.addEventListener('click', () => mobileMenu.classList.toggle('active'));
    document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('active')));

    // ===== STAT COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const startCounter = (el) => {
        const target = +el.dataset.count, duration = 1500;
        let start = 0;
        const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            el.textContent = Math.floor(p * target);
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { startCounter(e.target); counterObs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));

    // ===== SCROLL REVEAL =====
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.service-card, .step-card, .safety-feature, .testimonial-card').forEach(el => {
        el.style.opacity = '0'; el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObs.observe(el);
    });

    // ===== LOCATION DATA =====
    const locations = [
        { name: 'Koramangala, Bangalore', area: 'Near Forum Mall' },
        { name: 'Indiranagar, Bangalore', area: '100 Feet Road' },
        { name: 'MG Road, Bangalore', area: 'Near Trinity Circle' },
        { name: 'Whitefield, Bangalore', area: 'ITPL Main Road' },
        { name: 'HSR Layout, Bangalore', area: 'Sector 1' },
        { name: 'Jayanagar, Bangalore', area: '4th Block' },
        { name: 'Electronic City, Bangalore', area: 'Phase 1' },
        { name: 'Marathahalli, Bangalore', area: 'Near Bridge' },
        { name: 'JP Nagar, Bangalore', area: '6th Phase' },
        { name: 'BTM Layout, Bangalore', area: '2nd Stage' },
        { name: 'Hebbal, Bangalore', area: 'Near Flyover' },
        { name: 'Yelahanka, Bangalore', area: 'New Town' },
        { name: 'Rajajinagar, Bangalore', area: 'Near Metro' },
        { name: 'Malleshwaram, Bangalore', area: '8th Cross' },
        { name: 'Bannerghatta Road, Bangalore', area: 'Near Meenakshi Mall' },
    ];

    const captains = [
        { name: 'Rajesh Kumar', vehicle: 'Honda Activa • KA 01 AB 1234', rating: 4.8 },
        { name: 'Suresh Babu', vehicle: 'TVS Jupiter • KA 05 CD 5678', rating: 4.9 },
        { name: 'Venkatesh R', vehicle: 'Bajaj Pulsar • KA 03 EF 9012', rating: 4.7 },
        { name: 'Arun Singh', vehicle: 'Hero Splendor • KA 02 GH 3456', rating: 4.6 },
        { name: 'Manoj Patil', vehicle: 'Honda Dio • KA 04 IJ 7890', rating: 4.9 },
    ];

    // ===== BOOKING TABS =====
    document.querySelectorAll('.booking-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.booking-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // ===== LOCATION SUGGESTIONS =====
    const pickupInput = document.getElementById('pickup-input');
    const dropInput = document.getElementById('drop-input');
    const pickupSugg = document.getElementById('pickup-suggestions');
    const dropSugg = document.getElementById('drop-suggestions');

    function showSuggestions(input, container, query) {
        const filtered = query.length > 0
            ? locations.filter(l => l.name.toLowerCase().includes(query.toLowerCase()))
            : locations.slice(0, 6);
        if (filtered.length === 0) { container.classList.remove('active'); return; }
        container.innerHTML = filtered.map(l =>
            `<div class="suggestion-item" data-name="${l.name}">
                <i class="fas fa-map-marker-alt"></i>
                <div><strong>${l.name}</strong><br><small style="color:var(--text-muted)">${l.area}</small></div>
            </div>`
        ).join('');
        container.classList.add('active');
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                input.value = item.dataset.name;
                container.classList.remove('active');
                checkBothFilled();
            });
        });
    }

    pickupInput.addEventListener('focus', () => showSuggestions(pickupInput, pickupSugg, pickupInput.value));
    pickupInput.addEventListener('input', () => showSuggestions(pickupInput, pickupSugg, pickupInput.value));
    dropInput.addEventListener('focus', () => showSuggestions(dropInput, dropSugg, dropInput.value));
    dropInput.addEventListener('input', () => showSuggestions(dropInput, dropSugg, dropInput.value));

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#pickup-wrapper')) pickupSugg.classList.remove('active');
        if (!e.target.closest('#drop-wrapper')) dropSugg.classList.remove('active');
    });

    // ===== CURRENT LOCATION =====
    document.getElementById('current-location-btn').addEventListener('click', () => {
        pickupInput.value = 'Current Location (GPS)';
        showToast('Location detected!', 'success');
        checkBothFilled();
    });

    // ===== PRICE CALCULATION =====
    const prices = { bike: { base: 15, perKm: 7 }, auto: { base: 30, perKm: 12 }, cab: { base: 80, perKm: 16 } };
    let selectedVehicle = 'bike', rideDistance = 0, rideFare = 0;

    function calcDistance() { return +(Math.random() * 12 + 2).toFixed(1); }

    function updatePrices(dist) {
        ['bike','auto','cab'].forEach(v => {
            const p = prices[v].base + Math.round(dist * prices[v].perKm);
            document.getElementById(`price-${v}`).textContent = `₹${p}`;
        });
    }

    function checkBothFilled() {
        if (pickupInput.value && dropInput.value) {
            rideDistance = calcDistance();
            updatePrices(rideDistance);
            document.getElementById('vehicle-selection').style.display = 'block';
            document.getElementById('book-ride-btn').querySelector('.btn-text').textContent = 'Book Ride';
        }
    }

    // ===== VEHICLE SELECTION =====
    document.querySelectorAll('.vehicle-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedVehicle = card.dataset.vehicle;
        });
    });

    // ===== BOOK RIDE =====
    const bookBtn = document.getElementById('book-ride-btn');
    const rideModal = document.getElementById('ride-modal');

    bookBtn.addEventListener('click', () => {
        if (!pickupInput.value || !dropInput.value) {
            showToast('Please enter pickup and drop locations', 'error');
            return;
        }
        // Show loader
        bookBtn.querySelector('.btn-text').style.display = 'none';
        bookBtn.querySelector('.btn-loader').style.display = 'inline';
        bookBtn.disabled = true;

        setTimeout(() => {
            bookBtn.querySelector('.btn-text').style.display = 'inline';
            bookBtn.querySelector('.btn-loader').style.display = 'none';
            bookBtn.disabled = false;
            startRideFlow();
        }, 1500);
    });

    function startRideFlow() {
        rideModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Show searching
        hideAllStates();
        document.getElementById('state-searching').style.display = 'block';

        // After 3s show captain found
        setTimeout(() => {
            hideAllStates();
            document.getElementById('state-found').style.display = 'flex';
            populateRideDetails();
            showToast('Captain is on the way!', 'success');
        }, 3000);
    }

    function hideAllStates() {
        document.querySelectorAll('.ride-state').forEach(s => s.style.display = 'none');
    }

    function populateRideDetails() {
        const captain = captains[Math.floor(Math.random() * captains.length)];
        document.getElementById('captain-name').textContent = captain.name;
        document.getElementById('captain-vehicle').textContent = captain.vehicle;
        document.getElementById('ride-pickup-text').textContent = pickupInput.value;
        document.getElementById('ride-drop-text').textContent = dropInput.value;
        document.getElementById('ride-distance').textContent = rideDistance + ' km';
        const eta = Math.round(rideDistance * 2.5 + 3);
        document.getElementById('ride-eta').textContent = eta + ' min';
        rideFare = prices[selectedVehicle].base + Math.round(rideDistance * prices[selectedVehicle].perKm);
        document.getElementById('ride-fare').textContent = '₹' + rideFare;
    }

    // ===== CANCEL RIDE =====
    document.getElementById('cancel-ride-btn').addEventListener('click', () => {
        rideModal.style.display = 'none';
        document.body.style.overflow = '';
        showToast('Ride cancelled', 'info');
    });

    // ===== SOS =====
    document.getElementById('sos-btn').addEventListener('click', () => {
        showToast('🚨 Emergency alert sent to your contacts!', 'error');
    });

    // ===== SIMULATE RIDE COMPLETE (for demo after 8s) =====
    document.getElementById('call-captain').addEventListener('click', () => showToast('Calling captain...', 'info'));
    document.getElementById('msg-captain').addEventListener('click', () => showToast('Chat opened', 'info'));

    // Complete ride after clicking the fare display
    document.querySelector('.ride-info-bar').addEventListener('click', () => {
        completeRide();
    });

    // Auto complete after 15s
    let autoComplete;
    const origStartRide = startRideFlow;
    const patchedStart = () => {
        origStartRide();
        clearTimeout(autoComplete);
        autoComplete = setTimeout(completeRide, 15000);
    };
    // Replace bookBtn handler
    bookBtn.removeEventListener('click', () => {});

    function completeRide() {
        clearTimeout(autoComplete);
        hideAllStates();
        document.getElementById('state-complete').style.display = 'block';

        const base = prices[selectedVehicle].base;
        const distCharge = Math.round(rideDistance * prices[selectedVehicle].perKm);
        const discount = Math.round(rideFare * 0.1);
        document.getElementById('fare-base').textContent = '₹' + base;
        document.getElementById('fare-distance').textContent = '₹' + distCharge;
        document.getElementById('fare-discount').textContent = '-₹' + discount;
        document.getElementById('fare-total').textContent = '₹' + (rideFare - discount);
    }

    // ===== STAR RATING =====
    document.querySelectorAll('#star-rating i').forEach(star => {
        star.addEventListener('click', () => {
            const r = +star.dataset.rating;
            document.querySelectorAll('#star-rating i').forEach((s, i) => {
                s.classList.toggle('active', i < r);
            });
            showToast(`Thanks for rating ${r} stars! ⭐`, 'success');
        });
    });

    // ===== BOOK AGAIN =====
    document.getElementById('book-again-btn').addEventListener('click', () => {
        rideModal.style.display = 'none';
        document.body.style.overflow = '';
        pickupInput.value = '';
        dropInput.value = '';
        document.getElementById('vehicle-selection').style.display = 'none';
        document.getElementById('book-ride-btn').querySelector('.btn-text').textContent = 'Find Rides';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== AUTH MODAL =====
    const authModal = document.getElementById('auth-modal');
    document.getElementById('btn-login').addEventListener('click', () => {
        document.getElementById('auth-title').textContent = 'Welcome back!';
        document.getElementById('auth-subtitle').textContent = 'Login with your phone number';
        authModal.style.display = 'flex';
    });
    document.getElementById('btn-signup').addEventListener('click', () => {
        document.getElementById('auth-title').textContent = 'Create Account';
        document.getElementById('auth-subtitle').textContent = 'Sign up with your phone number';
        authModal.style.display = 'flex';
    });
    document.getElementById('auth-close').addEventListener('click', () => {
        authModal.style.display = 'none';
        resetAuth();
    });
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) { authModal.style.display = 'none'; resetAuth(); }
    });

    // ===== OTP FLOW =====
    const phoneInput = document.getElementById('phone-input');
    const otpSection = document.getElementById('otp-section');
    const authForm = document.getElementById('auth-form');
    const authSubmit = document.getElementById('auth-submit-btn');

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (otpSection.style.display === 'none') {
            if (phoneInput.value.length !== 10) { showToast('Enter valid 10-digit number', 'error'); return; }
            otpSection.style.display = 'block';
            document.getElementById('otp-phone').textContent = '+91 ' + phoneInput.value;
            authSubmit.textContent = 'Verify OTP';
            startResendTimer();
        } else {
            const otp = [...document.querySelectorAll('.otp-input')].map(i => i.value).join('');
            if (otp.length < 4) { showToast('Enter complete OTP', 'error'); return; }
            showToast('Login successful! Welcome to RideX 🎉', 'success');
            authModal.style.display = 'none';
            resetAuth();
        }
    });

    // OTP auto-focus
    document.querySelectorAll('.otp-input').forEach((inp, i, arr) => {
        inp.addEventListener('input', () => { if (inp.value && i < arr.length - 1) arr[i + 1].focus(); });
        inp.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !inp.value && i > 0) arr[i - 1].focus(); });
    });

    function startResendTimer() {
        let t = 30;
        const el = document.getElementById('resend-timer');
        const btn = document.getElementById('resend-btn');
        btn.disabled = true;
        const iv = setInterval(() => {
            t--; el.textContent = t;
            if (t <= 0) { clearInterval(iv); btn.disabled = false; btn.innerHTML = 'Resend OTP'; }
        }, 1000);
    }

    function resetAuth() {
        phoneInput.value = '';
        otpSection.style.display = 'none';
        authSubmit.textContent = 'Send OTP';
        document.querySelectorAll('.otp-input').forEach(i => i.value = '');
    }

    // ===== COUPON =====
    document.getElementById('coupon-btn').addEventListener('click', () => {
        showToast('🎫 Coupon RIDEX50 applied! ₹50 off', 'success');
    });

    // ===== PAYMENT =====
    let payIdx = 0;
    const payMethods = ['Cash Payment', 'UPI Payment', 'RideX Wallet', 'Credit Card'];
    const payIcons = ['fa-wallet', 'fa-mobile-screen', 'fa-coins', 'fa-credit-card'];
    document.getElementById('payment-btn').addEventListener('click', () => {
        payIdx = (payIdx + 1) % payMethods.length;
        const btn = document.getElementById('payment-btn');
        btn.querySelector('i:first-child').className = 'fas ' + payIcons[payIdx];
        btn.querySelector('span').textContent = payMethods[payIdx];
        showToast(`Payment: ${payMethods[payIdx]}`, 'info');
    });

    // ===== SERVICE BOOK BUTTONS =====
    document.querySelectorAll('.service-book-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => pickupInput.focus(), 500);
        });
    });

    // ===== CAPTAIN REGISTER =====
    document.getElementById('btn-register-captain').addEventListener('click', () => {
        showToast('Captain registration opening soon! 🚀', 'info');
    });

    // ===== SMOOTH NAV =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const el = document.querySelector(a.getAttribute('href'));
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===== TOAST SYSTEM =====
    function showToast(msg, type = 'info') {
        const c = document.getElementById('toast-container');
        const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.innerHTML = `<i class="fas ${icons[type]}"></i><span>${msg}</span>`;
        c.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(30px)'; setTimeout(() => t.remove(), 300); }, 3500);
    }
});
