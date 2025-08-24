// The Income Type chart starts here
// Function to calculate income types and their total occupancy fees
export function calculateIncomeTypeDistribution(data) {
    const incomeMap = new Map();
    
    data.forEach(row => {
        const incomeType = row['Income Type'] || 'Unknown';
        let fee = row['Total occupance fee'] || 0;
        
        // Convert fee to number
        fee = typeof fee === 'string' ? parseFloat(fee.replace(/[^0-9.-]+/g, '')) : Number(fee) || 0;
        
        if (!incomeMap.has(incomeType)) {
            incomeMap.set(incomeType, fee);
        } else {
            incomeMap.set(incomeType, incomeMap.get(incomeType) + fee);
        }
    });

    // Convert map to array of objects for Morris Chart
    const chartData = Array.from(incomeMap).map(([label, value]) => ({
        label,
        value
    }));

    return chartData;
}



// Function to initialize the income distribution pie chart
export function initPieChart(chartData) {
    // Format the currency for the labels
    const formatter = new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
    });

    const options = {
        element: 'pie_chart',
        data: chartData,
        colors: ["#2e7ce4", "#00c2b2", "#df3554", "#f3b600", "#6658dd", "#4fc6e1"],
        formatter: function (y, data) {
            return data.label + ': ' + formatter.format(y);
        }
    };

    Morris.Donut(options);

    // Find the highest income type and update the text
    const maxEntry = chartData.reduce((max, current) => 
        current.value > max.value ? current : max
    , chartData[0]);
      // Update the text in the card
    const incomeTypeSpan = document.querySelector('#highIncomeType span');
    if (incomeTypeSpan) {
        incomeTypeSpan.textContent = `${maxEntry.label} (${formatter.format(maxEntry.value)})`;
    }
}
// The Income Type chart ends here


// The gender chart starts here
// Function to calculate gender distribution
export function calculateGenderDistribution(data) {
    const genderMap = new Map();
      data.forEach(row => {
        let gender = row['Gender of all clients'];
        
        // Clean up and standardize gender values
        if (!gender || gender.trim() === '' || gender === 'null' || gender === 'undefined') {
            gender = 'Not Specified';
        } else {
            // Convert M/F to Male/Female
            gender = gender.trim().toUpperCase();
            if (gender === 'M') {
                gender = 'Male';
            } else if (gender === 'F') {
                gender = 'Female';
            } else {
                // For any other value, capitalize first letter
                gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
            }
        }
        
        if (!genderMap.has(gender)) {
            genderMap.set(gender, 1);
        } else {
            genderMap.set(gender, genderMap.get(gender) + 1);
        }
    });

    // Convert map to array of objects for Morris Chart
    const chartData = Array.from(genderMap).map(([label, value]) => ({
        label,
        value
    }));

    return chartData;
}
// Function to initialize the gender chart
export function initGenderChart(chartData) {
    const options = {
        element: 'gender_chart',
        data: chartData,
        colors: ["#2e7ce4", "#FFC0CB", "#df3554"],
        formatter: function (y, data) {
            return data.label + ': ' + y + ' clients';
        }
    };

    Morris.Donut(options);

    // Find the predominant gender and update the text
    const maxEntry = chartData.reduce((max, current) => 
        current.value > max.value ? current : max
    , chartData[0]);
    
    // Update the text in the card
    const genderSpan = document.querySelector('.card:nth-child(2) p span');
    if (genderSpan) {
        genderSpan.textContent = `${maxEntry.label} (${maxEntry.value} clients)`;
    }
} 

// The gender chart ends here

// The property chart starts here
// Function to calculate nights accommodated by property
export function calculatePropertyDistribution(data) {    const propertyMap = new Map();
    
    data.forEach(row => {
        let property = row['Property of STA'] || 'Unknown';
        // Clean up property name
        property = property.trim();
        
        const nights = row['_x0023_ of nights accommodated'] ? 
            Number(row['_x0023_ of nights accommodated']) : 0;
        
        if (!propertyMap.has(property)) {
            propertyMap.set(property, nights);
        } else {
            propertyMap.set(property, propertyMap.get(property) + nights);
        }
    });

    // Convert map to array of objects for Morris Chart
    const chartData = Array.from(propertyMap)
        .map(([label, value]) => ({
            property: label,
            nights: value
        }))
        .sort((a, b) => b.nights - a.nights); // Sort by nights in descending order

    return chartData;
}

