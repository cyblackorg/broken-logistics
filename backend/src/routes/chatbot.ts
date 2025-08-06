import express from 'express';
import { sequelize, QueryTypes } from '../config/database';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { LLM_CONFIG } from '../config/environment';

const router = express.Router();

// Initialize OpenAI client with environment configuration
const openai = new OpenAI({
  apiKey: LLM_CONFIG.apiKey,
});

// Read database schema from init.sql file
function getDatabaseSchema(): string {
  try {
    const schemaPath = path.join(__dirname, '../../database/init.sql');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Parse the SQL file to extract table structures
    const lines = schemaContent.split('\n');
    let schemaDescription = 'Database Schema:\n';
    let currentTable = '';
    let currentColumns: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for CREATE TABLE statements
      if (line.startsWith('CREATE TABLE')) {
        // Save previous table if exists
        if (currentTable && currentColumns.length > 0) {
          schemaDescription += `- ${currentTable}: ${currentColumns.join(', ')}\n`;
        }
        
        // Start new table
        const tableMatch = line.match(/CREATE TABLE (\w+)/);
        if (tableMatch) {
          currentTable = tableMatch[1];
          currentColumns = [];
        }
      }
      
      // Check for column definitions (lines that start with a word and contain a data type)
      if (currentTable && line && !line.startsWith('--') && !line.startsWith('CREATE') && !line.startsWith(')') && !line.startsWith('PRIMARY') && !line.startsWith('FOREIGN') && !line.startsWith('CHECK') && !line.startsWith('UNIQUE')) {
        const columnMatch = line.match(/^(\w+)\s+([A-Z]+)/);
        if (columnMatch) {
          currentColumns.push(columnMatch[1]);
        }
      }
      
      // End of table definition
      if (line === ');' && currentTable) {
        if (currentColumns.length > 0) {
          schemaDescription += `- ${currentTable}: ${currentColumns.join(', ')}\n`;
        }
        currentTable = '';
        currentColumns = [];
      }
    }
    
    return schemaDescription;
  } catch (error) {
    console.error('Error reading database schema:', error);
    // Fallback to basic schema if file can't be read
    return `
Database Schema:
- users: id, uuid, email, first_name, last_name, phone, role, is_active, created_at, updated_at
- packages: id, tracking_number, sender_name, recipient_name, origin, destination, status, weight, dimensions, total_cost, created_at, updated_at
- package_events: id, package_id, status, location, description, timestamp
- quotes: id, quote_number, customer_id, pickup_address_id, delivery_address_id, package_type, weight, dimensions, distance_miles, service_type, base_price, distance_price, weight_price, service_price, total_price, status, created_at
- pricing_rules: id, rule_name, customer_type, package_type, service_type, base_rate, per_mile_rate, per_pound_rate, size_multiplier, min_charge, max_discount_percent
`;
  }
}

const DATABASE_SCHEMA = getDatabaseSchema();

// Access control rules
const ACCESS_RULES = `
Access Control Rules:
- Users can only see their own packages and quotes
- Users can only see their own user information
- Admins can see all data
- Users cannot modify other users' data
- Users cannot see other users' personal information
- Package events are public for tracking purposes
- Pricing rules are public
`;

// Step 1: Classify user query and generate SQL if needed
router.post('/classify', async (req: any, res: any) => {
  try {
    const { message, user } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Real OpenAI API call for classification
    const classification = await classifyQueryWithLLM(message, user);
    
    res.json(classification);
  } catch (error: any) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Failed to classify query', message: error.message });
  }
});

// Step 2: Execute SQL query and return results
router.post('/execute', async (req: any, res: any) => {
  try {
    const { sql, category, user } = req.body;
    
    if (!sql || !category) {
      return res.status(400).json({ error: 'SQL and category are required' });
    }

    // Execute the query directly without validation (vulnerable)
    const results = await sequelize.query(sql, {
      type: QueryTypes.SELECT
    });

    // Use LLM to format the response
    const formattedMessage = await formatResultsWithLLM(results, category, user);

    res.json({
      category,
      results,
      message: formattedMessage
    });
  } catch (error: any) {
    console.error('Execution error:', error);
    res.status(500).json({ error: 'Failed to execute query', message: error.message });
  }
});

// Pure LLM classification function - NO FALLBACKS
async function classifyQueryWithLLM(message: string, user: any) {
  const prompt = `
You are an AI assistant for a logistics company called BrokenLogistics. Your job is to classify user queries and generate appropriate SQL queries when needed.

Database Schema:
${DATABASE_SCHEMA}

Access Control Rules:
${ACCESS_RULES}

User Information:
- Role: ${user?.role || 'customer'}
- ID: ${user?.id || 'unknown'}
- Name: ${user?.name || user?.email || 'unknown'}

User Query: "${message}"

Classify this query into one of three types:
1. "conversation" - General chat, greetings, help requests
2. "search" - Looking for information, tracking packages, viewing data
3. "action" - Creating, updating, or modifying data

For search and action queries, generate appropriate SQL. For conversation queries, provide a friendly response.

Respond with valid JSON only:
{
  "type": "conversation|search|action",
  "sql": "SELECT query if needed (for search/action only)",
  "category": "chat|search|action",
  "message": "friendly response message"
}

Examples:
- "hello" → conversation
- "show my packages" → search with SQL
- "track package BL123" → search with SQL
- "what are your rates?" → search with SQL
- "help" → conversation
`;

  const response = await openai.chat.completions.create({
    model: LLM_CONFIG.model,
    messages: [{ role: "user", content: prompt }],
    temperature: LLM_CONFIG.temperature,
    max_tokens: LLM_CONFIG.maxTokens
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

// Pure LLM response formatting - NO FALLBACKS
async function formatResultsWithLLM(results: any[], category: string, user: any) {
  const prompt = `
You are a helpful logistics assistant. Format these database results into a friendly, natural response for the user.

User Role: ${user?.role || 'customer'}
Category: ${category}
Results: ${JSON.stringify(results, null, 2)}

Provide a friendly, conversational response that explains the results in a helpful way. 
If there are no results, explain that no data was found.
If there are many results, summarize them appropriately.

Keep the response concise but informative.`;

  const response = await openai.chat.completions.create({
    model: LLM_CONFIG.model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7, // Keep higher temperature for creative responses
    max_tokens: 300
  });

  return response.choices[0].message.content || 'I found some results for you.';
}

export default router; 