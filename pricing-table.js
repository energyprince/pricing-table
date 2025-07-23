/**
 * Pricing Table for CPower Demand Response Quote Tool
 * Contains all pricing information for ISO-NE and NYISO regions
 * Includes energy rates for Energy Payments calculations
 * 
 * @version 2.0
 */

const PricingTable = {
    // --- helper -------------------------------------------------------------
    normaliseUDC(raw) {
      if (!raw) return raw;
      const alias = {
        'CONED': 'ConEd',
        'CONED (STATEN ISLAND)': 'ConEd (Staten Island)',
        'CONED (WESTCHESTER)': 'ConEd (Westchester)',
        'NGRID': 'NGRID', 'CHGE': 'CHGE', 'O&R': 'O&R',
        'NYSEG': 'NYSEG', 'RG&E': 'RG&E', 'PSEG-LI': 'PSEG-LI'
      };
      return alias[raw.trim().toUpperCase()] ?? raw;
    },
    
    // ISO-NE Rates
    // Rates for various ISO-NE programs (ADCR, OPHR, Connected Solutions, etc.)
    isoneRates: {
        // ADCR hourly rates by zone and year
        adcr: {
            'CT': { '25-26': 2.59, '26-27': 2.59, '27-28': 3.58, '28-29': 3.50, '29-30': 3.50 } ,
            'NEMA': { '25-26': 2.64, '26-27': 2.59, '27-28': 3.58, '28-29': 3.50, '29-30': 3.50 },
            'SEMA': { '25-26': 2.64, '26-27': 2.59, '27-28': 3.58, '28-29': 3.50, '29-30': 3.50 },
            'WCMA': { '25-26': 2.59, '26-27': 2.59, '27-28': 3.58, '28-29': 3.50, '29-30': 3.50 },
            'RI': { '25-26': 2.64, '26-27': 2.59, '27-28': 3.58, '28-29': 3.50, '29-30': 3.50 },
            'VT': { '25-26': 2.53, '26-27': 2.59, '27-28': 3.58, '28-29': 3.50, '29-30': 3.50 },
            'NH': { '25-26': 2.53, '26-27': 2.59, '27-28': 3.58, '28-29': 3.50, '29-30': 3.50 },
            'ME': { '25-26': 2.53, '26-27': 2.59, '27-28': 3.58, '28-29': 3.50, '29-30': 3.50 }
        },
        
        // OPHR rates by zone, type, and year
        ophr: [
            // OPHR All Year Rates
            { zone: "CT", product: "OPHR All Year", "25-26": 2.64, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "NEMA", product: "OPHR All Year", "25-26": 2.64, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "WCMA", product: "OPHR All Year", "25-26": 2.64, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "SEMA", product: "OPHR All Year", "25-26": 2.59, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "RI", product: "OPHR All Year", "25-26": 2.59, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "VT", product: "OPHR All Year", "25-26": 2.64, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "NH", product: "OPHR All Year", "25-26": 2.53, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "ME", product: "OPHR All Year", "25-26": 2.53, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            
            // OPHR Summer Rates
            { zone: "NEMA", product: "Solar OPHR Summer", "25-26": 2.53, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "WCMA", product: "Solar OPHR Summer", "25-26": 2.59, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "SEMA", product: "Solar OPHR Summer", "25-26": 2.64, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "CT", product: "Solar OPHR Summer", "25-26": 2.59, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "RI", product: "Solar OPHR Summer", "25-26": 2.64, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "VT", product: "Solar OPHR Summer", "25-26": 2.53, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "NH", product: "Solar OPHR Summer", "25-26": 2.53, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "ME", product: "Solar OPHR Summer", "25-26": 2.53, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            
            // OPHR Winter Rates
            { zone: "NEMA", product: "OPHR Winter Only", "25-26": 2.64, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "WCMA", product: "OPHR Winter Only", "25-26": 2.59, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "SEMA", product: "OPHR Winter Only", "25-26": 2.64, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "CT", product: "OPHR Winter Only", "25-26": 2.59, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "RI", product: "OPHR Winter Only", "25-26": 2.64, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "VT", product: "OPHR Winter Only", "25-26": 2.53, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "NH", product: "OPHR Winter Only", "25-26": 2.53, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 },
            { zone: "ME", product: "OPHR Winter Only", "25-26": 2.53, "26-27": 2.59, "27-28": 3.58, "28-29": 3.50, "29-30": 3.50, "30-31": 3.50, "31-32": 3.50, "32-33": 3.50, "33-34": 3.50, "34-35": 3.50, "35-36": 3.50, "36-37": 3.50, "37-38": 3.50, "38-39": 3.50, "39-40": 3.50, "40-41": 3.50, "41-42": 3.50, "42-43": 3.50, "43-44": 3.50, "44-45": 3.50 }
        ],
        
        // Connected Solutions rates by utility and year
        connectedSolutions: {
            'National Grid': {
                'Daily Dispatch': { 
                    '25-26': 200.00, '26-27': 200.00, '27-28': 200.00, '28-29': 200.00, '29-30': 200.00,
                    '30-31': 200.00, '31-32': 200.00, '32-33': 200.00, '33-34': 200.00, '34-35': 200.00,
                    '35-36': 200.00, '36-37': 200.00, '37-38': 200.00, '38-39': 200.00, '39-40': 200.00,
                    '40-41': 200.00, '41-42': 200.00, '42-43': 200.00, '43-44': 200.00, '44-45': 200.00
                },
                'Targeted Dispatch': { 
                    '25-26': 35.00, '26-27': 35.00, '27-28': 35.00, '28-29': 35.00, '29-30': 35.00,
                    '30-31': 35.00, '31-32': 35.00, '32-33': 35.00, '33-34': 35.00, '34-35': 35.00,
                    '35-36': 35.00, '36-37': 35.00, '37-38': 35.00, '38-39': 35.00, '39-40': 35.00,
                    '40-41': 35.00, '41-42': 35.00, '42-43': 35.00, '43-44': 35.00, '44-45': 35.00
                }
            },
            'RI Energy': {
                'Daily Dispatch': { 
                    '25-26': 275.00, '26-27': 275.00, '27-28': 275.00, '28-29': 275.00, '29-30': 275.00,
                    '30-31': 275.00, '31-32': 275.00, '32-33': 275.00, '33-34': 275.00, '34-35': 275.00,
                    '35-36': 275.00, '36-37': 275.00, '37-38': 275.00, '38-39': 275.00, '39-40': 275.00,
                    '40-41': 275.00, '41-42': 275.00, '42-43': 275.00, '43-44': 275.00, '44-45': 275.00
                },
                'Targeted Dispatch': { 
                    '25-26': 35.00, '26-27': 35.00, '27-28': 35.00, '28-29': 35.00, '29-30': 35.00,
                    '30-31': 35.00, '31-32': 35.00, '32-33': 35.00, '33-34': 35.00, '34-35': 35.00,
                    '35-36': 35.00, '36-37': 35.00, '37-38': 35.00, '38-39': 35.00, '39-40': 35.00,
                    '40-41': 35.00, '41-42': 35.00, '42-43': 35.00, '43-44': 35.00, '44-45': 35.00
                }
            },
            'Eversource': {
                'Daily Dispatch': { 
                    '25-26': 200.00, '26-27': 200.00, '27-28': 200.00, '28-29': 200.00, '29-30': 200.00,
                    '30-31': 200.00, '31-32': 200.00, '32-33': 200.00, '33-34': 200.00, '34-35': 200.00,
                    '35-36': 200.00, '36-37': 200.00, '37-38': 200.00, '38-39': 200.00, '39-40': 200.00,
                    '40-41': 200.00, '41-42': 200.00, '42-43': 200.00, '43-44': 200.00, '44-45': 200.00
                },
                'Targeted Dispatch': { 
                    '25-26': 45.00, '26-27': 45.00, '27-28': 45.00, '28-29': 45.00, '29-30': 45.00,
                    '30-31': 45.00, '31-32': 45.00, '32-33': 45.00, '33-34': 45.00, '34-35': 45.00,
                    '35-36': 45.00, '36-37': 45.00, '37-38': 45.00, '38-39': 45.00, '39-40': 45.00,
                    '40-41': 45.00, '41-42': 45.00, '42-43': 45.00, '43-44': 45.00, '44-45': 45.00
                }
            },
            'Unitil - MA': {
                'Daily Dispatch': { 
                    '25-26': 200.00, '26-27': 200.00, '27-28': 200.00, '28-29': 200.00, '29-30': 200.00,
                    '30-31': 200.00, '31-32': 200.00, '32-33': 200.00, '33-34': 200.00, '34-35': 200.00,
                    '35-36': 200.00, '36-37': 200.00, '37-38': 200.00, '38-39': 200.00, '39-40': 200.00,
                    '40-41': 200.00, '41-42': 200.00, '42-43': 200.00, '43-44': 200.00, '44-45': 200.00
                },
                'Targeted Dispatch': { 
                    '25-26': 35.00, '26-27': 35.00, '27-28': 35.00, '28-29': 35.00, '29-30': 35.00,
                    '30-31': 35.00, '31-32': 35.00, '32-33': 35.00, '33-34': 35.00, '34-35': 35.00,
                    '35-36': 35.00, '36-37': 35.00, '37-38': 35.00, '38-39': 35.00, '39-40': 35.00,
                    '40-41': 35.00, '41-42': 35.00, '42-43': 35.00, '43-44': 35.00, '44-45': 35.00
                }
            },
            'Unitil - NH': {
                'Daily Dispatch': { 
                    '25-26': 0.00, '26-27': 0.00, '27-28': 0.00, '28-29': 0.00, '29-30': 0.00,
                    '30-31': 0.00, '31-32': 0.00, '32-33': 0.00, '33-34': 0.00, '34-35': 0.00,
                    '35-36': 0.00, '36-37': 0.00, '37-38': 0.00, '38-39': 0.00, '39-40': 0.00,
                    '40-41': 0.00, '41-42': 0.00, '42-43': 0.00, '43-44': 0.00, '44-45': 0.00
                },
                'Targeted Dispatch': { 
                    '25-26': 35.00, '26-27': 35.00, '27-28': 35.00, '28-29': 35.00, '29-30': 35.00,
                    '30-31': 35.00, '31-32': 35.00, '32-33': 35.00, '33-34': 35.00, '34-35': 35.00,
                    '35-36': 35.00, '36-37': 35.00, '37-38': 35.00, '38-39': 35.00, '39-40': 35.00,
                    '40-41': 35.00, '41-42': 35.00, '42-43': 35.00, '43-44': 35.00, '44-45': 35.00
                }
            },
            'Liberty Electric': {
                'Daily Dispatch': { 
                    '25-26': 0.00, '26-27': 0.00, '27-28': 0.00, '28-29': 0.00, '29-30': 0.00,
                    '30-31': 0.00, '31-32': 0.00, '32-33': 0.00, '33-34': 0.00, '34-35': 0.00,
                    '35-36': 0.00, '36-37': 0.00, '37-38': 0.00, '38-39': 0.00, '39-40': 0.00,
                    '40-41': 0.00, '41-42': 0.00, '42-43': 0.00, '43-44': 0.00, '44-45': 0.00
                },
                'Targeted Dispatch': { 
                    '25-26': 25.00, '26-27': 25.00, '27-28': 25.00, '28-29': 25.00, '29-30': 25.00,
                    '30-31': 25.00, '31-32': 25.00, '32-33': 25.00, '33-34': 25.00, '34-35': 25.00,
                    '35-36': 25.00, '36-37': 25.00, '37-38': 25.00, '38-39': 25.00, '39-40': 25.00,
                    '40-41': 25.00, '41-42': 25.00, '42-43': 25.00, '43-44': 25.00, '44-45': 25.00
                }
            },
            'Efficiency Maine': {
                'Daily Dispatch': { 
                    '25-26': 0.00, '26-27': 0.00, '27-28': 0.00, '28-29': 0.00, '29-30': 0.00,
                    '30-31': 0.00, '31-32': 0.00, '32-33': 0.00, '33-34': 0.00, '34-35': 0.00,
                    '35-36': 0.00, '36-37': 0.00, '37-38': 0.00, '38-39': 0.00, '39-40': 0.00,
                    '40-41': 0.00, '41-42': 0.00, '42-43': 0.00, '43-44': 0.00, '44-45': 0.00
                },
                'Targeted Dispatch': { 
                    '25-26': 35.00, '26-27': 35.00, '27-28': 35.00, '28-29': 35.00, '29-30': 35.00,
                    '30-31': 35.00, '31-32': 35.00, '32-33': 35.00, '33-34': 35.00, '34-35': 35.00,
                    '35-36': 35.00, '36-37': 35.00, '37-38': 35.00, '38-39': 35.00, '39-40': 35.00,
                    '40-41': 35.00, '41-42': 35.00, '42-43': 35.00, '43-44': 35.00, '44-45': 35.00
                }
            }
        },
        
        // Clean Peak rates by year (not utility-specific)
        cleanPeak: { 
            '25-26': 45.00, '26-27': 65.00, '27-28': 65.00, '28-29': 62.00, '29-30': 59.00, 
            '30-31': 56.00, '31-32': 53.00, '32-33': 50.00, '33-34': 48.00, '34-35': 45.00, 
            '35-36': 43.00, '36-37': 41.00, '37-38': 39.00, '38-39': 37.00, '39-40': 35.00, 
            '40-41': 33.00, '41-42': 32.00, '42-43': 30.00, '43-44': 29.00, '44-45': 28.00
        }
    },
    
    // NYISO Rates
    nyisoRates: {
        // SCR rates by zone and season
        // SCR rates by zone and season
        scr: {
            'NYC': { 'summer': 15.00, 'winter': 9.25 },
            'LI': { 'summer': 5.50, 'winter': 2.50 },
            'LHV': { 'summer': 5.50, 'winter': 2.50 },
            'ROS': { 'summer': 5.50, 'winter': 2.50 }
        },
        
        // CSRP rates by location, utility, and tier
        csrp: {
            'NYC': {
                'ConEd': { '1': 18.00, '2': 18.00, 'Select': 18.00 },
                'ConEd (Staten Island)': { '1': 6.00, '2': 6.00, 'Select': 6.00 }
            },
            'LHV': {
                'ConEd (Westchester)': { '1': 6.00, '2': 6.00, 'Select': 6.00 },
                'NYSEG': { '1': 4.10, '2': 4.10, 'Select': 4.10 },
                'O&R': { '1': 3.00, '2': 3.00, 'Select': 3.00 },
                'CHGE': { '1': 1.23, '2': 1.23, 'Select': 1.23 }
            },
            'LI': {
                'PSEG-LI': { '1': 5.00, '2': 7.50, 'Select': 5.00 }
            },
            'ROS': {
                'NGRID': { '1': 2.75, '2': 2.75, 'Select': 2.75 },
                'NYSEG': { '1': 4.10, '2': 4.10, 'Select': 4.10 },
                'RG&E': { '1': 4.25, '2': 4.25, 'Select': 4.25 },
                'CHGE': { '1': 1.23, '2': 1.23, 'Select': 1.23 }
            }
        },
        
        // DLRP rates by location, utility, and tier
        dlrp: {
            'NYC': {
                'ConEd': { '1': 18.00, '2': 25.00, 'Select': 18.00 },
                'ConEd (Staten Island)': { '1': 18.00, '2': 25.00, 'Select': 18.00 }
            },
            'LHV': {
                'ConEd (Westchester)': { '1': 18.00, '2': 25.00, 'Select': 18.00 },
                'O&R': { '1': 3.00, '2': 5.00, 'Select': 3.00 }
            },
            'LI': {
                'PSEG-LI': { '1': 3.00, '2': 4.50, 'Select': 3.00 }
            }
        },
        
        // TDM rates by location, utility, and tier
        tdm: {
            'LHV': {
                'CHGE': { '1': 6.83, '2': 6.83, 'Select': 6.83 }
            },
            'ROS': {
                'CHGE': { '1': 6.83, '2': 6.83, 'Select': 6.83 }
            }
        },
        
        // Capacity Adjustment Factors by zone
        capAdjFactors: {
            'NYC': 0.6831,
            'LI': 0.7443,
            'LHV': 0.7688,
            'ROS': 0.7721
        }
    },
    
    // Energy Rates for Energy Payments Calculations
    energyRates: {
        // SCR energy rates by zone
        SCR: {
            'NYC': { hours: 10.0, energyRate: 0.50, multiplier: 5.00 },
            'LI': { hours: 6.0, energyRate: 0.50, multiplier: 3.00 },
            'LHV': { hours: 6.0, energyRate: 0.50, multiplier: 3.00 },
            'ROS': { hours: 6.0, energyRate: 0.50, multiplier: 3.00 }
        },
        
        // CSRP energy rates by utility
        CSRP: {
            'NGRID': { hours: 5.0, energyRate: 0.18, multiplier: 0.90 },
            'ConEd': { hours: 5.0, energyRate: 1.00, multiplier: 5.00 },
            'ConEd (Staten Island)': { hours: 5.0, energyRate: 1.00, multiplier: 5.00 },
            'ConEd (Westchester)': { hours: 5.0, energyRate: 1.00, multiplier: 5.00 },
            'CHGE': { hours: 5.0, energyRate: 0.11, multiplier: 0.55 },
            'NYSEG': { hours: 5.0, energyRate: 0.50, multiplier: 2.50 },
            'O&R': { hours: 5.0, energyRate: 0.50, multiplier: 2.50 },
            'PSEG-LI': { hours: 6.0, energyRate: 0.25, multiplier: 1.50 },
            'RG&E': { hours: 5.0, energyRate: 0.50, multiplier: 2.50 }
        },
        
        // TDM energy rates by utility
        TDM: {
            'CHGE': { 
                '1': { hours: 5.0, energyRate: 1.366, multiplier: 6.83 },
                '2': { hours: 5.0, energyRate: 1.366, multiplier: 6.83 },
                'Select': { hours: 5.0, energyRate: 1.366, multiplier: 6.83 }
            }
        },
        
        // DLRP energy rates by utility
        DLRP: {
            'NGRID': { hours: 0, energyRate: 0, multiplier: 0 },
            'ConEd': { hours: 6.0, energyRate: 1.00, multiplier: 6.00 },
            'ConEd (Staten Island)': { hours: 6.0, energyRate: 1.00, multiplier: 6.00 },
            'ConEd (Westchester)': { hours: 6.0, energyRate: 1.00, multiplier: 6.00 },
            'CHGE': { hours: 0, energyRate: 0, multiplier: 0 },
            'NYSEG': { hours: 0, energyRate: 0, multiplier: 0 },
            'O&R': { hours: 6.0, energyRate: 0.50, multiplier: 3.00 },
            'PSEG-LI': { hours: 6.0, energyRate: 0.25, multiplier: 1.50 },
            'RG&E': { hours: 0, energyRate: 0, multiplier: 0 }
        }
    },
    
    // ERCOT Rates
    ercotRates: {
        // 4CP (Capacity Tag) rates by utility and service class
        captag4cp: {
            'AEP Texas': {
                'Secondary': { 
                    monthlyCharge: 5.884572, 
                    annualMultiplier: 70614.86, 
                    unit: '$/kW-month' 
                },
                'Primary': { 
                    monthlyCharge: 5.76729, 
                    annualMultiplier: 69207.50, 
                    unit: '$/kW-month' 
                },
                'Transmission': { 
                    monthlyCharge: 3.95923, 
                    annualMultiplier: 47510.78, 
                    unit: '$/kW-month' 
                }
            },
            'Oncor Electric Delivery': {
                'Secondary': { 
                    monthlyCharge: 5.09769, 
                    annualMultiplier: 61172.28, 
                    unit: '$/kW-month' 
                },
                'Primary': { 
                    monthlyCharge: 4.83775, 
                    annualMultiplier: 58053.01, 
                    unit: '$/kW-month' 
                },
                'Primary - Substation': { 
                    monthlyCharge: 4.92917, 
                    annualMultiplier: 59150.04, 
                    unit: '$/kW-month' 
                },
                'Transmission': { 
                    monthlyCharge: 5.40036, 
                    annualMultiplier: 64804.36, 
                    unit: '$/kW-month' 
                }
            },
            'Texas-New Mexico Power Company': {
                'Secondary': { 
                    monthlyCharge: 6.43355, 
                    annualMultiplier: 77202.58, 
                    unit: '$/kW-month' 
                },
                'Primary': { 
                    monthlyCharge: 4.11538, 
                    annualMultiplier: 49384.51, 
                    unit: '$/kW-month' 
                },
                'Transmission': { 
                    monthlyCharge: 3.61078, 
                    annualMultiplier: 43329.38, 
                    unit: '$/kW-month' 
                }
            },
            'CenterPoint Energy': {
                'Secondary': { 
                    monthlyCharge: 6.54591, 
                    annualMultiplier: 78550.93, 
                    unit: '$/kVA-month',
                    note: 'CenterPoint bills in kVA, not kW'
                },
                'Primary': { 
                    monthlyCharge: 5.50376, 
                    annualMultiplier: 66045.11, 
                    unit: '$/kVA-month',
                    note: 'CenterPoint bills in kVA, not kW'
                },
                'Transmission': { 
                    monthlyCharge: 4.90082, 
                    annualMultiplier: 58809.82, 
                    unit: '$/kVA-month',
                    note: 'CenterPoint bills in kVA, not kW'
                }
            }
        },
        
        // ERS (Emergency Response Service) rates by season and time period
        ers: {
            seasons: {
                'Dec-Mar': {
                    'Time Period 1 (5am-9am)': { 
                        hours: 328, 
                        defaultPrice: 33.75 
                    },
                    'Time Period 2 (9am-1pm)': { 
                        hours: 328, 
                        defaultPrice: 6.03 
                    },
                    'Time Period 3 (1pm-4pm)': { 
                        hours: 246, 
                        defaultPrice: 5.99 
                    },
                    'Time Period 4 (4pm-7pm)': { 
                        hours: 246, 
                        defaultPrice: 26.38 
                    },
                    'Time Period 5 (7pm-10pm)': { 
                        hours: 246, 
                        defaultPrice: 17.20 
                    },
                    'Time Period 6 (5am-9am - wknd & holiday)': { 
                        hours: 160, 
                        defaultPrice: 10.08 
                    },
                    'Time Period 7 (3pm-9pm - wknd & holiday)': { 
                        hours: 240, 
                        defaultPrice: 0.43 
                    },
                    'Time Period 8 (all other hours)': { 
                        hours: 1109, 
                        defaultPrice: 3.43 
                    }
                },
                'Apr-May': {
                    'Time Period 1 (5am-9am)': { 
                        hours: 176, 
                        defaultPrice: 4.45 
                    },
                    'Time Period 2 (9am-1pm)': { 
                        hours: 176, 
                        defaultPrice: 0.30 
                    },
                    'Time Period 3 (1pm-4pm)': { 
                        hours: 132, 
                        defaultPrice: 0.30 
                    },
                    'Time Period 4 (4pm-7pm)': { 
                        hours: 132, 
                        defaultPrice: 4.49
                    },
                    'Time Period 5 (7pm-10pm)': { 
                        hours: 132, 
                        defaultPrice: 4.61 
                    },
                    'Time Period 6 (5am-9am - wknd & holiday)': { 
                        hours: 68, 
                        defaultPrice: 3.54 
                    },
                    'Time Period 7 (3pm-9pm - wknd & holiday)': { 
                        hours: 102, 
                        defaultPrice: 3.54 
                    },
                    'Time Period 8 (all other hours)': { 
                        hours: 546, 
                        defaultPrice: 0.30 
                    }
                },
                'Jun-Sep': {
                    'Time Period 1 (5am-9am)': { 
                        hours: 336, 
                        defaultPrice: 2.55 
                    },
                    'Time Period 2 (9am-1pm)': { 
                        hours: 336, 
                        defaultPrice: 2.55 
                    },
                    'Time Period 3 (1pm-4pm)': { 
                        hours: 252, 
                        defaultPrice: 19.61 
                    },
                    'Time Period 4 (4pm-7pm)': { 
                        hours: 252, 
                        defaultPrice: 25.47 
                    },
                    'Time Period 5 (7pm-10pm)': { 
                        hours: 252, 
                        defaultPrice: 23.08 
                    },
                    'Time Period 6 (5am-9am - wknd & holiday)': { 
                        hours: 152, 
                        defaultPrice: 0.27 
                    },
                    'Time Period 7 (3pm-9pm - wknd & holiday)': { 
                        hours: 228, 
                        defaultPrice: 18.53 
                    },
                    'Time Period 8 (all other hours)': { 
                        hours: 1120, 
                        defaultPrice: 0.27
                    }
                },
                'Oct-Nov': {
                    'Time Period 1 (5am-9am)': { 
                        hours: 168, 
                        defaultPrice: 5.40
                    },
                    'Time Period 2 (9am-1pm)': { 
                        hours: 168, 
                        defaultPrice: 0.36 
                    },
                    'Time Period 3 (1pm-4pm)': { 
                        hours: 126, 
                        defaultPrice: 0.36
                    },
                    'Time Period 4 (4pm-7pm)': { 
                        hours: 126, 
                        defaultPrice: 5.40 
                    },
                    'Time Period 5 (7pm-10pm)': { 
                        hours: 126, 
                        defaultPrice: 5.40 
                    },
                    'Time Period 6 (5am-9am - wknd & holiday)': { 
                        hours: 76, 
                        defaultPrice: 3.60 
                    },
                    'Time Period 7 (3pm-9pm - wknd & holiday)': { 
                        hours: 114, 
                        defaultPrice: 3.60 
                    },
                    'Time Period 8 (all other hours)': { 
                        hours: 561, 
                        defaultPrice: 0.36 
                    }
                }
            }
        },
        
        // LR-RRS (Load Resource Responsive Reserve Service) monthly rates
        lrRrs: {
            monthlyPricing: {
                'Jan': { avgPrice: 15.00, proration: 0.85, hours: 744 },
                'Feb': { avgPrice: 15.00, proration: 0.85, hours: 696 },
                'Mar': { avgPrice: 5.00, proration: 0.85, hours: 744 },
                'Apr': { avgPrice: 5.00, proration: 0.85, hours: 720 },
                'May': { avgPrice: 5.00, proration: 0.75, hours: 744 },
                'Jun': { avgPrice: 15.00, proration: 0.50, hours: 720 },
                'Jul': { avgPrice: 35.00, proration: 0.50, hours: 744 },
                'Aug': { avgPrice: 40.00, proration: 0.50, hours: 744 },
                'Sep': { avgPrice: 10.00, proration: 0.75, hours: 720 },
                'Oct': { avgPrice: 5.00, proration: 0.85, hours: 744 },
                'Nov': { avgPrice: 5.00, proration: 0.85, hours: 720 },
                'Dec': { avgPrice: 5.00, proration: 0.85, hours: 744 }
            }
        },
        
        // ECRS (ERCOT Contingency Reserve Service) monthly rates
        ecrs: {
            monthlyPricing: {
                'Jan': { avgPrice: 20.00, hours: 744 },
                'Feb': { avgPrice: 20.00, hours: 696 },
                'Mar': { avgPrice: 8.00, hours: 744 },
                'Apr': { avgPrice: 8.00, hours: 720 },
                'May': { avgPrice: 8.00, hours: 744 },
                'Jun': { avgPrice: 17.00, hours: 720 },
                'Jul': { avgPrice: 40.00, hours: 744 },
                'Aug': { avgPrice: 50.00, hours: 744 },
                'Sep': { avgPrice: 10.00, hours: 720 },
                'Oct': { avgPrice: 8.00, hours: 744 },
                'Nov': { avgPrice: 8.00, hours: 720 },
                'Dec': { avgPrice: 8.00, hours: 744 }
            }
        }
    },
    
    // APS Rates
    apsRates: {
        peakSolutions: {
            dayAheadCapacity: {
                '25-26': 8.00, '26-27': 8.00, '27-28': 8.00, '28-29': 8.00, '29-30': 8.00,
                '30-31': 8.00, '31-32': 8.00, '32-33': 8.00, '33-34': 8.00, '34-35': 8.00,
                '35-36': 8.00, '36-37': 8.00, '37-38': 8.00, '38-39': 8.00, '39-40': 8.00,
                '40-41': 8.00, '41-42': 8.00, '42-43': 8.00, '43-44': 8.00, '44-45': 8.00
            },
            dayOfCapacity: {
                '25-26': 10.00, '26-27': 10.00, '27-28': 10.00, '28-29': 10.00, '29-30': 10.00,
                '30-31': 10.00, '31-32': 10.00, '32-33': 10.00, '33-34': 10.00, '34-35': 10.00,
                '35-36': 10.00, '36-37': 10.00, '37-38': 10.00, '38-39': 10.00, '39-40': 10.00,
                '40-41': 10.00, '41-42': 10.00, '42-43': 10.00, '43-44': 10.00, '44-45': 10.00
            },
            energy: {
                '25-26': 0.09, '26-27': 0.09, '27-28': 0.09, '28-29': 0.09, '29-30': 0.09,
                '30-31': 0.09, '31-32': 0.09, '32-33': 0.09, '33-34': 0.09, '34-35': 0.09,
                '35-36': 0.09, '36-37': 0.09, '37-38': 0.09, '38-39': 0.09, '39-40': 0.09,
                '40-41': 0.09, '41-42': 0.09, '42-43': 0.09, '43-44': 0.09, '44-45': 0.09
            }
        }
    },
    
    // MDU Rates
    mduRates: {
        drr: {
            peakCapacity: {
                '25-26': 4.37, '26-27': 4.37, '27-28': 4.37, '28-29': 4.37, '29-30': 4.37,
                '30-31': 4.37, '31-32': 4.37, '32-33': 4.37, '33-34': 4.37, '34-35': 4.37,
                '35-36': 4.37, '36-37': 4.37, '37-38': 4.37, '38-39': 4.37, '39-40': 4.37,
                '40-41': 4.37, '41-42': 4.37, '42-43': 4.37, '43-44': 4.37, '44-45': 4.37
            },
            offPeakCapacity: {
                '25-26': 2.19, '26-27': 2.19, '27-28': 2.19, '28-29': 2.19, '29-30': 2.19,
                '30-31': 2.19, '31-32': 2.19, '32-33': 2.19, '33-34': 2.19, '34-35': 2.19,
                '35-36': 2.19, '36-37': 2.19, '37-38': 2.19, '38-39': 2.19, '39-40': 2.19,
                '40-41': 2.19, '41-42': 2.19, '42-43': 2.19, '43-44': 2.19, '44-45': 2.19
            },
            energy: {
                '25-26': 0.21, '26-27': 0.21, '27-28': 0.21, '28-29': 0.21, '29-30': 0.21,
                '30-31': 0.21, '31-32': 0.21, '32-33': 0.21, '33-34': 0.21, '34-35': 0.21,
                '35-36': 0.21, '36-37': 0.21, '37-38': 0.21, '38-39': 0.21, '39-40': 0.21,
                '40-41': 0.21, '41-42': 0.21, '42-43': 0.21, '43-44': 0.21, '44-45': 0.21
            }
        }
    },
    
    // MISO Rates
    misoRates: {
        lmr: {
            capacity: {
                '25-26': 25.00, '26-27': 25.00, '27-28': 25.00, '28-29': 25.00, '29-30': 25.00,
                '30-31': 25.00, '31-32': 25.00, '32-33': 25.00, '33-34': 25.00, '34-35': 25.00,
                '35-36': 25.00, '36-37': 25.00, '37-38': 25.00, '38-39': 25.00, '39-40': 25.00,
                '40-41': 25.00, '41-42': 25.00, '42-43': 25.00, '43-44': 25.00, '44-45': 25.00
            }
        }
    },
    // PJM Rates
    pjmRates: {
        // Emergency Capacity (EC) rates by zone (rates are in $/MW-day, converted to $/kW-day)
        ec: {
            // Zone-based pricing
            zones: {
                // Standard pricing for most zones ($269.92/MW-day = $0.26992/kW-day)
                'AECO': { capacity: 0.26992, excess: 0.01250 },
                'AEP': { capacity: 0.26992, excess: 0.01250 },
                'APS': { capacity: 0.26992, excess: 0.01250 },
                'ATSI': { capacity: 0.26992, excess: 0.01250 },
                'BGE': { capacity: 0.46635, excess: 0.01250 },  // Special pricing ($466.35/MW-day)
                'COMED': { capacity: 0.26992, excess: 0.01250 },
                'DAY': { capacity: 0.26992, excess: 0.01250 },
                'DEOK': { capacity: 0.26992, excess: 0.01250 },
                'DOM': { capacity: 0.44426, excess: 0.01250 },  // Special pricing ($444.26/MW-day)
                'DPL': { capacity: 0.26992, excess: 0.01250 },
                'DUQ': { capacity: 0.26992, excess: 0.01250 },
                'EXPC': { capacity: 0.26992, excess: 0.01250 },
                'JCPL': { capacity: 0.26992, excess: 0.01250 },
                'METED': { capacity: 0.26992, excess: 0.01250 },
                'PECO': { capacity: 0.26992, excess: 0.01250 },
                'PENELEC': { capacity: 0.26992, excess: 0.01250 },
                'PEPCO': { capacity: 0.26992, excess: 0.01250 },
                'PPL': { capacity: 0.26992, excess: 0.01250 },
                'PSEG': { capacity: 0.26992, excess: 0.01250 },
                'RECO': { capacity: 0.26992, excess: 0.01250 }
            }
        },
        
        // ELCC values by year
        elcc: {
            '2025': 0.77,
            '2026': 0.69,
            '2027': 0.85,
            '2028': 0.82,
            '2029': 0.77,
            '2030': 0.74
        },
        
        // Sync Reserve (Synchronized Reserve Service)
        syncReserve: {
            // 2024 average prices for different time windows
            '24-7': 0.00280,           // $/kWh - 24/7/365 average
            'weekday-business': 0.00190, // $/kWh - Mon-Fri 8am-5pm
            'daily-peak': 0.00402       // $/kWh - 7 days 10am-10pm
        }
    },
    
    // Get a specific price for a zone, product, and year
    getPrice: function(zone, product, yearRange, region = null) {
        // Determine region if not provided
        if (!region) {
            if (['NYC', 'LI', 'LHV', 'ROS'].includes(zone)) {
                region = 'nyiso';
            } else {
                region = 'isone';
            }
        }
        
        try {
            // For ISO-NE region
            if (region === 'isone') {
                if (product.includes('ADCR')) {
                    return this.isoneRates.adcr[zone]?.[yearRange] || null;
                } else if (product.includes('OPHR') || product.includes('Solar')) {
                    // For OPHR, find the matching rate in the array
                    if (this.isoneRates.ophr) {
                        const matchingRate = this.isoneRates.ophr.find(rate => 
                            rate.zone === zone && 
                            rate.product === product
                        );
                        return matchingRate?.[yearRange] || null;
                    }
                    return null;
                } else if (product.includes('Dispatch')) {
                    // Connected Solutions lookup
                    const utility = zone; // For Connected Solutions, zone parameter is actually the utility
                    return this.isoneRates.connectedSolutions[utility]?.[product]?.[yearRange] || null;
                } else if (product === 'Clean Peak') {
                    return this.isoneRates.cleanPeak[yearRange] || null;
                }
            }
            // For NYISO region
            else if (region === 'nyiso') {
                if (product === 'SCR_SUMMER') {
                    return this.nyisoRates.scr[zone]?.summer || null;
                } else if (product === 'SCR_WINTER') {
                    return this.nyisoRates.scr[zone]?.winter || null;
                }
                // Add other NYISO product lookups as needed
            } else if (region === 'ercot') {
                const utility = zone; // In ERCOT context, 'zone' is used for utility
                if (product === 'ERS') {
                    // Calculate the annual weighted average ERS rate from the seasons and time periods.
                    if (!this.ercotRates || !this.ercotRates.ers || !this.ercotRates.ers.seasons) {
                        console.warn('PricingTable: ERCOT ERS pricing data (this.ercotRates.ers.seasons) is not available. Cannot calculate weighted average rate.');
                        return null;
                    }

                    let totalRevenueContribution = 0;
                    let totalAnnualHours = 0;

                    for (const seasonName in this.ercotRates.ers.seasons) {
                        if (Object.hasOwnProperty.call(this.ercotRates.ers.seasons, seasonName)) {
                            const season = this.ercotRates.ers.seasons[seasonName];
                            for (const timePeriodName in season) {
                                if (Object.hasOwnProperty.call(season, timePeriodName)) {
                                    const timePeriod = season[timePeriodName];
                                    if (typeof timePeriod.hours === 'number' && typeof timePeriod.defaultPrice === 'number') {
                                        totalRevenueContribution += (timePeriod.hours * timePeriod.defaultPrice);
                                        totalAnnualHours += timePeriod.hours;
                                    } else {
                                        console.warn(`PricingTable: Invalid ERS data for season '${seasonName}', period '${timePeriodName}'. Hours or defaultPrice missing/invalid.`);
                                    }
                                }
                            }
                        }
                    }

                    if (totalAnnualHours > 0) {
                        return totalRevenueContribution / totalAnnualHours;
                    } else {
                        console.warn('PricingTable: ERCOT ERS total annual hours is 0. Cannot calculate weighted average rate.');
                        return null;
                    }
                } else if (product === '4CP') {
                    // Placeholder for 4CP: This lookup is more complex as it requires serviceClass,
                    // which is not directly available in getPrice's current signature.
                    // The 4cp-module.js might use getRate or pass a more complex product string.
                    console.warn(`PricingTable: ERCOT 4CP lookup in getPrice called for utility ${utility}, product ${product}, year ${yearRange}. This lookup requires serviceClass and might be better handled by getRate or a modified product string.`);
                    return null;
                }
                // Add other ERCOT product lookups here if they fit the getPrice model
            } else if (region === 'aps') {
                if (product === 'Peak Solutions Day Ahead') {
                    return this.apsRates.peakSolutions.dayAheadCapacity[yearRange] || null;
                } else if (product === 'Peak Solutions Day Of') {
                    return this.apsRates.peakSolutions.dayOfCapacity[yearRange] || null;
                } else if (product === 'Peak Solutions Energy') {
                    return this.apsRates.peakSolutions.energy[yearRange] || null;
                }
            } else if (region === 'mdu') {
                if (product === 'DRR Peak Capacity') {
                    return this.mduRates.drr.peakCapacity[yearRange] || null;
                } else if (product === 'DRR Off-Peak Capacity') {
                    return this.mduRates.drr.offPeakCapacity[yearRange] || null;
                } else if (product === 'DRR Energy') {
                    return this.mduRates.drr.energy[yearRange] || null;
                }
            } else if (region === 'miso') {
                if (product === 'LMR Capacity') {
                    return this.misoRates.lmr.capacity[yearRange] || null;
                }            
            } else if (region === 'pjm') {
                    if (product === 'EC' || product === 'Emergency Capacity') {
                        // Get zone pricing from the simplified structure
                        const zoneData = this.pjmRates.ec.zones[zone];
                        if (zoneData) {
                            return zoneData.capacity || null;
                        }
                    }
                    else if (product === 'EC_EXCESS' || product === 'Excess') {
                        // All zones have the same excess price
                        return 12.50;
                    }            
                }
            
            // If no specific price is found after checking all regions and products
            console.warn(`PricingTable: No price found for ${zone} (utility/zone), ${product}, ${yearRange} in ${region}`);
        } catch (error) {
            console.error(`PricingTable: Error in getPrice for ${zone}, ${product}, ${yearRange}: ${error.message}`);
        }
        
        return null;
    },
    
    // Get a rate with more flexible parameter options
    getRate: function(params) {
        try {
            console.log(`getRate: ${JSON.stringify(params)}`);
            
            // Normalise UDC once for all downstream lookups
            if (params.udc) params.udc = this.normaliseUDC(params.udc);
            
            const { zone, product, udc, tier, year, season } = params;
            const regionToUse = params.region || this.determineRegion(zone);
            
            // Basic lookups for common rate types
            if (regionToUse === 'nyiso') {
                // SCR/ICAP rates - basic lookup
                if (product === 'SCR' || product === 'ICAP/SCR') {
                    const seasonToUse = season || 'summer';
                    return { value: this.nyisoRates.scr[zone]?.[seasonToUse] || null };
                }
                
                // For other NYISO programs, delegate to their modules if available
                if (product === 'CSRP' && window.CSRPModule && typeof window.CSRPModule.getRate === 'function') {
                    return window.CSRPModule.getRate(params);
                }
                
                if (product === 'DLRP' && window.DLRPModule && typeof window.DLRPModule.getRate === 'function') {
                    return window.DLRPModule.getRate(params);
                }
                
                if (product === 'TDM' && window.TDMModule && typeof window.TDMModule.getRate === 'function') {
                    return window.TDMModule.getRate(params);
                }
            } 
            else if (regionToUse === 'ercot') {
                // 4CP (Capacity Tag) rates for ERCOT
                if (product === '4CP' || product === 'CapTag4CP') {
                    const utility = params.utility || udc;
                    const serviceClass = params.serviceClass || 'Secondary';
                    if (utility && this.ercotRates.captag4cp[utility]) {
                        return { value: this.ercotRates.captag4cp[utility][serviceClass] || null };
                    }
                }
                
                // ERS (Emergency Response Service) rates for ERCOT
                if (product === 'ERS') {
                    const seasonToUse = season || 'Jun-Sep'; // Default to summer rates
                    const timePeriod = params.timePeriod || 'Time Period 4 (4pm-7pm)';
                    return { 
                        value: this.ercotRates.ers.seasons[seasonToUse]?.[timePeriod] || null 
                    };
                }
                
                // LR-RRS (Load Resource Responsive Reserve Service) rates for ERCOT
                if (product === 'LR-RRS') {
                    const month = params.month || 'Jul'; // Default to July
                    return { value: this.ercotRates.lrRrs.monthlyPricing[month] || null };
                }
                
                // ECRS (ERCOT Contingency Reserve Service) rates
                if (product === 'ECRS') {
                    const month = params.month || 'Jul'; // Default to July
                    return { value: this.ercotRates.ecrs.monthlyPricing[month] || null };
                }
            }
            else if (regionToUse === 'isone') {
                // ADCR rates - basic lookup
                if (product === 'ADCR') {
                    return { value: this.isoneRates.adcr[zone]?.[year || '25-26'] || null };
                }
                
                // OPHR rates - basic lookup
                if (product.includes('OPHR') || product.includes('Solar')) {
                    const matchingRate = this.isoneRates.ophr.find(rate => 
                        rate.zone === zone && 
                        rate.product === product
                    );
                    return { value: matchingRate?.[year || '25-26'] || null };
                }
                
                // For Connected Solutions, delegate to its module if available
                if (product.includes('Dispatch') && window.ConnectedSolutionsModule && 
                    typeof window.ConnectedSolutionsModule.getRate === 'function') {
                    return window.ConnectedSolutionsModule.getRate(params);
                }
                
                // Clean Peak rates - basic lookup
                if (product === 'Clean Peak' && params.udc) {
                    return { value: this.isoneRates.cleanPeak[year || '25-26'] || null };
                }
            }
            else if (regionToUse === 'pjm') {
                // Emergency Capacity (EC) rates
                if (product === 'EC' || product === 'Emergency Capacity') {
                    const priceType = params.priceType || 'capacity'; // 'capacity' or 'excess'
                    
                    // Get zone pricing from the simplified structure
                    const zoneData = this.pjmRates.ec.zones[zone];
                    if (zoneData) {
                        return { value: zoneData[priceType] || null };
                    }
                    
                    // Default excess price if not found
                    if (priceType === 'excess') {
                        return { value: 12.50 };
                    }
                }
                
                // Sync Reserve rates
                if (product === 'syncReserve' || product === 'Sync Reserve') {
                    const timeWindow = params.timeWindow || '24-7'; // '24-7', 'weekday-business', or 'daily-peak'
                    return { value: this.pjmRates.syncReserve[timeWindow] || null };
                }
            }
            
            console.warn(`PricingTable: No rate found for ${JSON.stringify(params)}`);
        } catch (error) {
            console.error(`PricingTable: Error in getRate: ${error.message}`);
        }
        
        return { value: null };
    },
    
    // Helper method to determine region from zone
    determineRegion: function(zone) {
        if (['NYC', 'LI', 'LHV', 'ROS'].includes(zone)) {
            return 'nyiso';
        }
        // PJM zones
        if (['BGE', 'DOM', 'EMAAC', 'MAAC', 'DEOK', 'RTO', 'AEP', 'APS', 'ATSI', 
            'COMED', 'DAY', 'DPL', 'DUQ', 'EKPC', 'JCPL', 'METED', 'PECO', 
            'PENELEC', 'PEPCO', 'PPL', 'PSEG', 'RECO', 'ComEd', 'Met-Ed', 'Pepco'].includes(zone)) {
           return 'pjm';
       }
        // ERCOT has no zones, but we'll handle it by specific flag
        if (zone === 'ERCOT' || zone === 'ercot') {
            return 'ercot';
        }
        // APS
        if (zone === 'APS' || zone === 'aps') {
            return 'aps';
        }
        // MDU
        if (zone === 'MDU' || zone === 'mdu') {
            return 'mdu';
        }
        // MISO
        if (zone === 'MISO' || zone === 'miso') {
            return 'miso';
        }
        // PJM
        if (zone === 'PJM' || zone === 'pjm') {
            return 'pjm';
        }
        return 'isone';
    },
    
    // Get price by utility (for Connected Solutions and Clean Peak)
    getPriceByUtility: function(utility, product, yearRange) {
        try {
            if (product.includes('Dispatch')) {
                return this.isoneRates.connectedSolutions[utility]?.[product]?.[yearRange] || null;
            } else if (product === 'Clean Peak') {
                return this.isoneRates.cleanPeak[yearRange] || null;
            }
        } catch (error) {
            console.error(`Error in getPriceByUtility for ${utility}, ${product}, ${yearRange}: ${error.message}`);
        }
        
        return null;
    },
    
    // Get TDM rate for a specific zone, utility, and tier
    getTDMRate: function(zone, utility, tier = 'Select') {
        try {
            return this.nyisoRates.tdm[zone]?.[utility]?.[tier] || null;
        } catch (error) {
            console.error(`Error in getTDMRate for ${zone}, ${utility}, ${tier}: ${error.message}`);
        }
        
        return null;
    },

       
    // Helper function to get PJM zone information
    getPJMZoneInfo: function(zone) {
        // Get zone pricing from the simplified structure
        const zoneData = this.pjmRates.ec.zones[zone];
        if (zoneData) {
            // Find which LDA this zone belongs to
            let lda = null;
            if (window.RegionContext && window.RegionContext.regions.pjm) {
                const ldaZoneMap = window.RegionContext.regions.pjm.ldaZoneMap;
                for (const [ldaName, zones] of Object.entries(ldaZoneMap)) {
                    if (zones.includes(zone)) {
                        lda = ldaName;
                        break;
                    }
                }
            }
            
            return {
                type: 'Zone',
                name: zone,
                lda: lda || 'Unknown',
                capacityPrice: zoneData.capacity,
                excessPrice: zoneData.excess
            };
        }
        
        return null;
    },
    
    // Get utility program data, including energy rates for energy payment calculations
    getUtilityProgramData: function(zone, program, utility, tier = 'Select') {
        try {
            utility = (utility || '').trim();           // " CONED " → "CONED"
            const utilKey = utility.toLowerCase();      // "coned"
  
            // build / cache a map with lower-cased keys once
            if (!this._lcCache) {
              this._lcCache = {};
              Object.entries(this.nyisoRates.csrp).forEach(([z, obj]) => {
                this._lcCache.csrp ??= {};
                Object.entries(obj).forEach(([u, tiers]) => {
                  this._lcCache.csrp[z] ??= {};
                  this._lcCache.csrp[z][u.toLowerCase()] = tiers;
                });
              });
              Object.entries(this.nyisoRates.dlrp).forEach(([z, obj]) => {
                this._lcCache.dlrp ??= {};
                Object.entries(obj).forEach(([u, tiers]) => {
                  this._lcCache.dlrp[z] ??= {};
                  this._lcCache.dlrp[z][u.toLowerCase()] = tiers;
                });
              });
              Object.entries(this.nyisoRates.tdm).forEach(([z, obj]) => {
                this._lcCache.tdm ??= {};
                Object.entries(obj).forEach(([u, tiers]) => {
                  this._lcCache.tdm[z] ??= {};
                  this._lcCache.tdm[z][u.toLowerCase()] = tiers;
                });
              });
            }
  
            let data = null;
  
            // For SCR, use zone-based lookup 
            if (program === 'SCR' || program === 'ICAP/SCR') {
              if (this.energyRates.SCR[zone]) {
                data = { ...this.energyRates.SCR[zone] };
                
                // Also include SCR price data
                if (this.nyisoRates.scr[zone]) {
                  data.summerPrice = this.nyisoRates.scr[zone].summer;
                  data.winterPrice = this.nyisoRates.scr[zone].winter;
                }
              }
            }
            // For CSRP, use utility-based lookup
            else if (program === 'CSRP') {
              const tiers = this._lcCache.csrp?.[zone]?.[utilKey];
              if (tiers) {
                const mult = tiers[tier] ?? tiers.Select;
                const canon = this.normaliseUDC(utility);          // "CONED" → "ConEd"
                const base = this.energyRates.CSRP[canon]         // canonical key
                         ?? this.energyRates.CSRP['ConEd'];        // fallback
                return { ...base, multiplier: mult };
              }
            }
            // For DLRP, use utility-based lookup
            else if (program === 'DLRP') {
              const tiers = this._lcCache.dlrp?.[zone]?.[utilKey];
              if (tiers) {
                const mult = tiers[tier] ?? tiers.Select;
                const canon = this.normaliseUDC(utility);          // "CONED" → "ConEd"
                const base = this.energyRates.DLRP[canon]         // canonical key
                         ?? this.energyRates.DLRP['ConEd'];        // fallback
                return { ...base, multiplier: mult };
              }
            }
            // For TDM, use utility-based lookup
            else if (program === 'TDM') {
              const tiers = this._lcCache.tdm?.[zone]?.[utilKey];
              if (tiers) {
                const mult = tiers[tier] ?? tiers.Select;
                const canon = this.normaliseUDC(utility);          // "CONED" → "ConEd"
                const base = this.energyRates.TDM[canon]          // canonical key
                         ?? this.energyRates.TDM['ConEd'];         // fallback
                return { ...base, multiplier: mult };
              }
            }
            
            return data;
        } catch (e) {
          console.error('Error fetching utility program data:', e);
          return null;
        }
    }
    
    // Functions moved to RegionContext module:
    // - getZones
    // - getProducts
    // - getYearRanges
    // - getPricesByZone
  };
  
  // Expose PricingTable to the global scope for other modules
  if (typeof window !== 'undefined') {
    window.pricingTable = PricingTable; // Use lowercase 'p' as expected by icap-scr-module.js
  }
  
  // For testing/node environments
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = PricingTable;
  }