# Rhode Island Targeted Dispatch - Dynamics 365 Integration Setup Guide

## Current Status ✅
Your integration files are ready! You have:
- ✅ `dynamics-server.js` - The proxy server for Dynamics 365
- ✅ `dynamics-pricing-integration.js` - The HTML addon
- ✅ `package.json` - Dependencies installed
- ✅ All npm packages installed

## Next Steps

### 1. Start the Proxy Server
```bash
npm start
# or
node dynamics-server.js
```

The server will start on http://localhost:3001

### 2. Test the Connection
```bash
npm run test-connection
# or
curl http://localhost:3001/api/test-connection
```

### 3. Find the Rhode Island Program GUID

**Option A: Use the search endpoint (recommended)**
```bash
npm run find-ri-program
# or
curl "http://localhost:3001/api/programs/search?name=Rhode%20Island%20Connected%20Solutions-Targeted%20Dispatch"
```

**Option B: Find manually in Dynamics 365**
1. Log into your Dynamics 365 environment
2. Go to Programs
3. Search for "Rhode Island Connected Solutions-Targeted Dispatch"
4. Open the record
5. Copy the GUID from the URL (it's after `/main.aspx?id=`)

### 4. Update the Program GUID

Once you have the GUID, update line 16 in `dynamics-pricing-integration.js`:
```javascript
'Rhode Island Connected Solutions-Targeted Dispatch': {
    id: 'YOUR-ACTUAL-GUID-HERE', // REPLACE THIS
    name: 'Rhode Island Connected Solutions-Targeted Dispatch'
}
```

### 5. Add Integration to Your HTML File

Add this script tag to your HTML pricing table file:
```html
<script src="dynamics-pricing-integration.js"></script>
```

**Important**: Add it AFTER your existing pricing table JavaScript code.

### 6. Create the Price Field in Dynamics 365

1. **Navigate to Program Entity**
   - Power Apps → Solutions → Your Solution → Program → Fields

2. **Create New Field**
   - Display Name: `Price per kW`
   - Name: `cpw_priceperkw`
   - Data Type: Currency
   - Required: No

3. **Add to Form**
   - Go to Program → Forms → Main Form
   - Drag the "Price per kW" field onto the form
   - Save and Publish

### 7. Update the Business Rule

1. Go to Opportunity → Business Rules
2. Find your revenue calculation rule
3. Update the formula to:
   ```
   Estimated Full Term Revenue = Program.cpw_priceperkw × Opportunity.TotalKW
   ```
4. Save and Activate

## Testing the Integration

1. **Start the server**: `npm start`
2. **Open your HTML pricing table**
3. **Click "🧪 Test Dynamics Connection"** (button in top-right)
4. **Find Rhode Island Targeted Dispatch** in your table
5. **Change the price** (e.g., for 2025-26)
6. **Press Enter to confirm**

You should see:
- "🎯 Updating RI Targeted Dispatch..." message
- Success celebration: "🎉 EUREKA MOMENT! 🎉"

## Verify in Dynamics 365

1. Go to the Rhode Island Program record
2. Check the "Price per kW" field - it should show your new price
3. Go to an Opportunity using this program
4. The revenue should now calculate correctly!

## Troubleshooting

### Connection Failed
- Check your tenant ID is correct in `dynamics-server.js` line 19
- Verify the service account credentials
- Make sure the proxy server is running

### Program Not Found
- Use the search endpoint to find the exact program name
- Check the program exists in Dynamics 365
- Verify the GUID is correctly formatted

### Revenue Not Calculating
- Ensure the "Price per kW" field was created with exact name `cpw_priceperkw`
- Check the business rule is active
- Verify the Opportunity has a kW value

## The Complete Flow

1. **You change price** in HTML → $125/kW
2. **JavaScript detects** Rhode Island program
3. **Calls proxy server** → Updates Dynamics 365
4. **Program record updated** → cpw_priceperkw = 125
5. **Opportunity calculates** → Revenue = $125 × 1000kW = $125,000
6. **EUREKA! Real revenue values!** 🎉

## Need Help?

- Server logs appear in the terminal where you run `npm start`
- Browser console shows client-side logs
- The test button helps verify connectivity

## What About Your HTML File?

You mentioned needing to integrate with your HTML pricing table. Could you:
1. Share the location/name of your HTML file?
2. Or share a snippet of how your current pricing table works?

This will help me provide the exact integration code for your specific setup.