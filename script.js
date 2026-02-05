class AnalyticsTracker {
    constructor() {
        this.sessionId = this.getOrCreateSessionId();
        this.apiUrl = window.ANALYTICS_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/track' : null);
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
                }
            );
        }
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
const progressFill = document.getElementById('progress');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const soundOn = document.querySelector('.sound-on');
const soundOff = document.querySelector('.sound-off');
const videoOverlay = document.querySelector('.video-overlay');
const customControls = document.querySelector('.custom-controls');

const registrationForm = document.getElementById('registrationForm');
const messageDiv = document.getElementById('message');
const registrationList = document.getElementById('registrationList');

let registrations = [];
let isPlaying = false;

function togglePlay() {
    if (isPlaying) {
        heroVideo.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        videoOverlay.classList.remove('hide');
        customControls.classList.remove('hide');
    } else {
        heroVideo.play();
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        videoOverlay.classList.add('hide');
        customControls.classList.add('hide');
    }
    isPlaying = !isPlaying;
}

heroVideo.addEventListener('play', () => {
    if (tracker) tracker.trackVideoEvent('play', heroVideo);
});

heroVideo.addEventListener('pause', () => {
    if (tracker) tracker.trackVideoEvent('pause', heroVideo);
});

heroVideo.addEventListener('timeupdate', () => {
    if (tracker) tracker.updateVideoWatchTime(heroVideo);
});

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

function showControls() {
    if (isPlaying) {
        videoOverlay.classList.remove('hide');
        customControls.classList.remove('hide');
        setTimeout(() => {
            if (isPlaying) {
                videoOverlay.classList.add('hide');
                customControls.classList.add('hide');
            }
        }, 3000);
    }
}

function updateProgress() {
    const progress = (heroVideo.currentTime / heroVideo.duration) * 100;
    progressFill.style.width = progress + '%';
}

function seekVideo(e) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    heroVideo.currentTime = pos * heroVideo.duration;
}

playButton.addEventListener('click', togglePlay);
muteButton.addEventListener('click', toggleMute);
heroVideo.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('click', seekVideo);

document.querySelector('.video-header').addEventListener('mousemove', showControls);
document.querySelector('.video-header').addEventListener('touchstart', showControls);

heroVideo.addEventListener('ended', () => {
    isPlaying = false;
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    videoOverlay.classList.remove('hide');
    customControls.classList.remove('hide');
    if (tracker) tracker.trackVideoEvent('ended', heroVideo);
});

window.addEventListener('load', () => {
    // Video starts muted due to autoplay attribute
    isPlaying = true;
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
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

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    setTimeout(() => {
        messageDiv.className = 'message hidden';
    }, 3000);
}

function updateRegistrationList() {
    registrationList.innerHTML = '';
    
    if (registrations.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'empty';
        emptyItem.textContent = 'Nog geen aanmeldingen';
        registrationList.appendChild(emptyItem);
        return;
    }
    
    registrations.forEach((registration, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>Callback verzoek</strong><br>
            Tel: ${registration.phone}<br>
            <small>${new Date(registration.timestamp).toLocaleString('nl-NL')}</small>
        `;
        registrationList.appendChild(listItem);
    });
}

function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(registrationForm);
    const phone = formData.get('phone');
    
    const registration = {
        phone: phone,
        timestamp: new Date().toISOString()
    };
    
    registrations.push(registration);
    
    if (tracker) {
        const formDataForTracking = new FormData();
        formDataForTracking.append('phone', phone);
        formDataForTracking.append('name', '');
        formDataForTracking.append('email', '');
        tracker.trackFormSubmission(formDataForTracking);
    }
    
    showMessage('Bedankt! We bellen je zo snel mogelijk terug.', 'success');
    
    registrationForm.reset();
    
    setTimeout(() => {
        callbackForm.classList.add('hidden');
    }, 2000);
    
    updateRegistrationList();
    
    localStorage.setItem('registrations', JSON.stringify(registrations));
}

function loadRegistrations() {
    const stored = localStorage.getItem('registrations');
    if (stored) {
        registrations = JSON.parse(stored);
        updateRegistrationList();
    } else {
        updateRegistrationList();
    }
}

registrationForm.addEventListener('submit', handleSubmit);

loadRegistrations();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        tracker = new AnalyticsTracker();
    });
} else {
    tracker = new AnalyticsTracker();
}
