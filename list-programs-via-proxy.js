#!/usr/bin/env node

const axios = require('axios');
const colors = require('colors');

const PROXY_URL = 'http://localhost:3001';

async function listAllPrograms() {
    try {
        console.log('🚀 Fetching all programs via proxy server...'.yellow);
        
        // Make sure the proxy server is running
        try {
            await axios.get(`${PROXY_URL}/api/test-connection`);
        } catch (error) {
            console.error('❌ Proxy server is not running!'.red);
            console.error('Please start it with: npm start'.yellow);
            return;
        }
        
        // Fetch all programs
        const response = await axios.get(`${PROXY_URL}/api/programs`, {
            params: {
                top: 1000,
                orderby: 'createdon desc'
            }
        });
        
        if (response.data.programs && response.data.programs.length > 0) {
            const programs = response.data.programs;
            console.log(`\n✅ Found ${programs.length} programs:\n`.green);
            
            // Create a table format
            console.log('═'.repeat(120).blue);
            console.log('Program Name'.padEnd(50).cyan + ' | ' + 
                      'ID (GUID)'.padEnd(40).cyan + ' | ' + 
                      'Created Date'.padEnd(20).cyan);
            console.log('═'.repeat(120).blue);
            
            programs.forEach((program) => {
                const name = program.name || 'Unnamed';
                const id = program.id || 'No ID';
                const created = program.createdon ? new Date(program.createdon).toLocaleDateString() : 'N/A';
                
                // Highlight Rhode Island programs
                if (name.toLowerCase().includes('rhode island')) {
                    console.log(
                        ('⭐ ' + name.substring(0, 46)).padEnd(50).green + ' | ' + 
                        id.padEnd(40).yellow + ' | ' + 
                        created.padEnd(20).white
                    );
                } else {
                    console.log(
                        name.substring(0, 48).padEnd(50) + ' | ' + 
                        id.padEnd(40).gray + ' | ' + 
                        created.padEnd(20).gray
                    );
                }
            });
            console.log('═'.repeat(120).blue);
            
            // Summary
            console.log(`\n📊 Summary:`.yellow);
            console.log(`   Total Programs: ${programs.length}`.white);
            
            // Search for Rhode Island programs
            const riPrograms = programs.filter(p => 
                p.name && p.name.toLowerCase().includes('rhode island')
            );
            
            if (riPrograms.length > 0) {
                console.log(`\n🎯 Found ${riPrograms.length} Rhode Island program(s):`.yellow.bold);
                riPrograms.forEach(program => {
                    console.log(`\n   Program: ${program.name}`.green);
                    console.log(`   ID: ${program.id}`.cyan);
                    console.log(`   Created: ${program.createdon ? new Date(program.createdon).toLocaleDateString() : 'N/A'}`.gray);
                    console.log(`\n   📝 Copy this ID to update your integration file!`.yellow);
                });
            } else {
                console.log('\n⚠️  No Rhode Island programs found'.yellow);
                console.log('   You may need to create one in Dynamics 365 first.'.gray);
            }
            
        } else {
            console.log('\n⚠️  No programs found in the system'.yellow);
        }
        
    } catch (error) {
        console.error('\n❌ Error fetching programs:'.red);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Message:', error.response.data?.error || error.response.statusText);
        } else if (error.code === 'ECONNREFUSED') {
            console.error('Cannot connect to proxy server!'.red);
            console.error('\nPlease start the proxy server first:'.yellow);
            console.error('  npm start'.cyan);
        } else {
            console.error(error.message);
        }
    }
}

// Run the script
console.log('🔍 Rhode Island Targeted Dispatch - Program Listing Tool'.cyan.bold);
console.log('='.repeat(55).gray);

listAllPrograms()
    .then(() => {
        console.log('\n✅ Done!'.green);
    })
    .catch(error => {
        console.error('\n❌ Script failed:', error.message);
        process.exit(1);
    });