// Function to initialize the property bar chart
export function initPropertyChart(chartData) {    const options = {
        element: 'property_chart',
        data: chartData,
        xkey: 'property',
        ykeys: ['nights'],
        labels: ['Nights'],
        barColors: ['#2e7ce4'],
        barSizeRatio: 0.6,
        hideHover: 'auto',
        gridLineColor: '#eef0f2',
        resize: true,
        xLabelAngle: 0,
        parseTime: false,
        padding: 10,
        yLabelFormat: function(y) { return Math.round(y); },
        xLabelFormat: function(x) { 
            // Abbreviate 'Randwick' to 'Rand.' if it's too long
            console.log(x.label);
            if ((x.label).length > 10) {
                return x.label.replace('Randwick', 'Rand.');
            
                   
            }else {
                return x.label;
            }
            // return String(x).replace('Randwick', 'Rand.');
        }
    };

    Morris.Bar(options);

    // Find the most utilized property
    const maxEntry = chartData.reduce((max, current) => 
        current.nights > max.nights ? current : max
    , chartData[0]);
    
    // Update the text in the card
    const propertySpan = document.querySelector('.card:nth-child(3) p span');
    if (propertySpan && maxEntry) {
        propertySpan.textContent = `${maxEntry.property} (${maxEntry.nights} nights)`;
    }
}
// The property chart ends here

// The occupancy fee chart starts here
// Function to calculate total occupancy fees by property
export function calculateOccupancyFeeByProperty(data) {
    const propertyMap = new Map();
    
    data.forEach(row => {
        let property = row['Property of STA'] || 'Unknown';
        property = property.trim();
        
        let fee = row['Total occupance fee'] || 0;
        // Convert fee to number if it's a string (removing currency symbols and commas)
        fee = typeof fee === 'string' ? parseFloat(fee.replace(/[^0-9.-]+/g, '')) : Number(fee) || 0;
        
        if (!propertyMap.has(property)) {
            propertyMap.set(property, fee);
        } else {
            propertyMap.set(property, propertyMap.get(property) + fee);
        }
    });

    // Convert map to array of objects for Morris Chart
    const chartData = Array.from(propertyMap)
        .map(([property, fee]) => ({
            property,
            fee
        }))
        .sort((a, b) => b.fee - a.fee); // Sort by fee in descending order

    return chartData;
}

// Function to initialize the occupancy fee bar chart
export function initOccupancyFeeChart(chartData) {
    const formatter = new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
    });

    const options = {
        element: 'occupancy_fee_chart',
        data: chartData,
        xkey: 'property',
        ykeys: ['fee'],
        labels: ['Total Occupancy Fee'],
        barColors: ['#00c2b2'],
        barSizeRatio: 0.6,
        hideHover: 'auto',
        gridLineColor: '#eef0f2',
        resize: true,
        xLabelAngle: 0,
        parseTime: false,
        padding: 10,
        yLabelFormat: function(y) { return formatter.format(y); },
        xLabelFormat: function(x) {
            if ((x.label).length > 10) {
                return x.label.replace('Randwick', 'Rand.');
            }
            return x.label;
        }
    };

    Morris.Bar(options);

    // Calculate and display the total occupancy fees
    const totalFees = chartData.reduce((sum, item) => sum + item.fee, 0);
    const totalFeesSpan = document.getElementById('totalOccupancyFees');
    if (totalFeesSpan) {
        totalFeesSpan.textContent = formatter.format(totalFees);
    }

    // Find the property with highest occupancy fee
    const maxEntry = chartData.reduce((max, current) => 
        current.fee > max.fee ? current : max
    , chartData[0]);
    
    // Update the text in the card
    const feeSpan = document.querySelector('.card:nth-child(4) p span');
    if (feeSpan && maxEntry) {
        feeSpan.textContent = `${maxEntry.property} (${formatter.format(maxEntry.fee)})`;
    }
}
// The occupancy fee chart ends here

// The presenting issues chart starts here
// Function to calculate nights by presenting issues
export function calculatePresentingIssuesDistribution(data) {
    const issuesMap = new Map();
    
    data.forEach(row => {
        let issues = row['Presenting Issues'] || 'Unknown';
        issues = issues.trim();
        
        const nights = row['_x0023_ of nights accommodated'] ? 
            Number(row['_x0023_ of nights accommodated']) : 0;
        
        if (!issuesMap.has(issues)) {
            issuesMap.set(issues, nights);
        } else {
            issuesMap.set(issues, issuesMap.get(issues) + nights);
        }
    });

    // Convert map to array of objects for Morris Chart
    const chartData = Array.from(issuesMap)
        .map(([issue, nights]) => ({
            issue,
            nights
        }))
        .sort((a, b) => b.nights - a.nights); // Sort by nights in descending order

    return chartData;
}

