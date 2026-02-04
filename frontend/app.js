// WISP Router Insight Frontend Application
class RouterDashboard {
    constructor() {
        this.routers = [];
        this.filteredRouters = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentSort = { field: 'name', direction: 'asc' };
        this.filters = {
            status: '',
            location: '',
            bandwidth: ''
        };

        this.initializeElements();
        this.bindEvents();
        this.loadData();
    }

    initializeElements() {
        this.elements = {
            routersTableBody: document.getElementById('routersTableBody'),
            pagination: document.getElementById('pagination'),
            statusFilter: document.getElementById('statusFilter'),
            locationFilter: document.getElementById('locationFilter'),
            bandwidthFilter: document.getElementById('bandwidthFilter'),
            applyFiltersBtn: document.getElementById('applyFilters'),
            resetFiltersBtn: document.getElementById('resetFilters'),
            sortOptions: document.querySelectorAll('#sortOptions .dropdown-item'),
            currentSortSpan: document.getElementById('currentSort'),
            refreshBtn: document.getElementById('refreshData'),
            lastUpdated: document.getElementById('lastUpdated'),
            totalRouters: document.getElementById('totalRouters'),
            onlineRouters: document.getElementById('onlineRouters'),
            offlineRouters: document.getElementById('offlineRouters')
        };
    }

