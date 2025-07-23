# Creating Custom Fields Programmatically in Dynamics 365

This guide explains how to create custom fields in Dynamics 365 using the Web API, specifically for the CPower pricing integration project.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Required Custom Fields](#required-custom-fields)
- [Creating Fields via Web API](#creating-fields-via-web-api)
- [Implementation in Node.js](#implementation-in-nodejs)
- [Step-by-Step Instructions](#step-by-step-instructions)
- [Troubleshooting](#troubleshooting)
- [References](#references)

## Overview

Dynamics 365 allows you to create custom fields programmatically using the Web API. This approach is faster and more consistent than manual creation through the UI, and it ensures that field names and configurations are exactly as required.

## Prerequisites

Before creating custom fields, ensure you have:
1. **Valid Authentication** - OAuth token with appropriate permissions
2. **Entity Logical Name** - The API name of your entity (e.g., `cpw_program`)
3. **Publisher Prefix** - Your organization's customization prefix (e.g., `cpw_`)
4. **Solution Name** - (Optional) The solution to add the fields to

## Required Custom Fields

For the CPower pricing integration, we need three custom fields on the Program entity:

| Field Name | Type | Description |
|------------|------|-------------|
| `cpw_priceperkw` | Money/Currency | Stores the price per kilowatt |
| `cpw_lastupdated` | DateTime | Tracks when the price was last updated |
| `cpw_updatesource` | String | Identifies the source of the update |

## Creating Fields via Web API

### 1. Money/Currency Field (cpw_priceperkw)

```http
POST https://[your-org].api.crm.dynamics.com/api/data/v9.2/EntityDefinitions(LogicalName='cpw_program')/Attributes
Authorization: Bearer [your-token]
Content-Type: application/json
OData-MaxVersion: 4.0
OData-Version: 4.0

{
  "@odata.type": "Microsoft.Dynamics.CRM.MoneyAttributeMetadata",
  "AttributeType": "Money",
  "AttributeTypeName": {
    "Value": "MoneyType"
  },
  "Description": {
    "@odata.type": "Microsoft.Dynamics.CRM.Label",
    "LocalizedLabels": [
      {
        "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
        "Label": "Price per kilowatt for the program",
        "LanguageCode": 1033
      }
    ]
  },
  "DisplayName": {
    "@odata.type": "Microsoft.Dynamics.CRM.Label",
    "LocalizedLabels": [
      {
        "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
        "Label": "Price per kW",
        "LanguageCode": 1033
      }
    ]
  },
  "SchemaName": "cpw_priceperkw",
  "RequiredLevel": {
    "Value": "None",
    "CanBeChanged": true
  },
  "PrecisionSource": 2,
  "ImeMode": "Disabled"
}
```

### 2. DateTime Field (cpw_lastupdated)

```http
POST https://[your-org].api.crm.dynamics.com/api/data/v9.2/EntityDefinitions(LogicalName='cpw_program')/Attributes
Authorization: Bearer [your-token]
Content-Type: application/json
OData-MaxVersion: 4.0
OData-Version: 4.0

{
  "@odata.type": "Microsoft.Dynamics.CRM.DateTimeAttributeMetadata",
  "AttributeType": "DateTime",
  "AttributeTypeName": {
    "Value": "DateTimeType"
  },
  "Description": {
    "@odata.type": "Microsoft.Dynamics.CRM.Label",
    "LocalizedLabels": [
      {
        "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
        "Label": "Date and time when the price was last updated",
        "LanguageCode": 1033
      }
    ]
  },
  "DisplayName": {
    "@odata.type": "Microsoft.Dynamics.CRM.Label",
    "LocalizedLabels": [
      {
        "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
        "Label": "Last Updated",
        "LanguageCode": 1033
      }
    ]
  },
  "SchemaName": "cpw_lastupdated",
  "RequiredLevel": {
    "Value": "None",
    "CanBeChanged": true
  },
  "Format": "DateAndTime",
  "DateTimeBehavior": {
    "Value": "UserLocal"
  },
  "ImeMode": "Disabled"
}
```

### 3. String Field (cpw_updatesource)

```http
POST https://[your-org].api.crm.dynamics.com/api/data/v9.2/EntityDefinitions(LogicalName='cpw_program')/Attributes
Authorization: Bearer [your-token]
Content-Type: application/json
OData-MaxVersion: 4.0
OData-Version: 4.0

{
  "@odata.type": "Microsoft.Dynamics.CRM.StringAttributeMetadata",
  "AttributeType": "String",
  "AttributeTypeName": {
    "Value": "StringType"
  },
  "Description": {
    "@odata.type": "Microsoft.Dynamics.CRM.Label",
    "LocalizedLabels": [
      {
        "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
        "Label": "Source system or user that updated the price",
        "LanguageCode": 1033
      }
    ]
  },
  "DisplayName": {
    "@odata.type": "Microsoft.Dynamics.CRM.Label",
    "LocalizedLabels": [
      {
        "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
        "Label": "Update Source",
        "LanguageCode": 1033
      }
    ]
  },
  "SchemaName": "cpw_updatesource",
  "RequiredLevel": {
    "Value": "None",
    "CanBeChanged": true
  },
  "MaxLength": 100,
  "Format": {
    "Value": "Text"
  },
  "ImeMode": "Auto"
}
```

## Implementation in Node.js

Add this function to your `dynamics-server.js` file:

```javascript
/**
 * Create custom fields for the Program entity
 */
async function createCustomFields() {
    try {
        const accessToken = await getAccessToken();
        const baseUrl = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/EntityDefinitions(LogicalName='${PROGRAM_CONFIG.entityName}')/Attributes`;
        
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Accept': 'application/json'
        };
        
        // Field definitions
        const fields = [
            {
                name: 'Price per kW',
                schema: PROGRAM_CONFIG.priceField,
                body: {
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
                }
            },
            {
                name: 'Last Updated',
                schema: PROGRAM_CONFIG.lastUpdatedField,
                body: {
                    "@odata.type": "Microsoft.Dynamics.CRM.DateTimeAttributeMetadata",
                    "AttributeType": "DateTime",
                    "AttributeTypeName": { "Value": "DateTimeType" },
                    "Description": {
                        "@odata.type": "Microsoft.Dynamics.CRM.Label",
                        "LocalizedLabels": [{
                            "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                            "Label": "Date and time when the price was last updated",
                            "LanguageCode": 1033
                        }]
                    },
                    "DisplayName": {
                        "@odata.type": "Microsoft.Dynamics.CRM.Label",
                        "LocalizedLabels": [{
                            "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                            "Label": "Last Updated",
                            "LanguageCode": 1033
                        }]
                    },
                    "SchemaName": PROGRAM_CONFIG.lastUpdatedField,
                    "RequiredLevel": { "Value": "None", "CanBeChanged": true },
                    "Format": "DateAndTime",
                    "DateTimeBehavior": { "Value": "UserLocal" },
                    "ImeMode": "Disabled"
                }
            },
            {
                name: 'Update Source',
                schema: PROGRAM_CONFIG.updateSourceField,
                body: {
                    "@odata.type": "Microsoft.Dynamics.CRM.StringAttributeMetadata",
                    "AttributeType": "String",
                    "AttributeTypeName": { "Value": "StringType" },
                    "Description": {
                        "@odata.type": "Microsoft.Dynamics.CRM.Label",
                        "LocalizedLabels": [{
                            "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                            "Label": "Source system or user that updated the price",
                            "LanguageCode": 1033
                        }]
                    },
                    "DisplayName": {
                        "@odata.type": "Microsoft.Dynamics.CRM.Label",
                        "LocalizedLabels": [{
                            "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                            "Label": "Update Source",
                            "LanguageCode": 1033
                        }]
                    },
                    "SchemaName": PROGRAM_CONFIG.updateSourceField,
                    "RequiredLevel": { "Value": "None", "CanBeChanged": true },
                    "MaxLength": 100,
                    "Format": { "Value": "Text" },
                    "ImeMode": "Auto"
                }
            }
        ];
        
        const results = [];
        
        for (const field of fields) {
            try {
                console.log(`Creating field: ${field.name}...`);
                
                const response = await fetch(baseUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(field.body)
                });
                
                if (response.ok) {
                    console.log(`✅ Successfully created field: ${field.name}`);
                    results.push({ field: field.name, success: true });
                } else {
                    const errorText = await response.text();
                    console.error(`❌ Failed to create field ${field.name}:`, errorText);
                    results.push({ field: field.name, success: false, error: errorText });
                }
            } catch (error) {
                console.error(`❌ Error creating field ${field.name}:`, error);
                results.push({ field: field.name, success: false, error: error.message });
            }
        }
        
        return results;
        
    } catch (error) {
        console.error('❌ Error in createCustomFields:', error);
        throw error;
    }
}

// Add this API endpoint to your Express app
app.post('/api/setup-fields', async (req, res) => {
    try {
        console.log('🔧 Setting up custom fields...');
        const results = await createCustomFields();
        
        const allSuccessful = results.every(r => r.success);
        
        res.json({ 
            success: allSuccessful,
            message: allSuccessful 
                ? 'All custom fields created successfully!' 
                : 'Some fields failed to create',
            results: results
        });
        
    } catch (error) {
        console.error('❌ Setup fields failed:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});
```

## Step-by-Step Instructions

1. **Start your proxy server**
   ```bash
   npm start
   ```

2. **Create the custom fields**
   ```bash
   curl -X POST http://localhost:3001/api/setup-fields
   ```

3. **Verify field creation**
   - Check the response for success status
   - Fields will be created but not yet published

4. **Publish the customizations**
   - This can be done manually in Dynamics 365
   - Or programmatically using the PublishAllXml action

5. **Continue with your integration**
   - Now you can search for programs
   - Update pricing values
   - The fields will be available immediately via API

## Troubleshooting

### Common Issues

1. **"Field already exists" error**
   - The field has already been created
   - You can proceed with using the field

2. **"Insufficient privileges" error**
   - The service account needs System Administrator or System Customizer role
   - Check the account permissions in Dynamics 365

3. **"Invalid entity name" error**
   - Verify the entity logical name in PROGRAM_CONFIG
   - Ensure the entity exists in your environment

4. **"Invalid schema name" error**
   - Schema names must start with your publisher prefix
   - Cannot contain spaces or special characters
   - Must be unique within the entity

### Checking Field Existence

To check if a field already exists before creating:

```javascript
async function fieldExists(fieldName) {
    try {
        const accessToken = await getAccessToken();
        const url = `${DYNAMICS_CONFIG.baseUrl}/api/data/v9.2/EntityDefinitions(LogicalName='${PROGRAM_CONFIG.entityName}')/Attributes(LogicalName='${fieldName}')`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        });
        
        return response.ok;
    } catch (error) {
        return false;
    }
}
```

## References

- [Create and update column definitions using the Web API](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/create-update-column-definitions-using-web-api)
- [Web API table schema operations](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/web-api-metadata-operations-sample)
- [Customize entity attribute metadata](https://learn.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/customize-entity-attribute-metadata)
- [MoneyAttributeMetadata EntityType](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/moneyattributemetadata)