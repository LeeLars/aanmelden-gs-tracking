class AnalyticsTracker {
    constructor() {
        this.sessionId = this.getOrCreateSessionId();
        this.apiUrl = window.ANALYTICS_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/track' : 'https://aanmelden-gs-tracking-production.up.railway.app/api/track');
        this.startTime = Date.now();
        this.videoWatchTime = 0;
        this.videoStartTime = null;
        this.maxScrollDepth = 0;
        this.locationTracked = false;
        this.activeTime = 0;
        this.lastActiveTime = Date.now();
        this.isTabActive = true;
        this.trackingEnabled = !!this.apiUrl;
        
        this.init();
    }

    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    async init() {
        await this.trackSession();
        this.trackScrollDepth();
        this.trackTimeOnPage();
        this.trackTabActivity();
        this.trackInteractions();
    }

    getNetworkInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            return {
                type: connection.effectiveType || connection.type || 'unknown',
                downlink: connection.downlink || null,
                rtt: connection.rtt || null
            };
        }
        return { type: 'unknown', downlink: null, rtt: null };
    }

    getPerformanceMetrics() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            return loadTime > 0 ? loadTime : null;
        }
        return null;
    }

    async trackSession() {
        if (!this.trackingEnabled) return;
        
        const networkInfo = this.getNetworkInfo();
        const pageLoadTime = this.getPerformanceMetrics();
        
        const sessionData = {
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            referrer: document.referrer || 'direct',
            latitude: null,
            longitude: null,
            location_accuracy: null,
            language: navigator.language || navigator.userLanguage,
            platform: navigator.platform,
            connection_type: networkInfo.type,
            downlink: networkInfo.downlink,
            rtt: networkInfo.rtt,
            page_load_time: pageLoadTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        try {
            await fetch(`${this.apiUrl}/session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sessionData)
            });
        } catch (error) {
            console.error('Failed to track session:', error);
        }

        this.requestLocation();
    }

    requestLocation() {
        if (!this.trackingEnabled) return;
        
        if ('geolocation' in navigator && !this.locationTracked) {
            // Check if user already dismissed the popup
            const dismissed = sessionStorage.getItem('location_popup_dismissed');
            if (dismissed) return;

            // Show custom popup after 3 seconds
            setTimeout(() => {
                this.showLocationPopup();
            }, 3000);
        }
    }

    showLocationPopup() {
        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.id = 'locationPopupOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        // Create popup
        const popup = document.createElement('div');
        popup.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 340px;
            margin: 20px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        `;

        popup.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 15px;">📍</div>
            <h3 style="color: #0F3B79; font-size: 1.3rem; margin-bottom: 10px;">Deel je locatie</h3>
            <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 20px; line-height: 1.5;">
                Zo kan ik je beter helpen met lokale diensten en sneller reageren op je aanvraag.
            </p>
            <button id="allowLocationBtn" style="
                width: 100%;
                padding: 14px;
                background: #2dd5a4;
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                margin-bottom: 10px;
                transition: background 0.2s;
            ">Ja, deel mijn locatie</button>
            <button id="denyLocationBtn" style="
                width: 100%;
                padding: 12px;
                background: transparent;
                color: #64748b;
                border: none;
                font-size: 0.9rem;
                cursor: pointer;
            ">Nee, bedankt</button>
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Handle allow button
        document.getElementById('allowLocationBtn').addEventListener('click', () => {
            this.closeLocationPopup();
            this.getActualLocation();
        });

        // Handle deny button
        document.getElementById('denyLocationBtn').addEventListener('click', () => {
            sessionStorage.setItem('location_popup_dismissed', 'true');
            this.closeLocationPopup();
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                sessionStorage.setItem('location_popup_dismissed', 'true');
                this.closeLocationPopup();
            }
        });
    }

    closeLocationPopup() {
        const overlay = document.getElementById('locationPopupOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    }

    getActualLocation() {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                this.locationTracked = true;
                const locationData = {
                    session_id: this.sessionId,
                    timestamp: new Date().toISOString(),
                    user_agent: navigator.userAgent,
                    screen_width: window.screen.width,
                    screen_height: window.screen.height,
                    referrer: document.referrer || 'direct',
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    location_accuracy: position.coords.accuracy
                };

                try {
                    await fetch(`${this.apiUrl}/session`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(locationData)
                    });
                } catch (error) {
                    console.error('Failed to update location:', error);
                }
            },
            (error) => {
                console.log('Location access denied or unavailable');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    updateVideoWatchTime(video) {
        if (!video.paused && this.videoStartTime) {
            const currentTime = Date.now();
            this.videoWatchTime += (currentTime - this.videoStartTime) / 1000;
            this.videoStartTime = currentTime;
        } else if (!video.paused && !this.videoStartTime) {
            this.videoStartTime = Date.now();
        }
    }

    async trackVideoEvent(eventType, video) {
        if (eventType === 'play') {
            this.videoStartTime = Date.now();
        } else if (eventType === 'pause' || eventType === 'ended') {
            if (this.videoStartTime) {
                const currentTime = Date.now();
                this.videoWatchTime += (currentTime - this.videoStartTime) / 1000;
                this.videoStartTime = null;
            }
        }

        if (!this.trackingEnabled) return;

        const percentageWatched = video.duration ? (video.currentTime / video.duration) * 100 : 0;

        const eventData = {
            session_id: this.sessionId,
            event_type: eventType,
            timestamp: new Date().toISOString(),
            video_time: video.currentTime,
            total_watch_time: this.videoWatchTime,
            percentage_watched: percentageWatched
        };

        try {
            await fetch(`${this.apiUrl}/video`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });
        } catch (error) {
            console.error('Failed to track video event:', error);
        }
    }

    async trackButtonClick(buttonType) {
        if (!this.trackingEnabled) return;
        
        const clickData = {
            session_id: this.sessionId,
            button_type: buttonType,
            timestamp: new Date().toISOString()
        };

        try {
            await fetch(`${this.apiUrl}/click`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clickData)
            });
        } catch (error) {
            console.error('Failed to track button click:', error);
        }
    }

    async trackFormSubmission(formData) {
        if (!this.trackingEnabled) return;
        
        const submissionData = {
            session_id: this.sessionId,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            timestamp: new Date().toISOString()
        };

        try {
            await fetch(`${this.apiUrl}/form`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });
        } catch (error) {
            console.error('Failed to track form submission:', error);
        }
    }

    trackScrollDepth() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrolled = window.scrollY;
                    const scrollPercentage = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;

                    if (scrollPercentage > this.maxScrollDepth) {
                        this.maxScrollDepth = Math.round(scrollPercentage);
                    }

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    trackTimeOnPage() {
        if (!this.trackingEnabled) return;
        
        setInterval(async () => {
            const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);

            try {
                await fetch(`${this.apiUrl}/session/${this.sessionId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        time_on_page: timeOnPage,
                        scroll_depth: this.maxScrollDepth,
                        active_time: Math.round(this.activeTime / 1000)
                    })
                });
            } catch (error) {
                console.error('Failed to update session data:', error);
            }
        }, 10000);

        window.addEventListener('beforeunload', async () => {
            const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);

            const data = JSON.stringify({
                time_on_page: timeOnPage,
                scroll_depth: this.maxScrollDepth,
                active_time: Math.round(this.activeTime / 1000)
            });

            if (navigator.sendBeacon) {
                navigator.sendBeacon(`${this.apiUrl}/session/${this.sessionId}`, data);
            }
        });
    }

    trackTabActivity() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.isTabActive) {
                    this.activeTime += Date.now() - this.lastActiveTime;
                    this.isTabActive = false;
                    this.trackInteractionEvent('tab_blur', { timestamp: new Date().toISOString() });
                }
            } else {
                this.isTabActive = true;
                this.lastActiveTime = Date.now();
                this.trackInteractionEvent('tab_focus', { timestamp: new Date().toISOString() });
            }
        });

        setInterval(() => {
            if (this.isTabActive) {
                this.activeTime += Date.now() - this.lastActiveTime;
                this.lastActiveTime = Date.now();
            }
        }, 1000);
    }

    trackInteractions() {
        document.addEventListener('copy', (e) => {
            const selectedText = window.getSelection().toString();
            if (selectedText) {
                this.trackInteractionEvent('copy', { 
                    text: selectedText.substring(0, 100),
                    length: selectedText.length
                });
            }
        });

        window.addEventListener('resize', () => {
            this.trackInteractionEvent('resize', {
                width: window.innerWidth,
                height: window.innerHeight
            });
        });
    }

    async trackInteractionEvent(eventType, details) {
        if (!this.trackingEnabled) return;
        
        try {
            await fetch(`${this.apiUrl}/interaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: this.sessionId,
                    event_type: eventType,
                    details: details,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('Failed to track interaction:', error);
        }
    }
}

let tracker = null;
const heroVideo = document.getElementById('heroVideo');
const playButton = document.getElementById('playButton');
const muteButton = document.getElementById('muteButton');
const progressBar = document.querySelector('.progress-bar');
const progress = document.getElementById('progress');
const videoOverlay = document.querySelector('.video-overlay');
const customControls = document.querySelector('.custom-controls');
const playIcons = document.querySelectorAll('.play-icon');
const pauseIcons = document.querySelectorAll('.pause-icon');
const soundOn = document.querySelector('.sound-on');
const soundOff = document.querySelector('.sound-off');
const controlPlayBtn = document.getElementById('controlPlayBtn');

let isPlaying = false;
let controlsTimeout;

function togglePlay(e) {
    if (e) e.stopPropagation();
    
    if (isPlaying) {
        heroVideo.pause();
        isPlaying = false;
        playIcons.forEach(icon => icon.classList.remove('hidden'));
        pauseIcons.forEach(icon => icon.classList.add('hidden'));
        videoOverlay.classList.remove('hide');
        if (tracker) tracker.trackVideoEvent('pause', heroVideo);
    } else {
        heroVideo.play();
        isPlaying = true;
        playIcons.forEach(icon => icon.classList.add('hidden'));
        pauseIcons.forEach(icon => icon.classList.remove('hidden'));
        videoOverlay.classList.add('hide');
        if (tracker) tracker.trackVideoEvent('play', heroVideo);
    }
}

function toggleMute() {
    heroVideo.muted = !heroVideo.muted;
    if (heroVideo.muted) {
        soundOn.classList.add('hidden');
        soundOff.classList.remove('hidden');
    } else {
        soundOn.classList.remove('hidden');
        soundOff.classList.add('hidden');
    }
}

function updateProgress() {
    const percentage = (heroVideo.currentTime / heroVideo.duration) * 100;
    progress.style.width = percentage + '%';
    if (tracker) tracker.updateVideoWatchTime(heroVideo);
}

function seekVideo(e) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    heroVideo.currentTime = pos * heroVideo.duration;
}

