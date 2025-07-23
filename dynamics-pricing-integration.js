// pricing-dynamics-integration.js
// Add this script to your existing pricing table HTML file
// Handles the client-side integration with the Dynamics 365 proxy server

/**
 * Dynamics 365 Integration Module
 * Connects your pricing table editor to Dynamics 365 via proxy server
 */
const DynamicsIntegration = {
    config: {
        serverUrl: 'http://localhost:3001', // Your proxy server URL
        
        // Program mappings - you'll need to get actual GUIDs from Dynamics 365
        programMappings: {
            'Rhode Island Connected Solutions-Targeted Dispatch': {
                id: '510104b7-a1bb-ea11-a812-000d3a1bb080', // REPLACE WITH ACTUAL GUID
                name: 'Rhode Island Connected Solutions-Targeted Dispatch'
            }
            // Add more programs as needed
        }
    },
    
    /**
     * Initialize the integration
     */
    async init() {
        console.log('🔌 Initializing Dynamics 365 Integration...');
        
        // Test connection on startup
        const connected = await this.testConnection();
        if (connected) {
            console.log('✅ Dynamics 365 integration ready');
            this.addTestButton();
        } else {
            console.warn('⚠️ Dynamics 365 connection failed - integration disabled');
        }
        
        // Override the original confirm function
        if (typeof confirmPriceChange === 'function') {
            window.originalConfirmPriceChange = confirmPriceChange;
            window.confirmPriceChange = this.enhancedConfirmPriceChange.bind(this);
            console.log('✅ Enhanced price change confirmation enabled');
        }
    },
    
    /**
     * Test connection to Dynamics 365 proxy server
     */
    async testConnection() {
        try {
            console.log('🧪 Testing Dynamics 365 connection...');
            
            const response = await fetch(`${this.config.serverUrl}/api/test-connection`);
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Connection successful:', result.message);
                return true;
            } else {
                console.error('❌ Connection failed:', result.error);
                return false;
            }
        } catch (error) {
            console.error('❌ Connection test error:', error.message);
            return false;
        }
    },
    
    /**
     * Enhanced confirm price change with Dynamics 365 integration
     */
    async enhancedConfirmPriceChange() {
        if (!pendingChange) {
            console.log('No pending change found');
            return;
        }
        
        const { input, path, newValue, oldValue } = pendingChange;
        
        try {
            // Check if this is a program we should sync to Dynamics 365
            const programInfo = this.extractProgramInfo(path);
            
            if (programInfo && this.config.programMappings[programInfo.programName]) {
                await this.updateProgramInDynamics(programInfo, newValue, path);
            } else {
                // Use original logic for non-Dynamics programs
                console.log('Using original price change logic for:', path);
                await this.originalPriceChangeLogic();
            }
            
        } catch (error) {
            console.error('❌ Error in enhanced price change:', error);
            
            // Revert changes on error
            input.value = oldValue;
            updateSaveStatus('❌ Update Failed', 'error');
            alert(`Failed to update pricing: ${error.message}`);
        } finally {
            // Clean up
            pendingChange = null;
            isModalOpen = false;
            document.getElementById('confirmationModal').style.display = 'none';
        }
    },
    
    /**
     * Update program pricing in Dynamics 365
     */
    async updateProgramInDynamics(programInfo, newValue, path) {
        const programMapping = this.config.programMappings[programInfo.programName];
        
        console.log(`🎯 Updating ${programInfo.programName} in Dynamics 365...`);
        
        // Special handling for Rhode Island Targeted Dispatch
        if (programInfo.programName === 'Rhode Island Connected Solutions-Targeted Dispatch') {
            updateSaveStatus('🎯 Updating RI Targeted Dispatch...', 'saving');
            await this.updateRITargetedDispatch(programMapping.id, newValue, programInfo.year);
        } else {
            updateSaveStatus('📡 Updating Dynamics 365...', 'saving');
            await this.updateGenericProgram(programMapping.id, newValue, programInfo);
        }
        
        // Update local data and save file
        setNestedValue(currentData, path, newValue);
        pendingChange.input.dataset.originalValue = newValue;
        
        await savePricingData();
        
        updateSaveStatus('✅ Updated & Synced', 'saved');
        pendingChange.input.classList.remove('changed');
    },
    
    /**
     * Update Rhode Island Targeted Dispatch (special EUREKA handling)
     */
    async updateRITargetedDispatch(programId, pricePerKw, year) {
        try {
            console.log('🎯 EUREKA MOMENT: Updating Rhode Island Targeted Dispatch!');
            
            const response = await fetch(`${this.config.serverUrl}/api/update-ri-targeted-dispatch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    programId: programId,
                    pricePerKw: pricePerKw,
                    year: year
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('🎉 EUREKA! Rhode Island pricing updated successfully!');
                
                // Show celebration
                setTimeout(() => {
                    alert(`🎉 EUREKA MOMENT! 🎉\n\nRhode Island Connected Solutions Targeted Dispatch\nhas been updated to $${pricePerKw}/kW for ${year}\n\nDynamics 365 Program Record: ${programId}\n\nThe opportunity revenue calculation will now work!`);
                }, 1000);
                
                return true;
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            console.error('❌ Failed to update Rhode Island:', error);
            throw error;
        }
    },
    
    /**
     * Update generic program in Dynamics 365
     */
    async updateGenericProgram(programId, pricePerKw, programInfo) {
        try {
            const requestData = {
                pricePerKw: pricePerKw
            };
            
            if (programInfo.year) {
                requestData.year = programInfo.year;
            }
            
            const response = await fetch(`${this.config.serverUrl}/api/update-program/${programId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log(`✅ Updated ${programInfo.programName} in Dynamics 365`);
                return true;
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            console.error('❌ Failed to update program:', error);
            throw error;
        }
    },
    
    /**
     * Extract program information from the data path
     */
    extractProgramInfo(path) {
        // Parse paths like: "isoneRates.connectedSolutions.Rhode Island.targetedDispatch.25-26"
        const pathParts = path.split('.');
        
        if (pathParts[0] === 'isoneRates' && pathParts[1] === 'connectedSolutions') {
            const state = pathParts[2];
            const dispatchType = pathParts[3];
            const yearPart = pathParts[4];
            
            // Convert dispatch type to proper case
            const formattedDispatchType = dispatchType.charAt(0).toUpperCase() + dispatchType.slice(1);
            
            return {
                programName: `${state} Connected Solutions-${formattedDispatchType} Dispatch`,
                region: 'ISO-NE',
                state: state,
                dispatchType: dispatchType,
                year: yearPart ? `20${yearPart}` : null
            };
        }
        
        // Add more program path parsing as needed
        // if (pathParts[0] === 'nyisoRates' && pathParts[1] === 'scr') { ... }
        // if (pathParts[0] === 'ercotRates' && pathParts[1] === 'captag4cp') { ... }
        
        return null;
    },
    
    /**
     * Original price change logic for non-Dynamics programs
     */
    async originalPriceChangeLogic() {
        if (window.originalConfirmPriceChange) {
            await window.originalConfirmPriceChange();
        } else {
            // Fallback to basic logic
            const { input, path, newValue } = pendingChange;
            setNestedValue(currentData, path, newValue);
            input.dataset.originalValue = newValue;
            await savePricingData();
            input.classList.remove('changed');
        }
    },
    
    /**
     * Find program ID by searching Dynamics 365
     */
    async findProgramId(programName) {
        try {
            const response = await fetch(`${this.config.serverUrl}/api/programs/search?name=${encodeURIComponent(programName)}`);
            const result = await response.json();
            
            if (result.success && result.programs.length > 0) {
                return result.programs[0].cpw_programid;
            } else {
                console.warn(`Program not found: ${programName}`);
                return null;
            }
        } catch (error) {
            console.error('Error finding program:', error);
            return null;
        }
    },
    
    /**
     * Add test button to the interface
     */
    addTestButton() {
        const testButton = document.createElement('button');
        testButton.textContent = '🧪 Test Dynamics Connection';
        testButton.style.cssText = `
            position: fixed; 
            top: 10px; 
            right: 10px; 
            z-index: 1000; 
            padding: 10px 15px; 
            background: #007B86; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer;
            font-family: inherit;
            font-size: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        
        testButton.onclick = async () => {
            const connected = await this.testConnection();
            if (connected) {
                alert('✅ Dynamics 365 connection is working!');
            } else {
                alert('❌ Dynamics 365 connection failed. Check console for details.');
            }
        };
        
        document.body.appendChild(testButton);
    }
};

/**
 * Initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        DynamicsIntegration.init();
    }, 1000);
});

/**
 * Manual initialization function (if needed)
 */
window.initDynamicsIntegration = function() {
    DynamicsIntegration.init();
};

/**
 * Export for global access
 */
window.DynamicsIntegration = DynamicsIntegration;