// dynamics-proxy-server.js
// Standalone Dynamics 365 connection proxy server
// Handles all authentication and API calls to Dynamics 365

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// Dynamics 365 Configuration from connection string
const DYNAMICS_CONFIG = {
    baseUrl: 'https://cpowerdev.api.crm.dynamics.com',
    username: 'DropServiceAccount@cpowerenergymanagement.com',
    password: 'cXJ8i35sJSBdprEzYoD3!',
    clientId: 'cba37114-030d-4389-8c45-5f9b961b5f95',
    tenantId: '36d907c0-d528-449a-8502-7ed7ff4b32dc', // You'll need to get this
    resource: 'https://cpowerdev.api.crm.dynamics.com'
};

// Program entity configuration
const PROGRAM_CONFIG = {
    entityName: 'cpw_programs', // Your Program entity API name
    priceField: 'cpw_priceperkw', // The Price per kW field you'll create
    nameField: 'cpw_name',
    yearField: 'cpw_programyear',
    lastUpdatedField: 'cpw_lastupdated',
    updateSourceField: 'cpw_updatesource'
};

// Cache for access token (avoid getting new token for every request)
let tokenCache = {
    token: null,
    expiry: null
};

/**
 * Get OAuth access token for Dynamics 365
 */
async function getAccessToken() {
    try {
        // Check if we have a valid cached token
        if (tokenCache.token && tokenCache.expiry && new Date() < tokenCache.expiry) {
            console.log('Using cached access token');
            return tokenCache.token;
        }

        console.log('Getting new OAuth token for Dynamics 365...');
        
        const tokenUrl = `https://login.microsoftonline.com/${DYNAMICS_CONFIG.tenantId}/oauth2/token`;
        
        const params = new URLSearchParams({
            'grant_type': 'password',
            'client_id': DYNAMICS_CONFIG.clientId,
            'resource': DYNAMICS_CONFIG.resource,
            'username': DYNAMICS_CONFIG.username,
            'password': DYNAMICS_CONFIG.password
        });
        
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Token request failed: ${response.status} - ${errorText}`);
        }
        
        const tokenData = await response.json();
        
        // Cache the token (expires in about 1 hour)
        tokenCache.token = tokenData.access_token;
        tokenCache.expiry = new Date(Date.now() + (tokenData.expires_in - 300) * 1000); // 5 min buffer
        
        console.log('✅ Successfully obtained access token');
        return tokenData.access_token;
        
    } catch (error) {
        console.error('❌ Error getting access token:', error);
        throw error;
    }
}

/**
 * Update a program's pricing in Dynamics 365
 */
async function updateProgramPricing(programId, pricePerKw, additionalData = {}) {
    try {
        const accessToken = await getAccessToken();
        
        const updateData = {
            [PROGRAM_CONFIG.priceField]: parseFloat(pricePerKw),
            [PROGRAM_CONFIG.lastUpdatedField]: new Date().toISOString(),
            [PROGRAM_CONFIG.updateSourceField]: 'Pricing Table Editor',
            ...additionalData
        };
        
        console.log(`Updating program ${programId} with data:`, updateData);
        
        const updateUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/${PROGRAM_CONFIG.entityName}(${programId})`;
        
        const response = await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'If-Match': '*',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            const updatedRecord = response.status === 204 ? { id: programId } : await response.json();
            console.log('✅ Successfully updated program in Dynamics 365');
            return { success: true, record: updatedRecord };
        } else {
            const errorText = await response.text();
            console.error('❌ Failed to update program:', errorText);
            throw new Error(`Update failed: ${response.status} - ${errorText}`);
        }
        
    } catch (error) {
        console.error('❌ Error updating program:', error);
        throw error;
    }
}

/**
 * Get a program's current data from Dynamics 365
 */
async function getProgramData(programId) {
    try {
        const accessToken = await getAccessToken();
        
        const selectFields = [
            PROGRAM_CONFIG.priceField,
            PROGRAM_CONFIG.nameField,
            PROGRAM_CONFIG.yearField,
            PROGRAM_CONFIG.lastUpdatedField
        ].join(',');
        
        const queryUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/${PROGRAM_CONFIG.entityName}(${programId})?$select=${selectFields}`;
        
        const response = await fetch(queryUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        });
        
        if (response.ok) {
            const programData = await response.json();
            console.log('✅ Retrieved program data from Dynamics 365');
            return { success: true, data: programData };
        } else {
            const errorText = await response.text();
            throw new Error(`Query failed: ${response.status} - ${errorText}`);
        }
        
    } catch (error) {
        console.error('❌ Error getting program data:', error);
        throw error;
    }
}

/**
 * Find programs by name (useful for getting program IDs)
 */
async function findProgramsByName(programName) {
    try {
        const accessToken = await getAccessToken();
        
        const filter = `${PROGRAM_CONFIG.nameField} eq '${programName}'`;
        const selectFields = [
            PROGRAM_CONFIG.priceField,
            PROGRAM_CONFIG.nameField,
            PROGRAM_CONFIG.yearField,
            'cpw_programid' // Primary key
        ].join(',');
        
        const queryUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/${PROGRAM_CONFIG.entityName}?$filter=${encodeURIComponent(filter)}&$select=${selectFields}`;
        
        const response = await fetch(queryUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log(`✅ Found ${result.value.length} programs matching "${programName}"`);
            return { success: true, programs: result.value };
        } else {
            const errorText = await response.text();
            throw new Error(`Search failed: ${response.status} - ${errorText}`);
        }
        
    } catch (error) {
        console.error('❌ Error searching programs:', error);
        throw error;
    }
}