function showControls() {
    customControls.classList.remove('hide');
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
        if (isPlaying) {
            customControls.classList.add('hide');
        }
    }, 3000);
}

playButton.addEventListener('click', togglePlay);
if (controlPlayBtn) controlPlayBtn.addEventListener('click', togglePlay);
muteButton.addEventListener('click', toggleMute);
heroVideo.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('click', seekVideo);

document.querySelector('.video-header').addEventListener('mousemove', showControls);
document.querySelector('.video-header').addEventListener('touchstart', showControls);

heroVideo.addEventListener('ended', () => {
    isPlaying = false;
    playIcons.forEach(icon => icon.classList.remove('hidden'));
    pauseIcons.forEach(icon => icon.classList.add('hidden'));
    videoOverlay.classList.remove('hide');
    customControls.classList.remove('hide');
    if (tracker) tracker.trackVideoEvent('ended', heroVideo);
});

window.addEventListener('load', () => {
    // Video starts muted due to autoplay attribute
    isPlaying = true;
    playIcons.forEach(icon => icon.classList.add('hidden'));
    pauseIcons.forEach(icon => icon.classList.remove('hidden'));
    videoOverlay.classList.add('hide');
    
    // Try to unmute immediately
    heroVideo.muted = false;
    soundOn.classList.remove('hidden');
    soundOff.classList.add('hidden');
    
    // If unmute fails, wait for user interaction
    heroVideo.play().catch(() => {
        // Autoplay with sound blocked, keep muted
        heroVideo.muted = true;
        soundOn.classList.add('hidden');
        soundOff.classList.remove('hidden');
    });
    
    if (tracker) tracker.trackVideoEvent('play', heroVideo);
});

