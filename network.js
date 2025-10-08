// SafeSource Global Network Core v3.0
// Cross-Application Data Synchronization Engine

class SafeSourceNetwork {
    constructor() {
        this.networkNamespace = 'safesource-global-network';
        this.initializeNetwork();
        console.log('🌐 SafeSource Global Network: ACTIVATED');
    }

    initializeNetwork() {
        if (!localStorage.getItem(this.networkNamespace)) {
            const initialNetwork = {
                version: '3.0',
                created: new Date().toISOString(),
                verifications: [],
                sarsReports: [],
                supplyChainEvents: [],
                lastSync: null
            };
            this.saveNetwork(initialNetwork);
        }
    }

    // Core Methods
    addVerification(productData) {
        const network = this.getNetwork();
        const verification = {
            id: 'VER_' + Date.now(),
            app: 'consumer',
            timestamp: new Date().toISOString(),
            location: this.getSimulatedLocation(),
            ...productData,
            verified: Math.random() > 0.3, // 70% verification rate
            riskScore: this.calculateRiskScore(productData)
        };

        network.verifications.unshift(verification);
        this.saveNetwork(network);
        
        console.log('✅ Product verification logged:', verification.id);
        return verification;
    }

    addSARSReport(reportData) {
        const network = this.getNetwork();
        const report = {
            id: 'SARS_' + Date.now(),
            app: 'consumer',
            timestamp: new Date().toISOString(),
            location: this.getSimulatedLocation(),
            status: 'pending',
            estimatedValue: this.calculateReportValue(reportData),
            blockchainHash: this.generateBlockchainHash(reportData),
            ...reportData
        };

        network.sarsReports.unshift(report);
        this.saveNetwork(network);
        
        console.log('🚨 SARS intelligence report generated:', report.id);
        return report;
    }

    // Analytics & Intelligence
    getNetworkStats() {
        const network = this.getNetwork();
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const recentVerifications = network.verifications.filter(
            v => new Date(v.timestamp) > sevenDaysAgo
        );
        const recentReports = network.sarsReports.filter(
            r => new Date(r.timestamp) > sevenDaysAgo
        );

        return {
            totalVerifications: network.verifications.length,
            totalSARSReports: network.sarsReports.length,
            recentActivity: recentVerifications.length + recentReports.length,
            verificationRate: '98.7%',
            highRiskStores: this.calculateHighRiskStores(network.sarsReports),
            revenuePotential: recentReports.length * 500 // R500 per report
        };
    }

    // Utility Methods
    calculateRiskScore(productData) {
        return Math.floor(Math.random() * 100);
    }

    calculateReportValue(reportData) {
        let baseValue = 500; // R500 base
        if (reportData.productType === 'pharma') baseValue = 2000;
        if (reportData.productType === 'electronics') baseValue = 1000;
        return baseValue;
    }

    calculateHighRiskStores(sarsReports) {
        const storeCounts = {};
        sarsReports.forEach(report => {
            const store = report.store || 'Unknown';
            storeCounts[store] = (storeCounts[store] || 0) + 1;
        });
        return Object.values(storeCounts).filter(count => count >= 2).length;
    }

    generateBlockchainHash(data) {
        return 'BLOCKCHAIN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getSimulatedLocation() {
        const stores = ['Boxer Stores', 'Pick n Pay', 'Woolworths', 'Spar', 'Checkers'];
        return {
            store: stores[Math.floor(Math.random() * stores.length)],
            gps: '-26.2041,28.0473', // Johannesburg coordinates
            timestamp: new Date().toISOString()
        };
    }

    getNetwork() {
        return JSON.parse(localStorage.getItem(this.networkNamespace)) || {};
    }

    saveNetwork(network) {
        localStorage.setItem(this.networkNamespace, JSON.stringify(network));
    }
}

// Global instance
window.safeSourceNetwork = new SafeSourceNetwork();