const fs = require('fs');
const path = require('path');

const EVENTS_FILE = '/tmp/events.jsonl';

class EventQueue {
  static publish(eventName, payload) {
    const event = {
      eventName,
      payload,
      timestamp: new Date().toISOString()
    };
    
    const eventLine = JSON.stringify(event) + '\n';
    fs.appendFileSync(EVENTS_FILE, eventLine, 'utf8');
  }

  static consume() {
    if (!fs.existsSync(EVENTS_FILE)) {
      return [];
    }

    const content = fs.readFileSync(EVENTS_FILE, 'utf8');
    
    // Clear the file after reading
    fs.writeFileSync(EVENTS_FILE, '', 'utf8');
    
    if (!content.trim()) {
      return [];
    }

    return content.trim().split('\n').map(line => JSON.parse(line));
  }

  static clear() {
    if (fs.existsSync(EVENTS_FILE)) {
      fs.unlinkSync(EVENTS_FILE);
    }
  }
}

module.exports = EventQueue;