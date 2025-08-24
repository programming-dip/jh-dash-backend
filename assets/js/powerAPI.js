import {
    calculateTotalRevenue,
    updateWebpageForRevenue,
    calcuLateTotalClients,
    updateWebpageForClients,
    calculateTotalNightsAccommodated,
    updateWebpageForNights,
    averageCostPerNight,
    updateWebpageForAverageCostPerNight,
    calculateOccupantDistribution,
    updateOccupantDistributionChart,
    calculatePresentingIssuesVsFee,
    updatePresentingIssuesChart
} from './services/dashboardServices.js';

import {
    calculateIncomeTypeDistribution,
    calculateGenderDistribution,
    calculatePropertyDistribution,
    calculateOccupancyFeeByProperty,
    calculatePresentingIssuesDistribution,
    calculateExitBarriersDistribution,
    calculateHomelessnessHistory,
    calculateHomelessnessReferrals,
    calculateTenancyFacilitation,
    calculateClientEngagement,
    calculatePaymentTypeDistribution,
    calculateExitStatusDistribution,
    initPieChart,
    initGenderChart,
    initPropertyChart,
    initOccupancyFeeChart,
    initPresentingIssuesChart,
    initExitBarriersChart,
    initHomelessnessHistoryChart,
    initHomelessnessReferralsChart,
    initTenancyFacilitationChart,
    initClientEngagementChart,
    initPaymentTypeChart,
    initExitStatusChart
} from './pages/charts.js';

import { CONFIG } from './config.js';
import { getSecureCredentials } from './utils/auth.utils.js';

// Function to fetch and log data from Power Apps
async function fetchData() {
    try {
        const response = await fetch(CONFIG.POWER_APPS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                passWord: getSecureCredentials().password,
                userID: getSecureCredentials().userID
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Log the data to the console
        console.log('Data fetched from Power Apps:', data);
        // log first 5 rows of data
        console.log('First 5 rows of data:', data.slice(0, 5));






        // Wait for document ready
        $(document).ready(function () {
            console.log('Document ready, initializing charts');

            // Initialize charts if we're on the charts page
            if (window.location.pathname.includes('charts.html')) {
                const incomeTypeData = calculateIncomeTypeDistribution(data);
                console.log('Income Type Distribution Data:', incomeTypeData);
                initPieChart(incomeTypeData);

                const genderData = calculateGenderDistribution(data);
                console.log('Gender Distribution Data:', genderData);
                initGenderChart(genderData);

                const propertyData = calculatePropertyDistribution(data);
                console.log('Property Distribution Data:', propertyData);
                initPropertyChart(propertyData);

                const occupancyFeeData = calculateOccupancyFeeByProperty(data);
                console.log('Occupancy Fee Data:', occupancyFeeData);
                initOccupancyFeeChart(occupancyFeeData);

                const presentingIssuesData = calculatePresentingIssuesDistribution(data);
                console.log('Presenting Issues Data:', presentingIssuesData);
                initPresentingIssuesChart(presentingIssuesData);

                const exitBarriersData = calculateExitBarriersDistribution(data);
                console.log('Exit Barriers Data:', exitBarriersData);
                initExitBarriersChart(exitBarriersData);

                const homelessnessData = calculateHomelessnessHistory(data);
                console.log('Homelessness History Data:', homelessnessData);
                initHomelessnessHistoryChart(homelessnessData);

                const homelessnessReferralsData = calculateHomelessnessReferrals(data);
                console.log('Homelessness Referrals Data:', homelessnessReferralsData);
                initHomelessnessReferralsChart(homelessnessReferralsData);

                const tenancyFacilitationData = calculateTenancyFacilitation(data);
                console.log('Tenancy Facilitation Data:', tenancyFacilitationData);
                initTenancyFacilitationChart(tenancyFacilitationData);

                const clientEngagementData = calculateClientEngagement(data);
                console.log('Client Engagement Data:', clientEngagementData);
                initClientEngagementChart(clientEngagementData);

                const paymentTypeData = calculatePaymentTypeDistribution(data);
                console.log('Payment Type Distribution Data:', paymentTypeData);
                initPaymentTypeChart(paymentTypeData);

                const exitStatusData = calculateExitStatusDistribution(data);
                console.log('Exit Status Distribution Data:', exitStatusData);
                initExitStatusChart(exitStatusData);
            }

            // Only update dashboard components if we're on the index page
            if (window.location.pathname.includes('index.html')) {
                // Calculate and update Total Revenue Generated
                const totalRevenue = calculateTotalRevenue(data);
                updateWebpageForRevenue(totalRevenue);

                // Calculate and update Total Clients Served
                const totalClients = calcuLateTotalClients(data);
                updateWebpageForClients(totalClients);

                // Calculate and update Total Nights Accommodated
                const totalNights = calculateTotalNightsAccommodated(data);
                updateWebpageForNights(totalNights);

                // Calculate and update Average Cost Per Night
                const averageCostPerNightValue = averageCostPerNight(data);
                updateWebpageForAverageCostPerNight(averageCostPerNightValue);

                // Calculate and update occupant distribution
                const distributionData = calculateOccupantDistribution(data);
                updateOccupantDistributionChart(distributionData);

                // Calculate and update Presenting Issues vs Fee chart
                const presentingIssuesData = calculatePresentingIssuesVsFee(data);
                updatePresentingIssuesChart(presentingIssuesData);
            }

            
        });

        return data; // Return the data to indicate successful authentication

    } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.message);
    }
}

// Export the function to make it available in login.html
window.fetchData = fetchData;

// Only call fetchData automatically if we're not on the login page
if (!window.location.pathname.includes('login.html')) {
    fetchData();
}