// Function to initialize the presenting issues bar chart
export function initPresentingIssuesChart(chartData) {
    const options = {
        element: 'presenting_issues_chart',
        data: chartData,
        xkey: 'issue',
        ykeys: ['nights'],
        labels: ['Nights'],
        barColors: ['#f3b600'], // Using a gold/amber color
        barSizeRatio: 0.6,
        hideHover: 'auto',
        gridLineColor: '#eef0f2',
        resize: true,
        xLabelAngle: 45, // Angling the labels for better readability
        parseTime: false,
        padding: 10,
        yLabelFormat: function(y) { return Math.round(y); }
    };

    Morris.Bar(options);

    // Find the issue with highest nights
    const maxEntry = chartData.reduce((max, current) => 
        current.nights > max.nights ? current : max
    , chartData[0]);
    
    // Update the text in the card
    const issuesSpan = document.querySelector('.card:nth-child(5) p span');
    if (issuesSpan && maxEntry) {
        issuesSpan.textContent = `${maxEntry.issue} (${maxEntry.nights} nights)`;
    }
}
// The presenting issues chart ends here

// The exit barriers chart starts here
// Function to calculate nights by exit barriers
export function calculateExitBarriersDistribution(data) {
    const barriersMap = new Map();
    
    data.forEach(row => {
        let barriers = row['Exit Barriers'] || 'N/A';
        barriers = barriers.trim();
        
        const nights = row['_x0023_ of nights accommodated'] ? 
            Number(row['_x0023_ of nights accommodated']) : 0;
        
        if (!barriersMap.has(barriers)) {
            barriersMap.set(barriers, nights);
        } else {
            barriersMap.set(barriers, barriersMap.get(barriers) + nights);
        }
    });

    // Convert map to array of objects for Morris Chart
    const chartData = Array.from(barriersMap)
        .map(([barrier, nights]) => ({
            barrier,
            nights
        }))
        .sort((a, b) => b.nights - a.nights); // Sort by nights in descending order

    return chartData;
}

// Function to initialize the exit barriers bar chart
export function initExitBarriersChart(chartData) {
    const options = {
        element: 'exit_barriers_chart',
        data: chartData,
        xkey: 'barrier',
        ykeys: ['nights'],
        labels: ['Nights'],
        barColors: ['#df3554'], // Using a red color to differentiate
        barSizeRatio: 0.6,
        hideHover: 'auto',
        gridLineColor: '#eef0f2',
        resize: true,
        xLabelAngle: 45, // Angling the labels for better readability
        parseTime: false,
        padding: 10,
        yLabelFormat: function(y) { return Math.round(y); }
    };

    Morris.Bar(options);

    // Find the barrier with highest nights
    const maxEntry = chartData.reduce((max, current) => 
        current.nights > max.nights ? current : max
    , chartData[0]);
    
    // Update the text in the card
    const barriersSpan = document.querySelector('.card:nth-child(6) p span');
    if (barriersSpan && maxEntry) {
        barriersSpan.textContent = `${maxEntry.barrier} (${maxEntry.nights} nights)`;
    }
}
// The exit barriers chart ends here

// The homelessness history chart starts here
// Function to calculate occupancy fees by homelessness history
export function calculateHomelessnessHistory(data) {
    const historyMap = new Map();
    
    data.forEach(row => {
        let history = row['Been homeless in the last 2 years'] || 'Not Specified';
        history = history.trim();
        
        let fee = row['Total occupance fee'] || 0;
        // Convert fee to number if it's a string (removing currency symbols and commas)
        fee = typeof fee === 'string' ? parseFloat(fee.replace(/[^0-9.-]+/g, '')) : Number(fee) || 0;
        
        if (!historyMap.has(history)) {
            historyMap.set(history, fee);
        } else {
            historyMap.set(history, historyMap.get(history) + fee);
        }
    });

    // Convert map to array of objects for Morris Chart
    const chartData = Array.from(historyMap)
        .map(([label, value]) => ({
            label,
            value
        }))
        .sort((a, b) => b.value - a.value); // Sort by fee in descending order

    return chartData;
}

