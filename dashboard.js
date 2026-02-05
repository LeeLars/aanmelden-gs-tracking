class AnalyticsDashboard {
    constructor() {
        this.apiUrl = window.ANALYTICS_API_URL ? window.ANALYTICS_API_URL.replace('/track', '/analytics') : 'http://localhost:3000/api/analytics';
        this.refreshInterval = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadAllData();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadAllData());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterSessions(e.target.value));
        document.getElementById('filterSelect').addEventListener('change', (e) => this.filterByType(e.target.value));
    }

    async loadAllData() {
        try {
            await Promise.all([
                this.loadOverview(),
                this.loadSessions(),
                this.loadVideoStats(),
                this.loadClicksTimeline(),
                this.loadInteractions(),
                this.loadTechnicalData(),
                this.loadFormSubmissions()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Kon data niet laden. Zorg dat de server draait.');
        }
    }

    async loadFormSubmissions() {
        try {
            const response = await fetch(`${this.apiUrl}/form-submissions`);
            const submissions = await response.json();

            this.renderFormSubmissions(submissions);

        } catch (error) {
            console.error('Error loading form submissions:', error);
        }
    }

    renderFormSubmissions(submissions) {
        const container = document.getElementById('formSubmissionsList');
        if (!container) return;

        container.innerHTML = '';

        if (submissions.length === 0) {
            container.innerHTML = '<p class="empty-state">Nog geen formulier inzendingen</p>';
            return;
        }

        submissions.forEach(submission => {
            const item = document.createElement('div');
            item.className = 'journey-item';
            
            const timestamp = new Date(submission.timestamp).toLocaleString('nl-NL');
            
            let location = 'Locatie onbekend';
            if (submission.municipality || submission.region) {
                const parts = [];
                if (submission.municipality) parts.push(submission.municipality);
                if (submission.region && submission.region !== submission.municipality) parts.push(submission.region);
                if (submission.country) parts.push(submission.country);
                location = parts.join(', ');
            }
            
            const device = this.parseUserAgent(submission.user_agent || '');
            const referrer = submission.referrer === 'direct' ? 'Direct' : (submission.referrer ? new URL(submission.referrer).hostname : 'Onbekend');
            
            item.innerHTML = `
                <div class="time">${timestamp}</div>
                <div class="action">📞 ${submission.phone || submission.name || 'Callback verzoek'}</div>
                <div class="details">
                    ${submission.name ? `<strong>Naam:</strong> ${submission.name}<br>` : ''}
                    ${submission.email ? `<strong>Email:</strong> ${submission.email}<br>` : ''}
                    ${submission.phone ? `<strong>Tel:</strong> ${submission.phone}<br>` : ''}
                    <strong>Locatie:</strong> ${location}<br>
                    <strong>Device:</strong> ${device}<br>
                    <strong>Bron:</strong> ${referrer}
                    ${submission.connection_type ? `<br><strong>Netwerk:</strong> ${submission.connection_type}` : ''}
                    ${submission.language ? `<br><strong>Taal:</strong> ${submission.language}` : ''}
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    async loadInteractions() {
        try {
            const response = await fetch(`${this.apiUrl}/interactions`);
            const interactions = await response.json();

            const copyEvents = interactions.filter(i => i.event_type === 'copy').length;
            const tabSwitches = interactions.filter(i => i.event_type === 'tab_blur' || i.event_type === 'tab_focus').length;
            const resizeEvents = interactions.filter(i => i.event_type === 'resize').length;

            if (document.getElementById('totalCopyEvents')) {
                document.getElementById('totalCopyEvents').textContent = copyEvents;
            }
            if (document.getElementById('totalTabSwitches')) {
                document.getElementById('totalTabSwitches').textContent = tabSwitches;
            }
            if (document.getElementById('totalResizeEvents')) {
                document.getElementById('totalResizeEvents').textContent = resizeEvents;
            }

            this.renderInteractionsList(interactions.slice(0, 20));

        } catch (error) {
            console.error('Error loading interactions:', error);
        }
    }

    async loadTechnicalData() {
        try {
            const response = await fetch(`${this.apiUrl}/technical`);
            const data = await response.json();

            if (document.getElementById('avgLoadTime')) {
                document.getElementById('avgLoadTime').textContent = data.avgLoadTime ? `${Math.round(data.avgLoadTime)}ms` : '-';
            }
            if (document.getElementById('mobileVisitors')) {
                document.getElementById('mobileVisitors').textContent = data.mobileCount || 0;
            }
            if (document.getElementById('desktopVisitors')) {
                document.getElementById('desktopVisitors').textContent = data.desktopCount || 0;
            }
            if (document.getElementById('withLocation')) {
                document.getElementById('withLocation').textContent = data.withLocation || 0;
            }

        } catch (error) {
            console.error('Error loading technical data:', error);
        }
    }

    renderInteractionsList(interactions) {
        const container = document.getElementById('interactionsList');
        if (!container) return;

        container.innerHTML = '';

        if (interactions.length === 0) {
            container.innerHTML = '<p class="empty-state">Nog geen interacties geregistreerd</p>';
            return;
        }

        const eventLabels = {
            'copy': 'Tekst Gekopieerd',
            'tab_blur': 'Tab Verlaten',
            'tab_focus': 'Tab Terug',
            'resize': 'Scherm Resize'
        };

        interactions.forEach(interaction => {
            const item = document.createElement('div');
            item.className = 'journey-item';
            
            const timestamp = new Date(interaction.timestamp).toLocaleString('nl-NL');
            const details = interaction.details ? JSON.parse(interaction.details) : {};
            
            let detailsText = '';
            if (interaction.event_type === 'copy' && details.text) {
                detailsText = `Tekst: "${details.text.substring(0, 50)}..."`;
            } else if (interaction.event_type === 'resize') {
                detailsText = `${details.width}x${details.height}`;
            }
            
            item.innerHTML = `
                <div class="time">${timestamp}</div>
                <div class="action">${eventLabels[interaction.event_type] || interaction.event_type}</div>
                ${detailsText ? `<div class="details">${detailsText}</div>` : ''}
            `;
            
            container.appendChild(item);
        });
    }

    async loadOverview() {
        try {
            const response = await fetch(`${this.apiUrl}/overview`);
            const data = await response.json();

            document.getElementById('totalSessions').textContent = data.totalSessions || 0;
            
            const avgVideoTime = data.avgVideoTime || 0;
            document.getElementById('avgVideoTime').textContent = this.formatTime(avgVideoTime);

            const totalClicks = data.clicksByType.reduce((sum, item) => sum + item.count, 0);
            document.getElementById('totalClicks').textContent = totalClicks;

            document.getElementById('totalForms').textContent = data.totalForms || 0;

            const avgActiveTime = data.avgActiveTime || 0;
            if (document.getElementById('avgActiveTime')) {
                document.getElementById('avgActiveTime').textContent = this.formatTime(avgActiveTime);
            }

            const conversionRate = data.totalSessions > 0 
                ? ((data.totalForms / data.totalSessions) * 100).toFixed(1) 
                : 0;
            document.getElementById('conversionRate').textContent = `${conversionRate}%`;

            if (document.getElementById('avgScrollDepth')) {
                document.getElementById('avgScrollDepth').textContent = `${Math.round(data.avgScrollDepth || 0)}%`;
            }

            this.renderClicksChart(data.clicksByType);

        } catch (error) {
            console.error('Error loading overview:', error);
        }
    }

    async loadSessions() {
        try {
            const response = await fetch(`${this.apiUrl}/sessions`);
            const sessions = await response.json();

            this.allSessions = sessions;
            this.renderSessionsTable(sessions);

        } catch (error) {
            console.error('Error loading sessions:', error);
        }
    }

    async loadVideoStats() {
        try {
            const response = await fetch(`${this.apiUrl}/video-stats`);
            const stats = await response.json();

            this.renderVideoStats(stats);

        } catch (error) {
            console.error('Error loading video stats:', error);
        }
    }

    async loadClicksTimeline() {
        try {
            const response = await fetch(`${this.apiUrl}/clicks-timeline`);
            const timeline = await response.json();

            this.renderClicksTimeline(timeline);

        } catch (error) {
            console.error('Error loading clicks timeline:', error);
        }
    }

    renderClicksChart(clicksByType) {
        const container = document.getElementById('clicksBars');
        container.innerHTML = '';

        if (clicksByType.length === 0) {
            container.innerHTML = '<p class="empty-state">Nog geen clicks geregistreerd</p>';
            return;
        }

        const maxCount = Math.max(...clicksByType.map(item => item.count));

        const buttonLabels = {
            'whatsapp': 'WhatsApp',
            'phone': 'Telefoon',
            'calendar': 'Afspraak'
        };

        clicksByType.forEach(item => {
            const percentage = (item.count / maxCount) * 100;
            
            const barItem = document.createElement('div');
            barItem.className = 'bar-item';
            
            barItem.innerHTML = `
                <div class="bar-label">${buttonLabels[item.button_type] || item.button_type}</div>
                <div class="bar-wrapper">
                    <div class="bar-fill" style="width: ${percentage}%">
                        <span class="bar-value">${item.count}</span>
                    </div>
                </div>
            `;
            
            container.appendChild(barItem);
        });
    }

    renderVideoStats(stats) {
        const container = document.getElementById('videoStats');
        if (!container) return;
        
        container.innerHTML = '';

        if (stats.length === 0) {
            container.innerHTML = '<p class="empty-state">Nog geen video statistieken</p>';
            return;
        }

        const eventLabels = {
            'play': 'Afgespeeld',
            'pause': 'Gepauzeerd',
            'ended': 'Volledig Bekeken'
        };

        const playStats = stats.find(s => s.event_type === 'play');
        const endedStats = stats.find(s => s.event_type === 'ended');

        if (document.getElementById('videoPlays')) {
            document.getElementById('videoPlays').textContent = playStats ? playStats.count : 0;
        }
        if (document.getElementById('videoCompleted')) {
            document.getElementById('videoCompleted').textContent = endedStats ? endedStats.count : 0;
        }
        if (document.getElementById('videoAvgTime')) {
            const avgTime = endedStats ? endedStats.avg_watch_time : 0;
            document.getElementById('videoAvgTime').textContent = this.formatTime(avgTime);
        }
        if (document.getElementById('videoAvgPercentage')) {
            const avgPercentage = endedStats ? endedStats.avg_percentage : 0;
            document.getElementById('videoAvgPercentage').textContent = `${avgPercentage.toFixed(1)}%`;
        }

        stats.forEach(stat => {
            const statItem = document.createElement('div');
            statItem.className = 'video-stat-item';
            
            const avgTime = stat.avg_watch_time ? this.formatTime(stat.avg_watch_time) : '0s';
            const avgPercentage = stat.avg_percentage ? stat.avg_percentage.toFixed(1) : '0';
            
            statItem.innerHTML = `
                <h4>${eventLabels[stat.event_type] || stat.event_type}</h4>
                <p>${stat.count}x - Gem. ${avgTime} (${avgPercentage}%)</p>
            `;
            
            container.appendChild(statItem);
        });
    }

    renderSessionsTable(sessions) {
        const tbody = document.getElementById('sessionsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (sessions.length === 0) {
            const colspan = tbody.closest('table').querySelectorAll('th').length;
            tbody.innerHTML = `<tr><td colspan="${colspan}" class="loading">Nog geen sessies geregistreerd</td></tr>`;
            return;
        }

        sessions.forEach(session => {
            const row = document.createElement('tr');
            
            const shortId = session.session_id.substring(0, 12) + '...';
            const timestamp = new Date(session.timestamp).toLocaleString('nl-NL');
            
            let location = '-';
            if (session.municipality || session.region) {
                const parts = [];
                if (session.municipality) parts.push(session.municipality);
                if (session.region && session.region !== session.municipality) parts.push(session.region);
                location = `<span class="location-badge">📍 ${parts.join(', ')}</span>`;
            }
            
            const device = this.parseUserAgent(session.user_agent);
            const activeTime = session.active_time ? this.formatTime(session.active_time) : '-';
            const scrollDepth = session.scroll_depth ? `${session.scroll_depth}%` : '-';
            const network = session.connection_type || '-';
            const loadTime = session.page_load_time ? `${Math.round(session.page_load_time)}ms` : '-';
            
            row.innerHTML = `
                <td title="${session.session_id}">${shortId}</td>
                <td>${timestamp}</td>
                <td class="device-info">${device}</td>
                <td>${network}</td>
                <td>${location}</td>
                <td>${activeTime}</td>
                <td>${scrollDepth}</td>
                <td>${loadTime}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    renderClicksTimeline(timeline) {
        const container = document.getElementById('timelineChart');
        container.innerHTML = '';

        if (timeline.length === 0) {
            container.innerHTML = '<p class="empty-state">Nog geen timeline data</p>';
            return;
        }

        const groupedByDate = {};
        timeline.forEach(item => {
            if (!groupedByDate[item.date]) {
                groupedByDate[item.date] = {};
            }
            groupedByDate[item.date][item.button_type] = item.count;
        });

        Object.keys(groupedByDate).sort().reverse().slice(0, 10).forEach(date => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            
            const formattedDate = new Date(date).toLocaleDateString('nl-NL', { 
                day: 'numeric', 
                month: 'short' 
            });
            
            const whatsappCount = groupedByDate[date]['whatsapp'] || 0;
            const phoneCount = groupedByDate[date]['phone'] || 0;
            const calendarCount = groupedByDate[date]['calendar'] || 0;
            
            item.innerHTML = `
                <div class="timeline-date">${formattedDate}</div>
                <div class="timeline-bars">
                    ${whatsappCount > 0 ? `<div class="timeline-bar whatsapp" style="flex: ${whatsappCount}">${whatsappCount}</div>` : ''}
                    ${phoneCount > 0 ? `<div class="timeline-bar phone" style="flex: ${phoneCount}">${phoneCount}</div>` : ''}
                    ${calendarCount > 0 ? `<div class="timeline-bar calendar" style="flex: ${calendarCount}">${calendarCount}</div>` : ''}
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    filterSessions(searchTerm) {
        if (!this.allSessions) return;

        const filtered = this.allSessions.filter(session => {
            const searchLower = searchTerm.toLowerCase();
            return session.session_id.toLowerCase().includes(searchLower) ||
                   session.user_agent.toLowerCase().includes(searchLower) ||
                   (session.referrer && session.referrer.toLowerCase().includes(searchLower));
        });

        this.renderSessionsTable(filtered);
    }

    filterByType(filterType) {
        if (!this.allSessions) return;

        let filtered = this.allSessions;

        switch(filterType) {
            case 'with-location':
                filtered = this.allSessions.filter(s => s.latitude && s.longitude);
                break;
            case 'with-clicks':
                filtered = this.allSessions.filter(s => s.time_on_page > 0);
                break;
            case 'with-forms':
                break;
            default:
                filtered = this.allSessions;
        }

        this.renderSessionsTable(filtered);
    }

    async exportData() {
        try {
            window.open(`${this.apiUrl}/export`, '_blank');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showError('Kon data niet exporteren');
        }
    }

    formatTime(seconds) {
        if (!seconds || seconds === 0) return '0s';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        
        if (mins > 0) {
            return `${mins}m ${secs}s`;
        }
        return `${secs}s`;
    }

    parseUserAgent(ua) {
        if (!ua) return 'Unknown';
        
        if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) {
            if (ua.includes('iPhone')) return '📱 iPhone';
            if (ua.includes('Android')) return '📱 Android';
            return '📱 Mobile';
        }
        
        if (ua.includes('Mac')) return '💻 Mac';
        if (ua.includes('Windows')) return '💻 Windows';
        if (ua.includes('Linux')) return '💻 Linux';
        
        return '💻 Desktop';
    }

    startAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            this.loadAllData();
        }, 30000);
    }

    showError(message) {
        console.error(message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new AnalyticsDashboard();
});
