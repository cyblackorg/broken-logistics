import express from 'express';
import { sequelize, QueryTypes } from '../config/database';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Database schema for the AI to understand
const DATABASE_SCHEMA = `
Database Schema:
- users: id, uuid, email, first_name, last_name, phone, role, is_active, created_at, updated_at
- packages: id, tracking_number, sender_name, recipient_name, origin, destination, status, weight, dimensions, total_cost, created_at, updated_at
- package_events: id, package_id, status, location, description, timestamp
- quotes: id, quote_number, customer_id, pickup_address_id, delivery_address_id, package_type, weight, dimensions, distance_miles, service_type, base_price, distance_price, weight_price, service_price, total_price, status, created_at
- pricing_rules: id, rule_name, customer_type, package_type, service_type, base_rate, per_mile_rate, per_pound_rate, size_multiplier, min_charge, max_discount_percent
`;

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

    // Mock OpenAI API call - in real implementation, this would call OpenAI
    const classification = await classifyQuery(message, user);
    
    res.json(classification);
  } catch (error: any) {
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

    // Validate SQL query for security
    const validatedSql = validateAndSanitizeSQL(sql, user);
    if (!validatedSql) {
      return res.status(403).json({ 
        error: 'Query not permitted',
        message: 'This query is not allowed for security reasons.'
      });
    }

    // Execute the query
    const results = await sequelize.query(validatedSql, {
      type: QueryTypes.SELECT
    });

    res.json({
      category,
      results,
      message: generateFriendlyMessage(category, results)
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to execute query', message: error.message });
  }
});

// Mock OpenAI classification function
async function classifyQuery(message: string, user: any) {
  const lowerMessage = message.toLowerCase();
  
  // Check for conversation queries
  if (isConversationQuery(lowerMessage)) {
    return {
      type: 'conversation',
      response: generateConversationResponse(lowerMessage),
      category: 'chat'
    };
  }

  // Check for search queries
  if (isSearchQuery(lowerMessage)) {
    const sql = generateSearchSQL(lowerMessage, user);
    return {
      type: 'search',
      sql,
      category: 'search',
      message: generateSearchMessage(lowerMessage)
    };
  }

  // Check for action queries
  if (isActionQuery(lowerMessage)) {
    const sql = generateActionSQL(lowerMessage, user);
    return {
      type: 'action',
      sql,
      category: 'action',
      message: generateActionMessage(lowerMessage)
    };
  }

  // Default to conversation
  return {
    type: 'conversation',
    response: "I'm here to help with shipping questions, package tracking, and account management. How can I assist you today?",
    category: 'chat'
  };
}

function isConversationQuery(message: string): boolean {
  const conversationKeywords = [
    'hello', 'hi', 'hey', 'thanks', 'thank you', 'goodbye', 'bye',
    'how are you', 'what can you do', 'help', 'support'
  ];
  return conversationKeywords.some(keyword => message.includes(keyword));
}

function isSearchQuery(message: string): boolean {
  const searchKeywords = [
    'find', 'search', 'show', 'list', 'get', 'what', 'where', 'when',
    'track', 'package', 'shipment', 'quote', 'price', 'cost',
    'my packages', 'my shipments', 'my quotes'
  ];
  return searchKeywords.some(keyword => message.includes(keyword));
}

function isActionQuery(message: string): boolean {
  const actionKeywords = [
    'create', 'add', 'update', 'change', 'modify', 'delete', 'remove',
    'ship', 'send', 'track', 'update status'
  ];
  return actionKeywords.some(keyword => message.includes(keyword));
}

function generateSearchSQL(message: string, user: any): string {
  if (message.includes('my packages') || message.includes('my shipments')) {
    return `SELECT * FROM packages WHERE sender_name = '${user?.name || user?.email}' ORDER BY created_at DESC`;
  }
  
  if (message.includes('track') && message.includes('package')) {
    return `SELECT p.*, pe.status, pe.location, pe.description, pe.timestamp 
            FROM packages p 
            LEFT JOIN package_events pe ON p.id = pe.package_id 
            WHERE p.sender_name = '${user?.name || user?.email}' 
            ORDER BY p.created_at DESC, pe.timestamp DESC`;
  }
  
  if (message.includes('pricing') || message.includes('cost') || message.includes('rates')) {
    return `SELECT * FROM pricing_rules ORDER BY customer_type, package_type`;
  }
  
  if (message.includes('my quotes')) {
    return `SELECT * FROM quotes WHERE customer_id = ${user?.id || 0} ORDER BY created_at DESC`;
  }
  
  return `SELECT * FROM packages WHERE sender_name = '${user?.name || user?.email}' LIMIT 5`;
}

function generateActionSQL(message: string, user: any): string {
  // For now, return read-only queries as actions are more complex
  return `SELECT * FROM packages WHERE sender_name = '${user?.name || user?.email}' LIMIT 1`;
}

function validateAndSanitizeSQL(sql: string, user: any): string | null {
  // Basic SQL injection prevention
  const dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'CREATE', 'ALTER', 'TRUNCATE'];
  const upperSql = sql.toUpperCase();
  
  if (dangerousKeywords.some(keyword => upperSql.includes(keyword))) {
    return null;
  }
  
  // Ensure user can only access their own data (unless admin)
  if (user?.role !== 'admin') {
    if (sql.includes('users') && !sql.includes(`id = ${user?.id}`)) {
      return null;
    }
    if (sql.includes('packages') && !sql.includes(`sender_name = '${user?.name || user?.email}'`)) {
      return null;
    }
  }
  
  return sql;
}

function generateConversationResponse(message: string): string {
  if (message.includes('hello') || message.includes('hi')) {
    return "Hello! I'm your BrokenLogistics assistant. I can help you track packages, get shipping quotes, manage your account, and answer questions about our services. How can I help you today?";
  }
  
  if (message.includes('help')) {
    return "I can help you with:\n• Tracking your packages\n• Getting shipping quotes\n• Viewing your shipment history\n• Checking pricing and rates\n• Managing your account\n\nJust ask me anything!";
  }
  
  if (message.includes('thanks') || message.includes('thank you')) {
    return "You're welcome! Is there anything else I can help you with?";
  }
  
  if (message.includes('goodbye') || message.includes('bye')) {
    return "Goodbye! Have a great day and safe travels for your packages!";
  }
  
  return "I'm here to help with all your shipping needs. You can ask me to track packages, get quotes, check pricing, or manage your account. What would you like to do?";
}

function generateSearchMessage(message: string): string {
  if (message.includes('track')) {
    return "I'll show you your package tracking information.";
  }
  
  if (message.includes('packages') || message.includes('shipments')) {
    return "Here are your recent shipments.";
  }
  
  if (message.includes('pricing') || message.includes('rates')) {
    return "Here are our current pricing rates.";
  }
  
  return "I'll search for that information for you.";
}

function generateActionMessage(message: string): string {
  if (message.includes('ship') || message.includes('send')) {
    return "I can help you create a new shipment. Please visit the shipping page to fill out the details.";
  }
  
  return "I'll help you with that action.";
}

function generateFriendlyMessage(category: string, results: any[]): string {
  switch (category) {
    case 'search':
      if (results.length === 0) {
        return "I couldn't find any matching information. Please try a different search term.";
      }
      return `I found ${results.length} result(s) for you.`;
      
    case 'action':
      return "Action completed successfully!";
      
    default:
      return "Here's the information you requested.";
  }
}

export default router; 