// Function to initialize the homelessness history donut chart
export function initHomelessnessHistoryChart(chartData) {
    const formatter = new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
    });

    const options = {
        element: 'homelessness_history_chart',
        data: chartData,
        colors: ["#f76707", "#df3554", "#eef0f2"], // Orange for Yes, Red for No, Gray for Not Specified
        formatter: function (y, data) {
            return data.label + ': ' + formatter.format(y);
        }
    };

    Morris.Donut(options);

    // Calculate total fees
    const totalFees = chartData.reduce((sum, item) => sum + item.value, 0);
    
    // Find the entry with highest fees
    const maxEntry = chartData.reduce((max, current) => 
        current.value > max.value ? current : max
    , chartData[0]);
    
    // Update the text in the card
    const historySpan = document.querySelector('.card:nth-child(7) p');
    if (historySpan && maxEntry) {
        const percentage = ((maxEntry.value / totalFees) * 100).toFixed(1);
        historySpan.textContent = `Distribution of occupancy fees by homelessness history in the last 2 years. ${maxEntry.label} accounts for ${percentage}% (${formatter.format(maxEntry.value)})`;
    }
}
// The homelessness history chart ends here

// The homelessness referrals chart starts here
// Function to calculate number of people by homelessness history
export function calculateHomelessnessReferrals(data) {
    const historyMap = new Map();
    
    data.forEach(row => {
        let history = row['Been homeless in the last 2 years'] || 'Not Specified';
        history = history.trim();
        let rawPeopleReferred = row['_x0023_ of people referred'];
        let numberOfPeople = 0;
        if (rawPeopleReferred) {
            if (typeof rawPeopleReferred === 'string') {
                numberOfPeople = parseFloat(rawPeopleReferred.replace(/[^\d.]/g, '')) || 0;
            } else {
                numberOfPeople = Number(rawPeopleReferred) || 0;
            }
        }
        
        // Count each person once
        if (!historyMap.has(history)) {
            historyMap.set(history, numberOfPeople);
        } else {
            historyMap.set(history, historyMap.get(history) + numberOfPeople);
        }
    });

    // Convert map to array of objects for Morris Chart
    const chartData = Array.from(historyMap)
        .map(([label, value]) => ({
            label,
            value
        }))
        .sort((a, b) => b.value - a.value); // Sort by number of people in descending order

    return chartData;
}

// Function to initialize the homelessness referrals donut chart
export function initHomelessnessReferralsChart(chartData) {
    const options = {
        element: 'homelessness_referrals_chart',
        data: chartData,
        colors: ["#f76707", "#df3554", "#eef0f2"], // Orange for Yes, Red for No, Gray for Not Specified
        formatter: function (y, data) {
            return data.label + ': ' + y + ' people';
        }
    };

    Morris.Donut(options);

    // Calculate total number of people
    const totalPeople = chartData.reduce((sum, item) => sum + item.value, 0);
    
    // Find the entry with highest count
    const maxEntry = chartData.reduce((max, current) => 
        current.value > max.value ? current : max
    , chartData[0]);
    
    // Update the text in the card
    const referralsSpan = document.querySelector('.card:nth-child(8) p');
    if (referralsSpan && maxEntry) {
        const percentage = ((maxEntry.value / totalPeople) * 100).toFixed(1);
        referralsSpan.textContent = `Distribution of number of people referred by homelessness history in the last 2 years. ${maxEntry.label} accounts for ${percentage}% (${maxEntry.value} people)`;
    }
}
// The homelessness referrals chart ends here

// The tenancy facilitation chart starts here
// Function to calculate number of people by tenancy facilitation status
export function calculateTenancyFacilitation(data) {
    const facilMap = new Map();
    
    data.forEach(row => {
        let facilitation = row['Tenancy Facilitation provided'] || 'Not Specified';
        facilitation = facilitation.trim();
        let rawPeopleReferred = row['_x0023_ of people referred'];
        let numberOfPeople = 0;
        if (rawPeopleReferred) {
            if (typeof rawPeopleReferred === 'string') {
                numberOfPeople = parseFloat(rawPeopleReferred.replace(/[^\d.]/g, '')) || 0;
            } else {
                numberOfPeople = Number(rawPeopleReferred) || 0;
            }
        }
        // Count each person once
        if (!facilMap.has(facilitation)) {
            facilMap.set(facilitation, numberOfPeople);
        } else {
            facilMap.set(facilitation, facilMap.get(facilitation) + numberOfPeople);
        }
    });

    // Convert map to array of objects for Morris Chart
    const chartData = Array.from(facilMap)
        .map(([label, value]) => ({
            label,
            value
        }))
        .sort((a, b) => b.value - a.value); // Sort by number of people in descending order

    return chartData;
}

