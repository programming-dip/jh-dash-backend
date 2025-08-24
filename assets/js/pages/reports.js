import { CONFIG } from '../config.js';
import { getSecureCredentials } from '../utils/auth.utils.js';

// Import calculation functions from charts.js
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
    calculateExitStatusDistribution
} from './charts.js';

// Import dashboard services for metrics
import {
    calculateTotalRevenue,
    calcuLateTotalClients,
    calculateTotalNightsAccommodated,
    averageCostPerNight
} from '../services/dashboardServices.js';

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
        console.log('Data fetched from Power Apps:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to update executive summary metrics
function updateExecutiveSummary(data) {
    if (!data || data.length === 0) return;

    const totalClients = calcuLateTotalClients(data);
    const totalRevenue = calculateTotalRevenue(data);
    const totalNights = calculateTotalNightsAccommodated(data);
    const avgCost = averageCostPerNight(data);

    // Update summary metrics
    document.getElementById('summary-clients').textContent = totalClients.toLocaleString();
    document.getElementById('summary-revenue').textContent = `$${totalRevenue.toLocaleString()}`;
    document.getElementById('summary-nights').textContent = totalNights.toLocaleString();
    document.getElementById('summary-avg-cost').textContent = `$${avgCost.toLocaleString()}`;

    // Update report date
    const reportDate = document.getElementById('reportDate');
    if (reportDate) {
        reportDate.textContent = `Report Generated: ${new Date().toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }

    // Update current year in footer
    const currentYear = document.getElementById('currentYear');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

// Function to create CanvasJS pie charts
function createCanvasJSPieChart(elementId, data, title, valueType) {
    const element = document.getElementById(elementId);
    if (!element || !data || data.length === 0) return;

    // Clear existing content
    element.innerHTML = '';

    // Create chart container with proper sizing
    const chartContainer = document.createElement('div');
    chartContainer.id = `${elementId}-container`;
    chartContainer.style.height = '450px'; // Fixed height for CanvasJS
    chartContainer.style.width = '100%';
    chartContainer.style.marginBottom = '20px';
    element.appendChild(chartContainer);

    // Calculate percentages for pie chart
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const dataPoints = data.map(item => ({
        y: valueType === 'currency' ? item.value : item.value,
        label: item.label,
        percentage: ((item.value / total) * 100).toFixed(1)
    }));

    // Create CanvasJS chart
    const chart = new CanvasJS.Chart(chartContainer.id, {
        theme: "light2",
        exportEnabled: false,
        animationEnabled: true,
        title: {
            text: title,
            fontSize: 18,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            fontColor: "#1B0D48"
        },
        legend: {
            verticalAlign: "bottom",
            horizontalAlign: "center",
            fontSize: 12,
            fontFamily: "Arial, sans-serif"
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: valueType === 'currency' 
                ? "<b>{label}</b>: ${y}" 
                : "<b>{label}</b>: {y}",
            showInLegend: true,
            legendText: "{label}",
            indexLabelFontSize: 14,
            indexLabelFontFamily: "Arial, sans-serif",
            indexLabelFontColor: "#1B0D48",
            indexLabel: valueType === 'currency' 
                ? "{label} - ${y}" 
                : "{label} - {y}",
            dataPoints: dataPoints
        }]
    });

    // Render the chart
    chart.render();

    // Add enhanced data table below the chart
    const tableContainer = document.createElement('div');
    tableContainer.style.marginTop = '20px';
    tableContainer.style.backgroundColor = '#f8fafc';
    tableContainer.style.borderRadius = '8px';
    tableContainer.style.padding = '16px';
    tableContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const header1 = document.createElement('th');
    header1.textContent = 'Category';
    header1.style.textAlign = 'left';
    header1.style.padding = '12px';
    header1.style.borderBottom = '2px solid #1B0D48';
    header1.style.color = '#ffffff';
    header1.style.backgroundColor = '#1B0D48';
    header1.style.fontWeight = '600';
    header1.style.fontSize = '14px';

    const header2 = document.createElement('th');
    header2.textContent = 'Value';
    header2.style.textAlign = 'right';
    header2.style.padding = '12px';
    header2.style.borderBottom = '2px solid #1B0D48';
    header2.style.color = '#ffffff';
    header2.style.backgroundColor = '#1B0D48';
    header2.style.fontWeight = '600';
    header2.style.fontSize = '14px';

    const header3 = document.createElement('th');
    header3.textContent = 'Percentage';
    header3.style.textAlign = 'right';
    header3.style.padding = '12px';
    header3.style.borderBottom = '2px solid #1B0D48';
    header3.style.color = '#ffffff';
    header3.style.backgroundColor = '#1B0D48';
    header3.style.fontWeight = '600';
    header3.style.fontSize = '14px';

    headerRow.appendChild(header1);
    headerRow.appendChild(header2);
    headerRow.appendChild(header3);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    
    dataPoints.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';

        const cell1 = document.createElement('td');
        cell1.textContent = item.label;
        cell1.style.padding = '12px';
        cell1.style.borderBottom = '1px solid #e5e7eb';
        cell1.style.color = '#374151';
        cell1.style.fontWeight = '500';

        const cell2 = document.createElement('td');
        cell2.style.textAlign = 'right';
        cell2.style.padding = '12px';
        cell2.style.borderBottom = '1px solid #e5e7eb';
        cell2.style.fontWeight = '600';
        cell2.style.color = '#1B0D48';

        if (valueType === 'currency') {
            cell2.textContent = new Intl.NumberFormat('en-AU', {
                style: 'currency',
                currency: 'AUD'
            }).format(item.y);
        } else {
            cell2.textContent = item.y.toLocaleString();
        }

        const cell3 = document.createElement('td');
        cell3.style.textAlign = 'right';
        cell3.style.padding = '12px';
        cell3.style.borderBottom = '1px solid #e5e7eb';
        cell3.style.fontWeight = '600';
        cell3.style.color = '#00c2b2';
        cell3.textContent = `${item.percentage}%`;

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    element.appendChild(tableContainer);
}

// Function to create enhanced bar charts with visible labels and percentage column
function createBarChart(elementId, data, title, xKey, yKey, valueType) {
    const element = document.getElementById(elementId);
    if (!element || !data || data.length === 0) return;

    // Clear existing content
    element.innerHTML = '';

    // Create chart container with proper sizing
    const chartContainer = document.createElement('div');
    chartContainer.style.position = 'relative';
    chartContainer.style.height = '350px'; // Fixed height for Morris.js
    chartContainer.style.marginBottom = '20px';
    element.appendChild(chartContainer);

    // Create Morris Bar Chart
    const options = {
        element: chartContainer,
        data: data,
        xkey: xKey,
        ykeys: [yKey],
        labels: [title],
        barColors: ['#2e7ce4'],
        barSizeRatio: 0.6,
        hideHover: true,
        gridLineColor: '#eef0f2',
        resize: true,
        xLabelAngle: 45,
        parseTime: false,
        padding: 10,
        yLabelFormat: function(y) { 
            if (valueType === 'currency') {
                return new Intl.NumberFormat('en-AU', {
                    style: 'currency',
                    currency: 'AUD'
                }).format(y);
            }
            return Math.round(y).toLocaleString();
        }
    };

    // Create the chart
    const chart = Morris.Bar(options);

    // Add enhanced data table below the chart with percentage column
    const tableContainer = document.createElement('div');
    tableContainer.style.marginTop = '20px';
    tableContainer.style.backgroundColor = '#f8fafc';
    tableContainer.style.borderRadius = '8px';
    tableContainer.style.padding = '16px';
    tableContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    // Create table header with percentage column
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const header1 = document.createElement('th');
    header1.textContent = 'Category';
    header1.style.textAlign = 'left';
    header1.style.padding = '12px';
    header1.style.borderBottom = '2px solid #1B0D48';
    header1.style.color = '#ffffff';
    header1.style.backgroundColor = '#1B0D48';
    header1.style.fontWeight = '600';
    header1.style.fontSize = '14px';

    const header2 = document.createElement('th');
    header2.textContent = 'Value';
    header2.style.textAlign = 'right';
    header2.style.padding = '12px';
    header2.style.borderBottom = '2px solid #1B0D48';
    header2.style.color = '#ffffff';
    header2.style.backgroundColor = '#1B0D48';
    header2.style.fontWeight = '600';
    header2.style.fontSize = '14px';

    const header3 = document.createElement('th');
    header3.textContent = 'Percentage';
    header3.style.textAlign = 'right';
    header3.style.padding = '12px';
    header3.style.borderBottom = '2px solid #1B0D48';
    header3.style.color = '#ffffff';
    header3.style.backgroundColor = '#1B0D48';
    header3.style.fontWeight = '600';
    header3.style.fontSize = '14px';

    headerRow.appendChild(header1);
    headerRow.appendChild(header2);
    headerRow.appendChild(header3);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body with percentage calculations
    const tbody = document.createElement('tbody');
    
    // Calculate total for percentage calculations
    const total = data.reduce((sum, item) => {
        const value = item[yKey];
        return sum + (typeof value === 'number' && !isNaN(value) ? value : 0);
    }, 0);
    
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';

        const cell1 = document.createElement('td');
        cell1.textContent = item[xKey] || 'Unknown';
        cell1.style.padding = '12px';
        cell1.style.borderBottom = '1px solid #e5e7eb';
        cell1.style.color = '#374151';
        cell1.style.fontWeight = '500';

        const cell2 = document.createElement('td');
        cell2.style.textAlign = 'right';
        cell2.style.padding = '12px';
        cell2.style.borderBottom = '1px solid #e5e7eb';
        cell2.style.fontWeight = '600';
        cell2.style.color = '#1B0D48';

        // Safely handle the value
        const value = item[yKey];
        if (valueType === 'currency') {
            if (typeof value === 'number' && !isNaN(value)) {
                cell2.textContent = new Intl.NumberFormat('en-AU', {
                    style: 'currency',
                    currency: 'AUD'
                }).format(value);
            } else {
                cell2.textContent = '$0.00';
            }
        } else {
            if (typeof value === 'number' && !isNaN(value)) {
                cell2.textContent = value.toLocaleString();
            } else {
                cell2.textContent = '0';
            }
        }

        const cell3 = document.createElement('td');
        cell3.style.textAlign = 'right';
        cell3.style.padding = '12px';
        cell3.style.borderBottom = '1px solid #e5e7eb';
        cell3.style.fontWeight = '600';
        cell3.style.color = '#00c2b2';

        // Calculate and display percentage
        if (typeof value === 'number' && !isNaN(value) && total > 0) {
            const percentage = ((value / total) * 100).toFixed(1);
            cell3.textContent = `${percentage}%`;
        } else {
            cell3.textContent = '0.0%';
        }

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    element.appendChild(tableContainer);
}

// Function to create enhanced charts with visible labels
function createEnhancedCharts(data) {
    if (!data || data.length === 0) return;

    try {
        // Income Type Distribution Chart - CanvasJS Pie Chart
        const incomeData = calculateIncomeTypeDistribution(data);
        if (incomeData && incomeData.length > 0) {
            createCanvasJSPieChart('report-income-chart', incomeData, 'Income Type Distribution', 'currency');
        }

        // Gender Distribution Chart - CanvasJS Pie Chart
        const genderData = calculateGenderDistribution(data);
        if (genderData && genderData.length > 0) {
            createCanvasJSPieChart('report-gender-chart', genderData, 'Gender Distribution', 'count');
        }

        // Property Performance Charts - Morris Bar Charts
        const propertyData = calculatePropertyDistribution(data);
        if (propertyData && propertyData.length > 0) {
            createBarChart('report-property-chart', propertyData, 'Nights by Property', 'property', 'nights', 'count');
        }

        // FIXED: Revenue by Property - use 'fee' instead of 'fees'
        const occupancyFeeData = calculateOccupancyFeeByProperty(data);
        if (occupancyFeeData && occupancyFeeData.length > 0) {
            createBarChart('report-occupancy-fee-chart', occupancyFeeData, 'Revenue by Property', 'property', 'fee', 'currency');
        }

        // Client Issues Analysis - Morris Bar Charts
        const presentingIssuesData = calculatePresentingIssuesDistribution(data);
        if (presentingIssuesData && presentingIssuesData.length > 0) {
            createBarChart('report-presenting-issues-chart', presentingIssuesData, 'Presenting Issues', 'issue', 'nights', 'count');
        }

        const exitBarriersData = calculateExitBarriersDistribution(data);
        if (exitBarriersData && exitBarriersData.length > 0) {
            createBarChart('report-exit-barriers-chart', exitBarriersData, 'Exit Barriers', 'barrier', 'nights', 'count');
        }

        // Homelessness Analysis - CanvasJS Pie Charts (FIXED)
        const homelessnessHistoryData = calculateHomelessnessHistory(data);
        if (homelessnessHistoryData && homelessnessHistoryData.length > 0) {
            createCanvasJSPieChart('report-homelessness-chart', homelessnessHistoryData, 'Homelessness History (Fees)', 'currency');
        }

        const homelessnessReferralsData = calculateHomelessnessReferrals(data);
        if (homelessnessReferralsData && homelessnessReferralsData.length > 0) {
            createCanvasJSPieChart('report-homelessness-referrals-chart', homelessnessReferralsData, 'Homelessness History (Referrals)', 'count');
        }

        // Service Provision Analysis - Morris Bar Charts
        const tenancyData = calculateTenancyFacilitation(data);
        if (tenancyData && tenancyData.length > 0) {
            createBarChart('report-tenancy-chart', tenancyData, 'Tenancy Facilitation', 'label', 'value');
        }

        const engagementData = calculateClientEngagement(data);
        if (engagementData && engagementData.length > 0) {
            createBarChart('report-engagement-chart', engagementData, 'Client Engagement', 'label', 'value');
        }

        // Financial Analysis - CanvasJS Pie Chart
        const paymentData = calculatePaymentTypeDistribution(data);
        if (paymentData && paymentData.length > 0) {
            createCanvasJSPieChart('report-payment-chart', paymentData, 'Payment Type Distribution', 'currency');
        }

        // Exit Status - Morris Bar Chart
        const exitStatusData = calculateExitStatusDistribution(data);
        if (exitStatusData && exitStatusData.length > 0) {
            createBarChart('report-exit-status-chart', exitStatusData, 'Exit Status', 'label', 'value', 'count');
        }

    } catch (error) {
        console.error('Error creating charts:', error);
        // Fallback to sample data if there's an error
        console.log('Falling back to sample data due to error');
        const sampleData = generateSampleData();
        createEnhancedCharts(sampleData);
    }
}


// Function to generate PDF report (seamless page breaks)
async function generatePDFReport() {
    const pdfButton = document.getElementById('generatePdfBtn');
    const originalText = pdfButton.textContent;
  
    try {
      // Show loading state
      pdfButton.textContent = '📄 Generating PDF...';
      pdfButton.disabled = true;
      pdfButton.style.opacity = '0.7';
  
      // Wait for charts to finish rendering
      await new Promise((r) => setTimeout(r, 2000));
  
      // Get the report container
      const reportContainer = document.getElementById('reportContainer');
  
      // Hide the button so it doesn't appear in the capture
      const prevDisplay = pdfButton.style.display;
      pdfButton.style.display = 'none';
      // Ensure layout reflow before capture
      await new Promise(requestAnimationFrame);
  
      // Capture with html2canvas
      const canvas = await html2canvas(reportContainer, {
        scale: Math.min(3, window.devicePixelRatio || 2),
        useCORS: true,
        backgroundColor: '#ffffff',
        width: reportContainer.scrollWidth,
        height: reportContainer.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: reportContainer.scrollWidth,
        windowHeight: reportContainer.scrollHeight
      });
  
      // Restore button visibility after capture
      pdfButton.style.display = prevDisplay || 'block';
  
      // Create PDF (A4, portrait)
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
  
      // PDF page size (mm)
      const pageWidthMM = pdf.internal.pageSize.getWidth();   // ~210
      const pageHeightMM = pdf.internal.pageSize.getHeight(); // ~297
  
      // We will draw each slice at full page width
      const imgWidthMM = pageWidthMM;
  
      // ---- Map one PDF page height (mm) to canvas pixels ----
      // When drawn at full width, mm-per-pixel vertically = pageWidthMM / canvas.width.
      // So, the number of canvas pixels that fit into one PDF page height is:
      const pageHeightPx = Math.floor((pageHeightMM * canvas.width) / imgWidthMM);
  
      // Slice loop state
      let sY = 0;           // source Y on the big canvas (px)
      let pageIndex = 0;
  
      // Reusable offscreen canvas to hold each slice
      const sliceCanvas = document.createElement('canvas');
      const sliceCtx = sliceCanvas.getContext('2d');
  
      while (sY < canvas.height) {
        // Height of this slice in canvas pixels (last slice may be shorter)
        const sliceHeightPx = Math.min(pageHeightPx, canvas.height - sY);
  
        // Size slice canvas & blit pixels
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeightPx;
        sliceCtx.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        sliceCtx.drawImage(
          canvas,
          0, sY, canvas.width, sliceHeightPx,   // src rect (px)
          0, 0, canvas.width, sliceHeightPx     // dst rect (px)
        );
  
        // Convert this slice to PNG (avoid JPEG seam artifacts)
        const sliceDataUrl = sliceCanvas.toDataURL('image/png');
  
        // For page 2+, add a new page
        if (pageIndex > 0) pdf.addPage();
  
        // Height of this slice on PDF in mm (proportional scaling)
        const sliceHeightMM = (sliceHeightPx * imgWidthMM) / canvas.width;
  
        // Draw slice at (0,0) filling page width; height is scaled accordingly
        pdf.addImage(sliceDataUrl, 'PNG', 0, 0, imgWidthMM, sliceHeightMM);
  
        sY += sliceHeightPx;
        pageIndex += 1;
      }
  
      // Save the PDF
      const fileName = `JH-Monthly-Report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
  
      // Restore button state
      pdfButton.textContent = originalText;
      pdfButton.disabled = false;
      pdfButton.style.opacity = '1';
      pdfButton.style.display = 'block';
  
      // Notify success
      showNotification('PDF generated successfully!', 'success');
  
    } catch (error) {
      console.error('Error generating PDF:', error);
  
      // Restore button on error
      pdfButton.textContent = '📄 Generate PDF Report';
      pdfButton.disabled = false;
      pdfButton.style.opacity = '1';
      pdfButton.style.display = 'block';
  
      showNotification('Error generating PDF. Please try again.', 'error');
    }
  }
  

// Function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '80px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '6px';
    notification.style.color = 'white';
    notification.style.fontWeight = '600';
    notification.style.zIndex = '10000';
    notification.style.transition = 'all 0.3s ease';
    notification.style.transform = 'translateX(100%)';
    
    // Set colors based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else {
        notification.style.backgroundColor = '#3b82f6';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Main function to initialize the reports page
async function initializeReportsPage() {
    try {
        // Fetch data
        const data = await fetchData();
        
        if (data && data.length > 0) {
            console.log('Data loaded successfully, initializing reports page');
            
            // Update executive summary
            updateExecutiveSummary(data);
            
            // Create enhanced charts
            createEnhancedCharts(data);
            
        } else {
            console.log('No data available, using sample data');
            // Use sample data for demonstration
            const sampleData = generateSampleData();
            updateExecutiveSummary(sampleData);
            createEnhancedCharts(sampleData);
        }
    } catch (error) {
        console.error('Error initializing reports page:', error);
        // Fallback to sample data on error
        console.log('Falling back to sample data due to error');
        const sampleData = generateSampleData();
        updateExecutiveSummary(sampleData);
        createEnhancedCharts(sampleData);
    }
}

// Generate sample data for demonstration
function generateSampleData() {
    return [
        {
            'Income Type': 'Centrelink',
            'Total occupance fee': 15000,
            'Gender of all clients': 'M',
            'Property of STA': 'Property A',
            '_x0023_ of people referred': 25,
            '_x0023_ of nights accommodated': 150,
            'Presenting Issues': 'Mental Health',
            'Exit Barriers': 'Housing',
            'Homelessness History': 'Yes',
            'Tenancy Facilitation': 'Provided',
            'Client Engagement': 'Engaged',
            'Payment Type': 'Direct Debit',
            'Exit Status': 'Successful'
        },
        {
            'Income Type': 'Employment',
            'Total occupance fee': 12000,
            'Gender of all clients': 'F',
            'Property of STA': 'Property B',
            '_x0023_ of people referred': 20,
            '_x0023_ of nights accommodated': 120,
            'Presenting Issues': 'Domestic Violence',
            'Exit Barriers': 'Employment',
            'Homelessness History': 'No',
            'Tenancy Facilitation': 'Not Provided',
            'Client Engagement': 'Partially Engaged',
            'Payment Type': 'Cash',
            'Exit Status': 'In Progress'
        },
        {
            'Income Type': 'Disability Support',
            'Total occupance fee': 8000,
            'Gender of all clients': 'M',
            'Property of STA': 'Property C',
            '_x0023_ of people referred': 15,
            '_x0023_ of nights accommodated': 90,
            'Presenting Issues': 'Physical Disability',
            'Exit Barriers': 'Accessibility',
            'Homelessness History': 'Yes',
            'Tenancy Facilitation': 'Provided',
            'Client Engagement': 'Fully Engaged',
            'Payment Type': 'Bank Transfer',
            'Exit Status': 'Successful'
        }
    ];
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Reports page DOM ready, initializing...');
    initializeReportsPage();
    
    // Add click event listener to PDF button
    const pdfButton = document.getElementById('generatePdfBtn');
    if (pdfButton) {
        pdfButton.addEventListener('click', generatePDFReport);
    }
});

// Export functions for external use
window.initializeReportsPage = initializeReportsPage;
window.createEnhancedCharts = createEnhancedCharts;
window.generatePDFReport = generatePDFReport;