// Functions for calculating and updating dashboard metrics
export function calculateTotalRevenue(data) {
    return data.reduce((total, row) => {
        const fee = row['Total occupance fee'] ? 
            Number(row['Total occupance fee'].replace(/[^0-9.-]+/g, '')) : 0;
        return total + fee;
    }, 0);
}

export function updateWebpageForRevenue(totalRevenue) {
    const formattedRevenue = new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
    }).format(totalRevenue);

    const totalRevenueElement = document.getElementById('total-revenue');
    if (totalRevenueElement) {
        totalRevenueElement.textContent = formattedRevenue;
    }
}

export function calcuLateTotalClients(data) {
    return data.reduce((total, row) => {
        const clients = row['_x0023_ of people referred'] ?
            Number(row['_x0023_ of people referred']) : 0;
        return total + clients;
    }, 0);
}

export function updateWebpageForClients(totalClients) {
    const totalClientsElement = document.getElementById('total-clients');
    if (totalClientsElement) {
        totalClientsElement.textContent= totalClients;
        
    }
}

export function calculateTotalNightsAccommodated(data) {
    return data.reduce((total, row) => {
        const nights = row['_x0023_ of nights accommodated'] ? 
            Number(row['_x0023_ of nights accommodated']) : 0;
        return total + nights;
    }, 0);
}

export function updateWebpageForNights(totalNights) {
    const totalNightsElement = document.getElementById('total-nights');
    if (totalNightsElement) {
        totalNightsElement.textContent = totalNights.toString();
    }
}

export function averageCostPerNight(data){
    const totalRevenue = calculateTotalRevenue(data);
    const totalNights = calculateTotalNightsAccommodated(data);
    return totalNights > 0 ? (totalRevenue / totalNights).toFixed(2) : 0;
}

export function updateWebpageForAverageCostPerNight(averageCost) {
    const averageCostElement = document.getElementById('average-cost-per-night');
    if (averageCostElement) {
        averageCostElement.textContent = new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD'
        }).format(averageCost);
    }
}

export function calculateOccupantDistribution(data) {
    const distribution = {};
    
    data.forEach(row => {
        const location = row['Property of STA'] || 'Unknown';
        const peopleReferred = row['_x0023_ of people referred'] ? Number(row['_x0023_ of people referred']) : 0;
        
        if (!distribution[location]) {
            distribution[location] = 0;
        }
        distribution[location] += peopleReferred;
    });
    
    return Object.entries(distribution).map(([label, value]) => ({ label, value }));
}

export function calculateTotalOccupants(distributionData) {
    return distributionData.reduce((total, item) => total + item.value, 0);
}

export function updateOccupantDistributionChart(distributionData) {
    const element = document.getElementById('occupant-distribution-chart');
    if (element && window.Morris) {
        Morris.Donut({
            element: "occupant-distribution-chart",
            resize: true,
            colors: ["#2e7ce4", "#00c2b2", "#df3554", "#f3b600", "#6658dd", "#4fc6e1"],
            data: distributionData,
            formatter: function (value, data) {
                const total = distributionData.reduce((sum, item) => sum + item.value, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return percentage + '%';
            }
        });
    }

    // Calculate total occupants and update the webpage
    const totalOccupants = calculateTotalOccupants(distributionData);
    const totalOccupantsElement = document.getElementById('total-occupant-number');
    if (totalOccupantsElement) {
        totalOccupantsElement.textContent = totalOccupants;
    }
}

export function calculatePresentingIssuesVsFee(data) {

    
    const issuesMap = new Map();
    
    data.forEach((row, index) => {
        // Log each row's structure for the first few entries
        if (index < 3) {
            console.log(`Row ${index} complete data:`, row);
        }
        
        // Look for any field containing 'issue' or 'presenting'
        const issueField = Object.keys(row).find(key => 
            key.toLowerCase().includes('issue') || 
            key.toLowerCase().includes('presenting')
        );
        
        let issue = issueField ? row[issueField] : 'Unknown';
        let fee = row['Total occupance fee'] || 0;
        
        // Convert fee to number
        fee = typeof fee === 'string' ? parseFloat(fee.replace(/[^0-9.-]+/g, '')) : Number(fee) || 0;
        
        
        
        if (!issuesMap.has(issue)) {
            issuesMap.set(issue, fee);
        } else {
            issuesMap.set(issue, issuesMap.get(issue) + fee);
        }
    });

    const chartData = Array.from(issuesMap)
        .map(([issue, totalFee]) => ({
            x: issue,
            value: totalFee
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    
    
    return chartData;
}

export function updatePresentingIssuesChart(chartData) {
    const element = document.getElementById('presentatingIssues-vs-occupancyFee-bar');
    if (!element) {
        // Skip if element doesn't exist (we're not on the dashboard page)
        return;
    }
    
    if (window.Morris) {
        Morris.Bar({
            element: "presentatingIssues-vs-occupancyFee-bar",
            data: chartData,
            xkey: 'x',
            ykeys: ['value'],
            labels: ['Total Occupancy Fee'],
            barColors: ['#36A2EB'],
            hideHover: 'auto',
            gridLineColor: '#eef0f2',
            resize: true,
            gridTextSize: 11,
            gridTextColor: '#858d98',
            xLabelAngle: 45,
            parseTime: false,
            yLabelFormat: function(y) {
                return '$' + y.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        });
    } else {
        console.error('Morris library not found');
    }
}