// Function to initialize the tenancy facilitation donut chart
export function initTenancyFacilitationChart(chartData) {
    const options = {
        element: 'tenancy_facilitation_chart',
        data: chartData,
        colors: ["#f76707", "#eef0f2", "#df3554"], // Orange for Yes, Gray for Not Specified, Red for No
        formatter: function (y, data) {
            return data.label + ': ' + y + ' people';
        }
    };

    Morris.Donut(options);

    // Calculate total number of people
    const totalPeople = chartData.reduce((sum, item) => sum + item.value, 0);
    
    // Find the entry with highest count
    const maxEntry = chartData.reduce((max, current) => 
        current.value > max.value ? current : max
    , chartData[0]);
    
    // Update the text in the card
    const facilSpan = document.querySelector('.card:nth-child(9) p');
    if (facilSpan && maxEntry) {
        const percentage = ((maxEntry.value / totalPeople) * 100).toFixed(1);
        facilSpan.textContent = `Distribution of people referred by tenancy facilitation provided. ${maxEntry.label} accounts for ${percentage}% (${maxEntry.value} people)`;
    }
}
// The tenancy facilitation chart ends here

// Client Engagement Chart functions starts here
export function calculateClientEngagement(data) {
    const engagementMap = new Map();
    
    data.forEach((row) => {
        // Get the raw values first
        const rawEngaging = row['Client engaging'];
        const rawPeopleReferred = row['_x0023_ of people referred'];
        
        // Clean and convert the values
        const isEngaging = rawEngaging || 'N/A';
        // Try parsing the number, accounting for possible string formats
        let numberOfPeople = 0;
        if (rawPeopleReferred) {
            if (typeof rawPeopleReferred === 'string') {
                // Remove any non-numeric characters except decimal point
                const cleaned = rawPeopleReferred.replace(/[^\d.]/g, '');
                numberOfPeople = parseFloat(cleaned) || 0;
            } else {
                numberOfPeople = Number(rawPeopleReferred) || 0;
            }
        }
        
        if (!engagementMap.has(isEngaging)) {
            engagementMap.set(isEngaging, numberOfPeople);
        } else {
            const currentTotal = engagementMap.get(isEngaging);
            const newTotal = currentTotal + numberOfPeople;
            engagementMap.set(isEngaging, newTotal);
        }
    });

    // Convert map to array of objects for Morris Chart
    const chartData = Array.from(engagementMap)
        .map(([label, value]) => ({
            label,
            value: Math.round(value) // Ensure whole numbers
        }))
        .filter(item => item.value > 0); // Only include non-zero values

    return chartData;
}

export function initClientEngagementChart(chartData) {
    const options = {
        element: 'client_engagement_chart',
        data: chartData,
        colors: ["#2e7ce4", "#df3554", "#f3b600"],
        formatter: function (y, data) {
            const total = chartData.reduce((sum, item) => sum + item.value, 0);
            const percentage = ((y / total) * 100).toFixed(1);
            return `${data.label}: ${percentage}% (${y} referred people)`;
        }
    };

    Morris.Donut(options);

    // Find the predominant response and update the text
    const maxEntry = chartData.reduce((max, current) => 
        current.value > max.value ? current : max
    , chartData[0]);
    
    // Update the text in the card
    const engagementSpan = document.querySelector('#clientEngagementSummary');
    if (engagementSpan) {
        const total = chartData.reduce((sum, item) => sum + item.value, 0);
        const percentage = ((maxEntry.value / total) * 100).toFixed(1);
        engagementSpan.textContent = `${maxEntry.label} (${percentage}% - ${maxEntry.value} referred people)`;
    }
}
// Client Engagement Chart functions ends here