    bindEvents() {
        // Filter events
        this.elements.applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        this.elements.resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        
        // Sort events
        this.elements.sortOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const field = e.target.getAttribute('data-sort');
                this.setSort(field);
            });
        });

        // Refresh data
        this.elements.refreshBtn.addEventListener('click', () => this.refreshData());

        // Input events for real-time filtering
        this.elements.locationFilter.addEventListener('input', () => this.applyFilters());
    }

    async loadData() {
        try {
            // In a real application, this would fetch from your API
            // For now, we'll simulate data
            this.routers = await this.fetchRouterData();
            this.updateStats();
            this.applyFilters();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load router data');
        }
    }

    async fetchRouterData() {
        // Simulate API call - in real implementation, replace with actual fetch
        return new Promise((resolve) => {
            setTimeout(() => {
                // Sample data to demonstrate functionality
                const sampleData = [
                    {
                        id: 'router-001',
                        name: 'Customer-Alpha-001',
                        status: 'online',
                        location: 'Downtown',
                        uptime: '2 days, 14:32:15',
                        bandwidth: { used: 65, total: 100, unit: 'Mbps' },
                        wireless: { ssid: 'Alpha-WiFi', signal: -45, clients: 12 },
                        lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
                        system: {
                            uptime: '2 days, 14:32:15',
                            version: '7.12',
                            boardName: 'hAP ac²',
                            cpuLoad: 25,
                            memoryUsed: 45
                        },
                        interfaces: [
                            { name: 'ether1', type: 'ethernet', rx: '1.2GB', tx: '850MB', status: 'up' },
                            { name: 'wlan1', type: 'wireless', rx: '800MB', tx: '600MB', status: 'up' }
                        ]
                    },
                    {
                        id: 'router-002',
                        name: 'Customer-Beta-002',
                        status: 'online',
                        location: 'Suburbs',
                        uptime: '5 days, 08:21:43',
                        bandwidth: { used: 32, total: 100, unit: 'Mbps' },
                        wireless: { ssid: 'Beta-WiFi', signal: -52, clients: 8 },
                        lastSeen: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
                        system: {
                            uptime: '5 days, 08:21:43',
                            version: '7.11',
                            boardName: 'hAP lite',
                            cpuLoad: 18,
                            memoryUsed: 32
                        },
                        interfaces: [
                            { name: 'ether1', type: 'ethernet', rx: '800MB', tx: '450MB', status: 'up' },
                            { name: 'wlan1', type: 'wireless', rx: '600MB', tx: '300MB', status: 'up' }
                        ]
                    },
                    {
                        id: 'router-003',
                        name: 'Customer-Gamma-003',
                        status: 'warning',
                        location: 'Industrial',
                        uptime: '1 day, 03:15:22',
                        bandwidth: { used: 88, total: 100, unit: 'Mbps' },
                        wireless: { ssid: 'Gamma-WiFi', signal: -68, clients: 24 },
                        lastSeen: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
                        system: {
                            uptime: '1 day, 03:15:22',
                            version: '7.10',
                            boardName: 'hAP ax',
                            cpuLoad: 78,
                            memoryUsed: 82
                        },
                        interfaces: [
                            { name: 'ether1', type: 'ethernet', rx: '2.1GB', tx: '1.8GB', status: 'up' },
                            { name: 'wlan1', type: 'wireless', rx: '1.8GB', tx: '1.5GB', status: 'up' }
                        ]
                    },
                    {
                        id: 'router-004',
                        name: 'Customer-Delta-004',
                        status: 'offline',
                        location: 'Rural',
                        uptime: '0 days, 00:00:00',
                        bandwidth: { used: 0, total: 100, unit: 'Mbps' },
                        wireless: { ssid: 'Delta-WiFi', signal: null, clients: 0 },
                        lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
                        system: {
                            uptime: '0 days, 00:00:00',
                            version: '7.12',
                            boardName: 'hAP mini',
                            cpuLoad: 0,
                            memoryUsed: 0
                        },
                        interfaces: []
                    },
                    {
                        id: 'router-005',
                        name: 'Customer-Epsilon-005',
                        status: 'online',
                        location: 'Downtown',
                        uptime: '7 days, 12:45:30',
                        bandwidth: { used: 45, total: 100, unit: 'Mbps' },
                        wireless: { ssid: 'Epsilon-WiFi', signal: -42, clients: 15 },
                        lastSeen: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
                        system: {
                            uptime: '7 days, 12:45:30',
                            version: '7.12',
                            boardName: 'hAP ac³',
                            cpuLoad: 32,
                            memoryUsed: 38
                        },
                        interfaces: [
                            { name: 'ether1', type: 'ethernet', rx: '1.5GB', tx: '900MB', status: 'up' },
                            { name: 'wlan1', type: 'wireless', rx: '1.0GB', tx: '700MB', status: 'up' }
                        ]
                    },
                    {
                        id: 'router-006',
                        name: 'Customer-Zeta-006',
                        status: 'online',
                        location: 'Suburbs',
                        uptime: '3 days, 09:18:07',
                        bandwidth: { used: 72, total: 100, unit: 'Mbps' },
                        wireless: { ssid: 'Zeta-WiFi', signal: -55, clients: 18 },
                        lastSeen: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
                        system: {
                            uptime: '3 days, 09:18:07',
                            version: '7.11',
                            boardName: 'hAP ac²',
                            cpuLoad: 65,
                            memoryUsed: 58
                        },
                        interfaces: [
                            { name: 'ether1', type: 'ethernet', rx: '1.8GB', tx: '1.2GB', status: 'up' },
                            { name: 'wlan1', type: 'wireless', rx: '1.5GB', tx: '950MB', status: 'up' }
                        ]
                    },
                    {
                        id: 'router-007',
                        name: 'Customer-Theta-007',
                        status: 'warning',
                        location: 'Downtown',
                        uptime: '1 day, 15:30:45',
                        bandwidth: { used: 92, total: 100, unit: 'Mbps' },
                        wireless: { ssid: 'Theta-WiFi', signal: -70, clients: 28 },
                        lastSeen: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
                        system: {
                            uptime: '1 day, 15:30:45',
                            version: '7.10',
                            boardName: 'hAP ax',
                            cpuLoad: 85,
                            memoryUsed: 88
                        },
                        interfaces: [
                            { name: 'ether1', type: 'ethernet', rx: '2.5GB', tx: '2.0GB', status: 'up' },
                            { name: 'wlan1', type: 'wireless', rx: '2.2GB', tx: '1.8GB', status: 'up' }
                        ]
                    },
                    {
                        id: 'router-008',
                        name: 'Customer-Iota-008',
                        status: 'online',
                        location: 'Rural',
                        uptime: '4 days, 22:10:15',
                        bandwidth: { used: 28, total: 100, unit: 'Mbps' },
                        wireless: { ssid: 'Iota-WiFi', signal: -48, clients: 6 },
                        lastSeen: new Date(Date.now() - 7 * 60 * 1000), // 7 minutes ago
                        system: {
                            uptime: '4 days, 22:10:15',
                            version: '7.12',
                            boardName: 'hAP mini',
                            cpuLoad: 22,
                            memoryUsed: 28
                        },
                        interfaces: [
                            { name: 'ether1', type: 'ethernet', rx: '750MB', tx: '400MB', status: 'up' },
                            { name: 'wlan1', type: 'wireless', rx: '600MB', tx: '300MB', status: 'up' }
                        ]
                    },
                    {
                        id: 'router-009',
                        name: 'Customer-Kappa-009',
                        status: 'online',
                        location: 'Industrial',
                        uptime: '6 days, 01:45:20',
                        bandwidth: { used: 55, total: 100, unit: 'Mbps' },
                        wireless: { ssid: 'Kappa-WiFi', signal: -50, clients: 20 },
                        lastSeen: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
                        system: {
                            uptime: '6 days, 01:45:20',
                            version: '7.11',
                            boardName: 'hAP ac²',
                            cpuLoad: 42,
                            memoryUsed: 45
                        },
                        interfaces: [
                            { name: 'ether1', type: 'ethernet', rx: '1.3GB', tx: '950MB', status: 'up' },
                            { name: 'wlan1', type: 'wireless', rx: '1.0GB', tx: '800MB', status: 'up' }
                        ]
                    },
                    {
                        id: 'router-010',
                        name: 'Customer-Lambda-010',
                        status: 'offline',
                        location: 'Suburbs',
                        uptime: '0 days, 00:00:00',
                        bandwidth: { used: 0, total: 100, unit: 'Mbps' },
                        wireless: { ssid: 'Lambda-WiFi', signal: null, clients: 0 },
                        lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                        system: {
                            uptime: '0 days, 00:00:00',
                            version: '7.10',
                            boardName: 'hAP lite',
                            cpuLoad: 0,
                            memoryUsed: 0
                        },
                        interfaces: []
                    }
                ];
                return sampleData;
            }, 500); // Simulate network delay
        });
    }

    applyFilters() {
        // Update filter values
        this.filters.status = this.elements.statusFilter.value;
        this.filters.location = this.elements.locationFilter.value.toLowerCase();
        this.filters.bandwidth = this.elements.bandwidthFilter.value;

        // Apply filters
        this.filteredRouters = this.routers.filter(router => {
            // Status filter
            if (this.filters.status && router.status !== this.filters.status) {
                return false;
            }

            // Location filter
            if (this.filters.location && !router.location.toLowerCase().includes(this.filters.location)) {
                return false;
            }

            // Bandwidth filter
            if (this.filters.bandwidth) {
                const usagePercent = (router.bandwidth.used / router.bandwidth.total) * 100;
                if (this.filters.bandwidth === 'high' && usagePercent <= 80) return false;
                if (this.filters.bandwidth === 'medium' && (usagePercent <= 50 || usagePercent > 80)) return false;
                if (this.filters.bandwidth === 'low' && usagePercent >= 50) return false;
            }

            return true;
        });

        // Reset to first page after filtering
        this.currentPage = 1;
        
        // Sort the filtered results
        this.sortRouters();
        
        // Update the display
        this.renderTable();
        this.updatePagination();
        this.updateStats();
    }

    resetFilters() {
        this.elements.statusFilter.value = '';
        this.elements.locationFilter.value = '';
        this.elements.bandwidthFilter.value = '';
        
        this.filters = {
            status: '',
            location: '',
            bandwidth: ''
        };

        this.applyFilters();
    }

    setSort(field) {
        if (this.currentSort.field === field) {
            // Toggle direction if clicking the same field
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            // Set new field with ascending order
            this.currentSort = { field, direction: 'asc' };
        }

        this.elements.currentSortSpan.textContent = this.getSortFieldName(field);
        this.sortRouters();
        this.renderTable();
    }

    getSortFieldName(field) {
        const names = {
            'name': 'Name',
            'status': 'Status',
            'bandwidth': 'Bandwidth',
            'uptime': 'Uptime',
            'location': 'Location'
        };
        return names[field] || field;
    }

    sortRouters() {
        this.filteredRouters.sort((a, b) => {
            let aValue, bValue;

            switch (this.currentSort.field) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'status':
                    aValue = ['online', 'warning', 'offline'].indexOf(a.status);
                    bValue = ['online', 'warning', 'offline'].indexOf(b.status);
                    break;
                case 'bandwidth':
                    aValue = a.bandwidth.used / a.bandwidth.total;
                    bValue = b.bandwidth.used / b.bandwidth.total;
                    break;
                case 'uptime':
                    // Compare uptime strings - convert to seconds for comparison
                    aValue = this.uptimeToSeconds(a.uptime);
                    bValue = this.uptimeToSeconds(b.uptime);
                    break;
                case 'location':
                    aValue = a.location.toLowerCase();
                    bValue = b.location.toLowerCase();
                    break;
                default:
                    aValue = a[this.currentSort.field];
                    bValue = b[this.currentSort.field];
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return this.currentSort.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.currentSort.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    uptimeToSeconds(uptimeStr) {
        // Convert uptime string like "2 days, 14:32:15" to seconds
        const parts = uptimeStr.split(/[, ]+/);
        let totalSeconds = 0;
        let i = 0;

        while (i < parts.length) {
            const num = parseInt(parts[i]);
            if (isNaN(num)) {
                i++;
                continue;
            }

            const unit = parts[i + 1].toLowerCase();
            if (unit.startsWith('day')) {
                totalSeconds += num * 24 * 60 * 60;
            } else if (unit.startsWith('hour')) {
                totalSeconds += num * 60 * 60;
            } else if (unit.startsWith('min')) {
                totalSeconds += num * 60;
            } else if (unit.startsWith('sec')) {
                totalSeconds += num;
            }

            i += 2;
        }

        // Handle time format like "14:32:15"
        const timeMatch = uptimeStr.match(/(\d{1,2}):(\d{2}):(\d{2})/);
        if (timeMatch) {
            const [, hours, minutes, seconds] = timeMatch.map(Number);
            totalSeconds += hours * 3600 + minutes * 60 + seconds;
        }

        return totalSeconds;
    }

    renderTable() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredRouters.length);
        const pageRouters = this.filteredRouters.slice(startIndex, endIndex);

        let html = '';

        pageRouters.forEach(router => {
            const statusClass = `status-${router.status}`;
            const statusText = router.status.charAt(0).toUpperCase() + router.status.slice(1);
            const bandwidthPercent = (router.bandwidth.used / router.bandwidth.total) * 100;
            const bandwidthClass = bandwidthPercent > 80 ? 'high' : bandwidthPercent > 50 ? 'medium' : 'low';
            const signalBars = this.getSignalBars(router.wireless.signal);

            html += `
                <tr>
                    <td>
                        <strong>${router.name}</strong>
                        <div class="text-muted small">${router.id}</div>
                    </td>
                    <td>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <div class="text-muted small">${this.formatTimeAgo(router.lastSeen)}</div>
                    </td>
                    <td>${router.location}</td>
                    <td>${router.uptime}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1 me-2">
                                <div class="bandwidth-bar">
                                    <div class="bandwidth-fill bandwidth-${bandwidthClass}" style="width: ${bandwidthPercent}%"></div>
                                </div>
                            </div>
                            <span>${router.bandwidth.used}/${router.bandwidth.total}${router.bandwidth.unit}</span>
                        </div>
                    </td>
                    <td>
                        <div class="signal-strength">
                            ${signalBars}
                            <span class="ms-2">${router.wireless.signal || 'N/A'} dBm</span>
                        </div>
                    </td>
                    <td>${router.wireless.clients}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary action-btn" onclick="dashboard.showRouterDetails('${router.id}')">
                            <i class="fas fa-info-circle"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary action-btn" onclick="dashboard.restartRouter('${router.id}')">
                            <i class="fas fa-redo"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger action-btn" onclick="dashboard.disconnectRouter('${router.id}')">
                            <i class="fas fa-power-off"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        this.elements.routersTableBody.innerHTML = html;
    }

    getSignalBars(signal) {
        if (signal === null) return '<span class="text-muted">N/A</span>';
        
        let barsHtml = '';
        const bars = 4;
        let activeBars = 0;

        if (signal >= -50) activeBars = bars;
        else if (signal >= -60) activeBars = 3;
        else if (signal >= -70) activeBars = 2;
        else if (signal >= -80) activeBars = 1;

        for (let i = 0; i < bars; i++) {
            const isActive = i < activeBars;
            const barClass = isActive ? 
                (signal >= -60 ? 'active' : signal >= -70 ? 'medium' : 'low') : 
                '';
            barsHtml += `<div class="signal-bar ${barClass}"></div>`;
        }

        return barsHtml;
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return `${Math.floor(diffMins / 1440)}d ago`;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredRouters.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            this.elements.pagination.innerHTML = '';
            return;
        }

        let html = '';

        // Previous button
        if (this.currentPage > 1) {
            html += `<li class="page-item"><a class="page-link" href="#" onclick="dashboard.goToPage(${this.currentPage - 1})">Previous</a></li>`;
        } else {
            html += `<li class="page-item disabled"><span class="page-link">Previous</span></li>`;
        }

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            html += `<li class="page-item"><a class="page-link" href="#" onclick="dashboard.goToPage(1)">1</a></li>`;
            if (startPage > 2) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `<li class="page-item ${i === this.currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="dashboard.goToPage(${i})">${i}</a>
            </li>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            html += `<li class="page-item"><a class="page-link" href="#" onclick="dashboard.goToPage(${totalPages})">${totalPages}</a></li>`;
        }

        // Next button
        if (this.currentPage < totalPages) {
            html += `<li class="page-item"><a class="page-link" href="#" onclick="dashboard.goToPage(${this.currentPage + 1})">Next</a></li>`;
        } else {
            html += `<li class="page-item disabled"><span class="page-link">Next</span></li>`;
        }

        this.elements.pagination.innerHTML = html;
    }

    goToPage(page) {
        if (page >= 1 && page <= Math.ceil(this.filteredRouters.length / this.itemsPerPage)) {
            this.currentPage = page;
            this.renderTable();
            this.updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    updateStats() {
        this.elements.totalRouters.textContent = this.routers.length;
        this.elements.onlineRouters.textContent = this.routers.filter(r => r.status === 'online').length;
        this.elements.offlineRouters.textContent = this.routers.filter(r => r.status === 'offline').length;
        
        this.elements.lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }

    async refreshData() {
        const originalText = this.elements.refreshBtn.innerHTML;
        this.elements.refreshBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Refreshing...';
        this.elements.refreshBtn.disabled = true;

        try {
            await this.loadData();
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.showError('Failed to refresh data');
        } finally {
            this.elements.refreshBtn.innerHTML = originalText;
            this.elements.refreshBtn.disabled = false;
        }
    }

    showRouterDetails(routerId) {
        const router = this.routers.find(r => r.id === routerId);
        if (!router) return;

        document.getElementById('routerDetailsTitle').textContent = `Details: ${router.name}`;

        // Populate system info
        let systemHtml = '';
        systemHtml += `<tr><td>Uptime</td><td>${router.system.uptime}</td></tr>`;
        systemHtml += `<tr><td>Version</td><td>${router.system.version}</td></tr>`;
        systemHtml += `<tr><td>Board</td><td>${router.system.boardName}</td></tr>`;
        systemHtml += `<tr><td>CPU Load</td><td>${router.system.cpuLoad}%</td></tr>`;
        systemHtml += `<tr><td>Memory Used</td><td>${router.system.memoryUsed}%</td></tr>`;
        document.getElementById('systemInfo').innerHTML = systemHtml;

        // Populate interface info
        let interfaceHtml = '';
        if (router.interfaces.length > 0) {
            router.interfaces.forEach(iface => {
                interfaceHtml += `
                    <div class="interface-card card mb-2">
                        <div class="card-body p-2">
                            <div class="d-flex justify-content-between">
                                <strong>${iface.name}</strong>
                                <span class="badge bg-${iface.status === 'up' ? 'success' : 'danger'}">${iface.status}</span>
                            </div>
                            <small class="text-muted">${iface.type}</small>
                            <div class="mt-1">
                                RX: ${iface.rx} | TX: ${iface.tx}
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            interfaceHtml = '<p class="text-muted">No interfaces detected</p>';
        }
        document.getElementById('interfaceInfo').innerHTML = interfaceHtml;

        // Populate wireless info
        let wirelessHtml = '';
        if (router.wireless.ssid) {
            wirelessHtml += `
                <div class="wireless-card card mb-2">
                    <div class="card-body p-2">
                        <div class="d-flex justify-content-between">
                            <strong>SSID</strong>
                            <span>${router.wireless.ssid}</span>
                        </div>
                        <div class="d-flex justify-content-between mt-1">
                            <span>Signal Strength</span>
                            <span>${router.wireless.signal || 'N/A'} dBm</span>
                        </div>
                        <div class="d-flex justify-content-between mt-1">
                            <span>Clients Connected</span>
                            <span>${router.wireless.clients}</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            wirelessHtml = '<p class="text-muted">No wireless interface detected</p>';
        }
        document.getElementById('wirelessInfo').innerHTML = wirelessHtml;

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('routerDetailsModal'));
        modal.show();
    }

    async restartRouter(routerId) {
        if (confirm(`Are you sure you want to restart ${routerId}?`)) {
            try {
                // In a real implementation, this would send a restart command to the router
                console.log(`Restarting router: ${routerId}`);
                this.showMessage(`Restart command sent to ${routerId}`, 'success');
            } catch (error) {
                console.error('Error restarting router:', error);
                this.showError('Failed to restart router');
            }
        }
    }

    async disconnectRouter(routerId) {
        if (confirm(`Are you sure you want to disconnect ${routerId}?`)) {
            try {
                // In a real implementation, this would send a disconnect command
                console.log(`Disconnecting router: ${routerId}`);
                this.showMessage(`Disconnect command sent to ${routerId}`, 'success');
            } catch (error) {
                console.error('Error disconnecting router:', error);
                this.showError('Failed to disconnect router');
            }
        }
    }

    showMessage(message, type = 'info') {
        // Create a temporary alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.zIndex = '9999';
        alert.role = 'alert';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alert);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    showError(message) {
        this.showMessage(message, 'danger');
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new RouterDashboard();
});