const whatsappBtn = document.getElementById('whatsappBtn');
const smsBtn = document.getElementById('smsBtn');
const toggleFormBtn = document.getElementById('toggleFormBtn');
const callbackForm = document.getElementById('callbackForm');
const phoneInput = document.getElementById('phone');

whatsappBtn.addEventListener('click', () => {
    if (tracker) tracker.trackButtonClick('whatsapp');
});

if (smsBtn) {
    smsBtn.addEventListener('click', () => {
        if (tracker) tracker.trackButtonClick('sms');
    });
}

if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        // Clear any validation errors
        phoneInput.setCustomValidity('');
        
        let value = e.target.value.replace(/\s/g, '');
        
        if (value.startsWith('00')) {
            value = '+' + value.substring(2);
        }
        
        if (value.startsWith('04') && value.length > 2) {
            value = '+32' + value.substring(1);
        }
        
        if (value.startsWith('+324') && value.length > 4) {
            const formatted = value.substring(0, 3) + ' ' + 
                            value.substring(3, 4) + 
                            value.substring(4, 6) + ' ' + 
                            value.substring(6, 8) + ' ' + 
                            value.substring(8, 10) + ' ' + 
                            value.substring(10, 12);
            e.target.value = formatted.trim();
        }
    });
    
    phoneInput.addEventListener('blur', (e) => {
        const value = e.target.value.replace(/\s/g, '');
        
        // Accept: +32 4XX XX XX XX, 0032 4XX XX XX XX, 04XX XX XX XX, or raw formats
        const belgianMobileRegex = /^(\+32|0032|0)4[0-9]{8}$/;
        
        if (value && !belgianMobileRegex.test(value)) {
            phoneInput.setCustomValidity('Voer een geldig Belgisch GSM nummer in (bv. +32 470 08 98 88)');
        } else {
            phoneInput.setCustomValidity('');
        }
    });
}

if (toggleFormBtn) {
    toggleFormBtn.addEventListener('click', () => {
        callbackForm.classList.toggle('hidden');
        if (!callbackForm.classList.contains('hidden')) {
            callbackForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                phoneInput.focus();
            }, 300);
            if (tracker) tracker.trackInteractionEvent('form_toggle', { action: 'opened' });
        }
    });
}

const registrationForm = document.getElementById('registrationForm');
const messageDiv = document.getElementById('message');

if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(registrationForm);
        
        if (tracker) {
            await tracker.trackFormSubmission(formData);
        }
        
        messageDiv.textContent = 'Bedankt! Ik bel je zo snel mogelijk op.';
        messageDiv.className = 'message success';
        
        registrationForm.reset();
        
        setTimeout(() => {
            messageDiv.className = 'message hidden';
            callbackForm.classList.add('hidden');
        }, 3000);
    });
}

tracker = new AnalyticsTracker();