// ==========================================
// API ENDPOINTS
// ==========================================

/**
 * Test connection to Dynamics 365
 */
app.get('/api/test-connection', async (req, res) => {
    try {
        console.log('🧪 Testing Dynamics 365 connection...');
        const accessToken = await getAccessToken();
        
        res.json({ 
            success: true, 
            message: 'Successfully connected to Dynamics 365',
            baseUrl: DYNAMICS_CONFIG.baseUrl,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Connection test failed:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Update program pricing by program ID
 */
app.post('/api/update-program/:programId', async (req, res) => {
    try {
        const { programId } = req.params;
        const { pricePerKw, year, ...additionalData } = req.body;
        
        console.log(`📝 Updating program ${programId}...`);
        
        if (!pricePerKw) {
            return res.status(400).json({ 
                success: false, 
                error: 'pricePerKw is required' 
            });
        }
        
        // Add year to additional data if provided
        if (year) {
            additionalData[PROGRAM_CONFIG.yearField] = year;
        }
        
        const result = await updateProgramPricing(programId, pricePerKw, additionalData);
        
        res.json({ 
            success: true, 
            message: `Program ${programId} updated to $${pricePerKw}/kW`,
            programId: programId,
            updatedValue: pricePerKw,
            record: result.record
        });
        
    } catch (error) {
        console.error(`❌ Error updating program ${req.params.programId}:`, error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Get program data by program ID
 */
app.get('/api/program/:programId', async (req, res) => {
    try {
        const { programId } = req.params;
        console.log(`📖 Getting program ${programId}...`);
        
        const result = await getProgramData(programId);
        
        res.json({ 
            success: true,
            programId: programId,
            data: result.data
        });
        
    } catch (error) {
        console.error(`❌ Error getting program ${req.params.programId}:`, error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Find programs by name
 */
app.get('/api/programs/search', async (req, res) => {
    try {
        const { name } = req.query;
        
        if (!name) {
            return res.status(400).json({ 
                success: false, 
                error: 'name parameter is required' 
            });
        }
        
        console.log(`🔍 Searching for programs named "${name}"...`);
        
        const result = await findProgramsByName(name);
        
        res.json({ 
            success: true,
            searchTerm: name,
            programs: result.programs
        });
        
    } catch (error) {
        console.error(`❌ Error searching programs:`, error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Get all programs
 */
app.get('/api/programs', async (req, res) => {
    try {
        const { top = 100, orderby = 'createdon desc' } = req.query;
        
        console.log(`📋 Fetching all programs (top ${top})...`);
        
        const accessToken = await getAccessToken();
        
        const queryUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/${PROGRAM_CONFIG.entityName}?$select=${PROGRAM_CONFIG.nameField},${PROGRAM_CONFIG.priceField},createdon&$top=${top}&$orderby=${orderby}`;
        
        const response = await fetch(queryUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Query failed: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        const programs = data.value.map(prog => ({
            id: prog[`${PROGRAM_CONFIG.entityName}id`],
            name: prog[PROGRAM_CONFIG.nameField],
            pricePerKw: prog[PROGRAM_CONFIG.priceField],
            createdon: prog.createdon
        }));
        
        console.log(`✅ Found ${programs.length} programs`);
        
        res.json({ 
            success: true, 
            count: programs.length,
            programs: programs
        });
        
    } catch (error) {
        console.error(`❌ Error fetching programs:`, error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Specific endpoint for Rhode Island Connected Solutions Targeted Dispatch
 */
app.post('/api/update-ri-targeted-dispatch', async (req, res) => {
    try {
        const { pricePerKw, year, programId } = req.body;
        
        console.log('🎯 UPDATING RHODE ISLAND TARGETED DISPATCH');
        console.log('Request data:', { pricePerKw, year, programId });
        
        if (!programId) {
            return res.status(400).json({ 
                success: false, 
                error: 'programId is required for Rhode Island program' 
            });
        }
        
        const additionalData = {};
        if (year) {
            additionalData[PROGRAM_CONFIG.yearField] = year;
        }
        
        const result = await updateProgramPricing(programId, pricePerKw, additionalData);
        
        console.log('🎉 EUREKA! Rhode Island Targeted Dispatch updated successfully!');
        
        res.json({ 
            success: true, 
            message: `🎉 EUREKA! Rhode Island Connected Solutions Targeted Dispatch updated to $${pricePerKw}/kW for ${year}`,
            programId: programId,
            updatedValue: pricePerKw,
            year: year,
            record: result.record
        });
        
    } catch (error) {
        console.error('❌ FAILED: Rhode Island update error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('🚀 Dynamics 365 Proxy Server Started');
    console.log(`📡 Running on: http://localhost:${PORT}`);
    console.log('📋 Available endpoints:');
    console.log(`   GET  /api/test-connection`);
    console.log(`   POST /api/update-program/:programId`);
    console.log(`   GET  /api/program/:programId`);
    console.log(`   GET  /api/programs/search?name=ProgramName`);
    console.log(`   POST /api/update-ri-targeted-dispatch`);
    console.log('');
    console.log(`🧪 Test connection: http://localhost:${PORT}/api/test-connection`);
});

module.exports = {
    getAccessToken,
    updateProgramPricing,
    getProgramData,
    findProgramsByName,
    DYNAMICS_CONFIG,
    PROGRAM_CONFIG
};