// Payment Type Distribution Chart functions starts here
export function calculatePaymentTypeDistribution(data) {
    const paymentMap = new Map();
    
    data.forEach((row) => {
        // Get prepaid and postpaid fees per night
        let prepaidFeePerNight = row['Occupancy Fee per night (Prepaid)'] || 0;
        let postpaidFeePerNight = row['Occupancy Fee per night (Postpaid)'] || 0;
        let nights = row['_x0023_ of nights accommodated'] || 0;
        
        // Convert values to numbers if they're strings
        if (typeof prepaidFeePerNight === 'string') {
            prepaidFeePerNight = parseFloat(prepaidFeePerNight.replace(/[^\d.]/g, '')) || 0;
        }
        if (typeof postpaidFeePerNight === 'string') {
            postpaidFeePerNight = parseFloat(postpaidFeePerNight.replace(/[^\d.]/g, '')) || 0;
        }
        if (typeof nights === 'string') {
            nights = parseFloat(nights.replace(/[^\d.]/g, '')) || 0;
        }
        
        // Calculate total fees by multiplying per-night fee with number of nights
        const totalPrepaidFee = prepaidFeePerNight * nights;
        const totalPostpaidFee = postpaidFeePerNight * nights;
        
        // Add to respective totals
        if (!paymentMap.has('Prepaid')) {
            paymentMap.set('Prepaid', totalPrepaidFee);
        } else {
            paymentMap.set('Prepaid', paymentMap.get('Prepaid') + totalPrepaidFee);
        }
        
        if (!paymentMap.has('Postpaid')) {
            paymentMap.set('Postpaid', totalPostpaidFee);
        } else {
            paymentMap.set('Postpaid', paymentMap.get('Postpaid') + totalPostpaidFee);
        }
    });

    // Convert map to array of objects for Morris Chart
    const chartData = Array.from(paymentMap)
        .map(([label, value]) => ({
            label,
            value: Math.round(value) // Ensure whole numbers
        }))
        .filter(item => item.value > 0); // Only include non-zero values

    return chartData;
}

export function initPaymentTypeChart(chartData) {
    const formatter = new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
    });

    const options = {
        element: 'payment_type_chart',
        data: chartData,
        colors: ["#2e7ce4", "#df3554"], // Blue for Prepaid, Red for Postpaid
        formatter: function (y, data) {
            const total = chartData.reduce((sum, item) => sum + item.value, 0);
            const percentage = ((y / total) * 100).toFixed(1);
            return `${data.label}: ${percentage}% (${formatter.format(y)})`;
        }
    };

    Morris.Donut(options);

    // Find the predominant payment type and update the text
    const maxEntry = chartData.reduce((max, current) => 
        current.value > max.value ? current : max
    , chartData[0]);
    
    // Update the text in the card
    const paymentSpan = document.querySelector('#paymentTypeSummary');
    if (paymentSpan) {
        const total = chartData.reduce((sum, item) => sum + item.value, 0);
        const percentage = ((maxEntry.value / total) * 100).toFixed(1);
        paymentSpan.textContent = `${maxEntry.label} (${percentage}% - ${formatter.format(maxEntry.value)})`;
    }
}
// Payment Type Distribution Chart functions ends here

// Exit Status Distribution Chart functions starts here
export function calculateExitStatusDistribution(data) {
    const exitMap = new Map();
    
    data.forEach((row) => {
        const exitStatus = row['Exit Status'] || 'Not Specified';
        const numberOfPeople = Number(row['_x0023_ of people referred']) || 0;
        
        if (!exitMap.has(exitStatus)) {
            exitMap.set(exitStatus, numberOfPeople);
        } else {
            exitMap.set(exitStatus, exitMap.get(exitStatus) + numberOfPeople);
        }
    });

    // Convert map to array of objects for Morris Chart
    const chartData = Array.from(exitMap)
        .map(([label, value]) => ({
            label,
            value: Math.round(value) // Ensure whole numbers
        }))
        .filter(item => item.value > 0); // Only include non-zero values

    return chartData;
}

export function initExitStatusChart(chartData) {
    const options = {
        element: 'exit_status_chart',
        data: chartData,
        xkey: 'label',
        ykeys: ['value'],
        labels: ['Number of People'],
        barColors: ['#2e7ce4'],
        hideHover: 'auto',
        gridLineColor: '#eef0f2',
        resize: true,
        xLabelAngle: 45,
        parseTime: false,
        padding: 10,
        yLabelFormat: function(y) { return Math.round(y); }
    };

    Morris.Bar(options);

    // Find the predominant status and update the text
    const maxEntry = chartData.reduce((max, current) => 
        current.value > max.value ? current : max
    , chartData[0]);
    
    // Update the text in the card
    const exitStatusSpan = document.querySelector('#exitStatusSummary');
    if (exitStatusSpan) {
        const total = chartData.reduce((sum, item) => sum + item.value, 0);
        const percentage = ((maxEntry.value / total) * 100).toFixed(1);
        exitStatusSpan.textContent = `${maxEntry.label} (${percentage}% - ${maxEntry.value} people)`;
    }
}
// Exit Status Distribution Chart functions ends here
