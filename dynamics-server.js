
// ...existing code...

// === Modern Business Rule Functions and Endpoints (moved to just before server start) ===

/**
 * Create a Business Rule using the modern JSON format
 */
async function createBusinessRuleModern() {
    try {
        const accessToken = await getAccessToken();
        // Business rule definition in modern JSON format
        const businessRuleData = {
            "@odata.type": "Microsoft.Dynamics.CRM.workflow",
            "category": 2, // Business Rule
            "name": "Calculate Opportunity Revenue from Program",
            "description": "Automatically calculates revenue when kW and Program are set",
            "primaryentity": "opportunity",
            "type": 1, // Definition
            "scope": 4, // Organization
            "statecode": 0, // Draft
            "statuscode": 1, // Draft
            "subprocess": false,
            "triggeroncreate": true,
            "triggeronupdateattributelist": "cpw_projectedcurtailmentquantity,cpw_program",
            "introducedversion": "1.0.0.0",
            "ismanaged": false,
            "iscrmuiworkflow": true,
            "iscustomizable": {
                "Value": true
            },
            "rendererobjecttypecode": "opportunity",
            "runas": 0, // Owner
            "uiflowtype": 0, // Business Rule
            "uitype": 0,
            "mode": 0, // Real-time
            "rank": 1,
            // The key part - business rule definition in JSON
            "clientdata": JSON.stringify({
                "ComponentType": "Workflow",
                "Description": "Automatically calculates revenue when kW and Program are set",
                "DisplayName": "Calculate Opportunity Revenue from Program",
                "EntityName": "opportunity",
                "RuleScope": "Entity",
                "PrimaryEntityName": "opportunity",
                "RuleDefinition": {
                    "RuleName": "Calculate Opportunity Revenue from Program",
                    "RuleId": "{" + generateGuid() + "}",
                    "RuleType": "Definition",
                    "Triggers": [
                        {
                            "TriggerType": "OnChange",
                            "AttributeLogicalNames": ["cpw_projectedcurtailmentquantity", "cpw_program"]
                        },
                        {
                            "TriggerType": "OnLoad"
                        }
                    ],
                    "Conditions": {
                        "ConditionType": "And",
                        "Conditions": [
                            {
                                "AttributeName": "cpw_projectedcurtailmentquantity",
                                "Operator": "NotNull"
                            },
                            {
                                "AttributeName": "cpw_program",
                                "Operator": "NotNull"
                            }
                        ]
                    },
                    "Actions": [
                        {
                            "ActionType": "SetValue",
                            "ActionId": "{" + generateGuid() + "}",
                            "Target": {
                                "AttributeName": "estimatedvalue",
                                "EntityName": "opportunity"
                            },
                            "Value": {
                                "Type": "Formula",
                                "Formula": {
                                    "FormulaType": "Multiply",
                                    "Arguments": [
                                        {
                                            "Type": "AttributeValue",
                                            "AttributeName": "cpw_projectedcurtailmentquantity",
                                            "EntityName": "opportunity"
                                        },
                                        {
                                            "Type": "RelatedAttributeValue",
                                            "AttributeName": "cpw_priceperkw",
                                            "EntityName": "cpw_program",
                                            "RelationshipName": "cpw_program",
                                            "RelationshipFromAttribute": "cpw_program",
                                            "RelationshipToAttribute": "cpw_programid"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            })
        };
        const createUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/workflows`;
        const response = await fetch(createUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Accept': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(businessRuleData)
        });
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Successfully created business rule');
            // Now activate it
            const ruleId = result.workflowid;
            const activateResult = await activateBusinessRule(ruleId, accessToken);
            return {
                success: true,
                ruleId: ruleId,
                activated: activateResult.success,
                message: activateResult.success
                    ? 'Business rule created and activated successfully!'
                    : 'Business rule created but activation failed. Please activate manually.'
            };
        } else {
            const errorText = await response.text();
            console.error('❌ Failed to create business rule:', errorText);
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.error('❌ Error creating business rule:', error);
        throw error;
    }
}

/**
 * Activate a business rule
 */
async function activateBusinessRule(ruleId, accessToken) {
    try {
        const activateUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/workflows(${ruleId})/Microsoft.Dynamics.CRM.SetState`;
        const activateResponse = await fetch(activateUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            },
            body: JSON.stringify({
                "State": 1,  // Activated
                "Status": 2  // Activated
            })
        });
        if (activateResponse.ok || activateResponse.status === 204) {
            console.log('✅ Business rule activated successfully');
            return { success: true };
        } else {
            const errorText = await activateResponse.text();
            console.error('⚠️ Failed to activate business rule:', errorText);
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.error('❌ Error activating business rule:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update an existing business rule
 */
async function updateBusinessRuleDefinition(ruleId, newDefinition) {
    try {
        const accessToken = await getAccessToken();
        // First deactivate the rule
        const deactivateUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/workflows(${ruleId})/Microsoft.Dynamics.CRM.SetState`;
        await fetch(deactivateUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            },
            body: JSON.stringify({
                "State": 0,  // Draft
                "Status": 1  // Draft
            })
        });
        // Update the rule
        const updateUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/workflows(${ruleId})`;
        const updateData = {
            "clientdata": JSON.stringify(newDefinition)
        };
        const updateResponse = await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'If-Match': '*'
            },
            body: JSON.stringify(updateData)
        });
        if (updateResponse.ok || updateResponse.status === 204) {
            // Reactivate the rule
            const activateResult = await activateBusinessRule(ruleId, accessToken);
            return {
                success: true,
                activated: activateResult.success
            };
        } else {
            const errorText = await updateResponse.text();
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.error('❌ Error updating business rule:', error);
        throw error;
    }
}

/**
 * Helper function to generate GUID
 */
function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Get all business rules for an entity
 */
async function getBusinessRules(entityName) {
    try {
        const accessToken = await getAccessToken();
        const queryUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/workflows?$filter=primaryentity eq '${entityName}' and category eq 2&$select=workflowid,name,statecode,statuscode,description,clientdata`;
        const response = await fetch(queryUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        });
        if (response.ok) {
            const result = await response.json();
            return {
                success: true,
                rules: result.value.map(rule => ({
                    id: rule.workflowid,
                    name: rule.name,
                    description: rule.description,
                    isActive: rule.statecode === 1,
                    definition: rule.clientdata ? JSON.parse(rule.clientdata) : null
                }))
            };
        } else {
            const errorText = await response.text();
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.error('❌ Error getting business rules:', error);
        throw error;
    }
}

/**
 * API Endpoints
 */
app.post('/api/create-business-rule', async (req, res) => {
    try {
        console.log('🔧 Creating business rule via API...');
        const result = await createBusinessRuleModern();
        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Create business rule failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/business-rules/:entityName', async (req, res) => {
    try {
        const { entityName } = req.params;
        console.log(`🔍 Getting business rules for ${entityName}...`);
        const result = await getBusinessRules(entityName);
        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Get business rules failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.patch('/api/business-rule/:ruleId', async (req, res) => {
    try {
        const { ruleId } = req.params;
        const { definition } = req.body;
        console.log(`🔧 Updating business rule ${ruleId}...`);
        const result = await updateBusinessRuleDefinition(ruleId, definition);
        if (result.success) {
            res.json({
                success: true,
                message: result.activated
                    ? 'Business rule updated and activated successfully!'
                    : 'Business rule updated but needs manual activation',
                ruleId: ruleId
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Update business rule failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Test endpoint to verify business rule format
 */
app.get('/api/business-rule-format/:ruleId', async (req, res) => {
    try {
        const { ruleId } = req.params;
        const accessToken = await getAccessToken();
        const queryUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/workflows(${ruleId})?$select=workflowid,name,xaml,clientdata,category,type`;
        const response = await fetch(queryUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        });
        if (response.ok) {
            const rule = await response.json();
            res.json({
                success: true,
                rule: {
                    id: rule.workflowid,
                    name: rule.name,
                    category: rule.category,
                    type: rule.type,
                    hasXaml: !!rule.xaml,
                    hasClientData: !!rule.clientdata,
                    clientData: rule.clientdata ? JSON.parse(rule.clientdata) : null
                }
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Business rule not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
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
    tenantId: '36d907c0-d528-449a-8502-7ed7ff4b32dc',
    resource: 'https://cpowerdev.api.crm.dynamics.com'
};

// Program entity configuration
const PROGRAM_CONFIG = {
    entityName: 'cpw_programs', // Back to plural
    priceField: 'cpw_priceperkw', // The Price per kW field you'll create
    nameField: 'cpw_name',
    yearField: 'cpw_year' // Assuming this field exists
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
 * Get all fields for a specific entity
 */
async function getEntityFields(entityLogicalName) {
    try {
        const accessToken = await getAccessToken();
        const metadataUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/EntityDefinitions(LogicalName='${entityLogicalName}')/Attributes?$select=LogicalName,DisplayName,AttributeType&$filter=AttributeOf eq null`;
        const response = await fetch(metadataUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        });
        if (response.ok) {
            const result = await response.json();
            return {
                success: true,
                fields: result.value.map(field => ({
                    logicalName: field.LogicalName,
                    displayName: field.DisplayName?.LocalizedLabels?.[0]?.Label || 'No display name',
                    type: field.AttributeType
                }))
            };
        } else {
            const errorText = await response.text();
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.error('❌ Error getting entity fields:', error);
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
            PROGRAM_CONFIG.nameField
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

/**
 * Create the Price per kW field for the Program entity
 */
async function createPriceField() {
    try {
        const accessToken = await getAccessToken();
        const baseUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/EntityDefinitions(LogicalName='cpw_program')/Attributes`;
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Accept': 'application/json'
        };
        
        // Price per kW field definition
        const priceFieldBody = {
            "@odata.type": "Microsoft.Dynamics.CRM.MoneyAttributeMetadata",
            "AttributeType": "Money",
            "AttributeTypeName": { "Value": "MoneyType" },
            "Description": {
                "@odata.type": "Microsoft.Dynamics.CRM.Label",
                "LocalizedLabels": [{
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    "Label": "Price per kilowatt for the program",
                    "LanguageCode": 1033
                }]
            },
            "DisplayName": {
                "@odata.type": "Microsoft.Dynamics.CRM.Label",
                "LocalizedLabels": [{
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    "Label": "Price per kW",
                    "LanguageCode": 1033
                }]
            },
            "SchemaName": PROGRAM_CONFIG.priceField,
            "RequiredLevel": { "Value": "None", "CanBeChanged": true },
            "PrecisionSource": 2,
            "ImeMode": "Disabled"
        };
        
        console.log('Creating Price per kW field...');
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(priceFieldBody)
        });
        
        if (response.ok) {
            console.log('✅ Successfully created Price per kW field');
            return { success: true, field: 'Price per kW' };
        } else {
            const errorText = await response.text();
            console.error('❌ Failed to create Price per kW field:', errorText);
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.error('❌ Error creating Price per kW field:', error);
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
 * API endpoint to get Opportunity fields
 */
app.get('/api/opportunity-fields', async (req, res) => {
    try {
        console.log('🔍 Getting Opportunity entity fields...');
        const result = await getEntityFields('opportunity');
        if (result.success) {
            // Filter for fields we're likely interested in
            const relevantFields = result.fields.filter(field =>
                field.logicalName.toLowerCase().includes('kw') ||
                field.logicalName.toLowerCase().includes('revenue') ||
                field.logicalName.toLowerCase().includes('value') ||
                field.logicalName.toLowerCase().includes('program') ||
                field.logicalName.toLowerCase().includes('total') ||
                field.logicalName.toLowerCase().includes('estimate')
            );
            console.log('📋 Found relevant fields:', relevantFields.length);
            res.json({
                success: true,
                totalFields: result.fields.length,
                relevantFields: relevantFields,
                allFields: result.fields
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Get opportunity fields failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * API endpoint to search for specific field types
 */
app.get('/api/search-fields/:entityName', async (req, res) => {
    try {
        const { entityName } = req.params;
        const { search, type } = req.query;
        console.log(`🔍 Searching ${entityName} fields for: ${search}`);
        const result = await getEntityFields(entityName);
        if (result.success) {
            let filteredFields = result.fields;
            // Filter by search term
            if (search) {
                filteredFields = filteredFields.filter(field =>
                    field.logicalName.toLowerCase().includes(search.toLowerCase()) ||
                    field.displayName.toLowerCase().includes(search.toLowerCase())
                );
            }
            // Filter by type
            if (type) {
                filteredFields = filteredFields.filter(field =>
                    field.type.toLowerCase() === type.toLowerCase()
                );
            }
            res.json({
                success: true,
                searchTerm: search,
                fieldType: type,
                matchingFields: filteredFields
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
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
        
        const queryUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/${PROGRAM_CONFIG.entityName}?$select=${PROGRAM_CONFIG.nameField},createdon&$top=${top}&$orderby=${orderby}`;

        console.log('🔍 API URL being called:', queryUrl);
        console.log('🔍 Entity name being used:', PROGRAM_CONFIG.entityName);
        
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
            id: prog['cpw_programid'],
            name: prog[PROGRAM_CONFIG.nameField],
            pricePerKw: prog[PROGRAM_CONFIG.priceField] || null,
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

/**
 * Discover the correct entity name for Program
 */
app.get('/api/find-program-entity', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        // Search for entities containing "program" in the logical name
        const metadataUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/EntityDefinitions?$select=LogicalName,SchemaName,DisplayName&$filter=contains(LogicalName,'program')`;
        const response = await fetch(metadataUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        });
        if (response.ok) {
            const result = await response.json();
            console.log('Found program entities:', result.value);
            res.json({ 
                success: true, 
                entities: result.value.map(entity => ({
                    logicalName: entity.LogicalName,
                    schemaName: entity.SchemaName,
                    displayName: entity.DisplayName?.LocalizedLabels?.[0]?.Label || 'No display name'
                }))
            });
        } else {
            const errorText = await response.text();
            console.error('Metadata query failed:', errorText);
            res.status(500).json({ success: false, error: errorText });
        }
    } catch (error) {
        console.error('Error finding program entity:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Get entity metadata to find the correct logical name
 */
app.get('/api/discover-entity', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        // Try to get metadata for entities that might contain "program"
        const metadataUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/EntityDefinitions?$filter=contains(LogicalName,'program') or contains(DisplayName/LocalizedLabels/any(l: l/Label),'Program')&$select=LogicalName,DisplayName`;
        const response = await fetch(metadataUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        });
        if (response.ok) {
            const result = await response.json();
            res.json({ 
                success: true, 
                entities: result.value.map(entity => ({
                    logicalName: entity.LogicalName,
                    displayName: entity.DisplayName?.LocalizedLabels?.[0]?.Label
                }))
            });
        } else {
            const errorText = await response.text();
            res.status(500).json({ success: false, error: errorText });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Create the Price per kW field
 */
app.post('/api/create-price-field', async (req, res) => {
    try {
        console.log('🔧 Creating Price per kW field...');
        const result = await createPriceField();
        if (result.success) {
            res.json({ 
                success: true,
                message: 'Price per kW field created successfully!',
                field: result.field
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('❌ Create price field failed:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Update the existing Opportunity Revenue Rule to use Projected Curtailment Quantity
 */
async function updateOpportunityRevenueRule() {
    try {
        const accessToken = await getAccessToken();
        // First, find the existing rule
        const searchUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/workflows?$filter=name eq 'Opportunity Revenue Rule'&$select=workflowid,name,statecode,_ownerid_value`;
        const searchResponse = await fetch(searchUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        });
        if (!searchResponse.ok) {
            throw new Error(`Failed to search for existing rule: ${searchResponse.status}`);
        }
        const searchResult = await searchResponse.json();
        if (!searchResult.value || searchResult.value.length === 0) {
            throw new Error('Opportunity Revenue Rule not found');
        }
        const existingRule = searchResult.value[0];
        const ruleId = existingRule.workflowid;
        console.log(`Found existing rule: ${ruleId}`);
        // First, deactivate the rule if it's active
        if (existingRule.statecode === 1) {
            console.log('Deactivating rule before update...');
            const deactivateUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/workflows(${ruleId})/Microsoft.Dynamics.CRM.SetState`;
            const deactivateResponse = await fetch(deactivateUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'OData-MaxVersion': '4.0',
                    'OData-Version': '4.0'
                },
                body: JSON.stringify({
                    "State": 0,  // Draft
                    "Status": 1  // Draft
                })
            });
            if (!deactivateResponse.ok && deactivateResponse.status !== 204) {
                console.error('Failed to deactivate rule');
            }
        }
        // Updated business rule XML with correct field names
        const businessRuleXml = `
<RuleDefinition>
  <Entity>opportunity</Entity>
  <Rules>
    <Rule Name="Calculate Revenue from Program Pricing" UniqueId="{revenue-calc-rule}">
      <Conditions>
        <Condition Name="Check Required Fields" UniqueId="{check-fields}">
          <Criteria FilterOperator="And">
            <ConditionExpression>
              <AttributeName>cpw_projectedcurtailmentquantity</AttributeName>
              <Operator>NotNull</Operator>
            </ConditionExpression>
            <ConditionExpression>
              <AttributeName>cpw_program</AttributeName>
              <Operator>NotNull</Operator>
            </ConditionExpression>
          </Criteria>
        </Condition>
      </Conditions>
      <Actions>
        <Action Name="Set Estimated Revenue" UniqueId="{set-revenue}">
          <ActionType>SetFieldValue</ActionType>
          <Target>
            <AttributeName>estimatedvalue</AttributeName>
          </Target>
          <Value>
            <Formula>
              <Multiply>
                <FieldReference>cpw_projectedcurtailmentquantity</FieldReference>
                <LookupFieldReference>cpw_program.cpw_priceperkw</LookupFieldReference>
              </Multiply>
            </Formula>
          </Value>
        </Action>
      </Actions>
    </Rule>
  </Rules>
</RuleDefinition>`;
        // Update the rule
        const updateData = {
            "name": "Opportunity Revenue Rule",
            "description": "Calculates Estimated Full Term Revenue = Projected Curtailment Quantity (kW) × Program.Price per kW",
            "xaml": businessRuleXml,
            "triggeroncreate": true,
            "triggeronupdateattributelist": "cpw_projectedcurtailmentquantity,cpw_program"
        };
        const updateUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/workflows(${ruleId})`;
        const updateResponse = await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'If-Match': '*'
            },
            body: JSON.stringify(updateData)
        });
        if (!updateResponse.ok && updateResponse.status !== 204) {
            const errorText = await updateResponse.text();
            throw new Error(`Failed to update rule: ${updateResponse.status} - ${errorText}`);
        }
        console.log('✅ Successfully updated business rule');
        // Reactivate the rule
        console.log('Reactivating rule...');
        const activateUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/workflows(${ruleId})/Microsoft.Dynamics.CRM.SetState`;
        const activateResponse = await fetch(activateUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            },
            body: JSON.stringify({
                "State": 1,  // Activated
                "Status": 2  // Activated
            })
        });
        if (activateResponse.ok || activateResponse.status === 204) {
            console.log('✅ Business rule activated successfully');
            return { success: true, ruleId: ruleId, message: 'Rule updated and activated' };
        } else {
            console.log('⚠️ Rule updated but activation failed - please activate manually');
            return { success: true, ruleId: ruleId, message: 'Rule updated but needs manual activation' };
        }
    } catch (error) {
        console.error('❌ Error updating business rule:', error);
        throw error;
    }
}

/**
 * API endpoint to update the existing revenue rule
 */
app.patch('/api/update-revenue-rule', async (req, res) => {
    try {
        console.log('🔧 Updating Opportunity Revenue Rule...');
        const result = await updateOpportunityRevenueRule();
        res.json({
            success: true,
            message: result.message,
            ruleId: result.ruleId,
            details: {
                triggerField: 'cpw_projectedcurtailmentquantity (Projected Curtailment Quantity)',
                formula: 'Revenue = Projected Curtailment Quantity (kW) × Program.Price per kW',
                targetField: 'estimatedvalue (Estimated Full Term Revenue)'
            }
        });
    } catch (error) {
        console.error('❌ Update revenue rule failed:', error);
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
    console.log(`   GET  /api/opportunity-fields`);
    console.log(`   GET  /api/search-fields/:entityName?search=term&type=fieldType`);
    console.log(`   POST /api/update-program/:programId`);
    console.log(`   GET  /api/program/:programId`);
    console.log(`   GET  /api/programs`);
    console.log(`   GET  /api/programs/search?name=ProgramName`);
    console.log(`   POST /api/update-ri-targeted-dispatch`);
    console.log(`   GET  /api/find-program-entity`);
    console.log(`   GET  /api/discover-entity`);
    console.log(`   POST /api/create-price-field`);
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