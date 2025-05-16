# Guide: Implementing Excel Data in Webpage

## 1. Modify the powerAPI.js Code

Add a function to calculate total revenue and update the webpage:

```javascript
async function fetchData() {
    const url = '...'; // your existing URL
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authCode: "ABC123XYZ"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Calculate total revenue
        const totalRevenue = calculateTotalRevenue(data);
        
        // Update webpage
        updateWebpage(totalRevenue);

    } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.message);
    }
}

function calculateTotalRevenue(data) {
    return data.reduce((total, row) => {
        // Convert string to number and remove currency symbols/commas
        const fee = row['Total occupance fee'] ? 
            Number(row['Total occupance fee'].replace(/[^0-9.-]+/g, '')) : 0;
        return total + fee;
    }, 0);
}

function updateWebpage(totalRevenue) {
    // Format the number as currency
    const formattedRevenue = new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
    }).format(totalRevenue);

    // Update the element
    const totalRevenueElement = document.getElementById('total-revenue');
    if (totalRevenueElement) {
        totalRevenueElement.textContent = formattedRevenue;
    }
}
```

## 2. Add HTML Element

Make sure you have this element in your HTML:

```html
<div id="total-revenue"></div>
```

## 3. How It Works

1. `fetchData()`: Your existing function that gets data from Power Apps

2. `calculateTotalRevenue(data)`:
   - Takes the array of rows
   - Uses reduce() to sum up all 'Total occupance fee' values
   - Handles string to number conversion
   - Removes currency symbols and commas

3. `updateWebpage(totalRevenue)`:
   - Formats the number as Australian currency
   - Updates the webpage element

## 4. Testing

1. Open your webpage
2. Check browser console for any errors
3. Verify that the total revenue appears in the correct element
4. Verify the calculation is correct

## 5. Common Issues to Watch For

1. Make sure the 'Total occupance fee' field name matches exactly what's in your data
2. Handle null/undefined values in the data
3. Check for proper currency formatting
4. Verify the HTML element exists before updating

## 6. Optional Enhancements

You could add:
- Loading indicators
- Error messages if the calculation fails
- Animation when the number updates
- Automatic refresh of the data
- Additional calculations (averages, counts, etc.)

## 7. Example CSS Styling

```css
#total-revenue {
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
    padding: 10px;
    border-radius: 5px;
    background-color: #f8f9fa;
    margin: 10px 0;
}
```

Follow this guide to implement the functionality, and let me know if you need any clarification!