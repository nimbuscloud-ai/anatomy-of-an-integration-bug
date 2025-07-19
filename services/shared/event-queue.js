const fs = require('fs');
const path = require('path');

class EventQueue {
  static EVENTS_FILE = process.env.EVENTS_FILE || '/tmp/events.jsonl';
  
  static publish(eventName, payload) {
    const event = {
      eventName,
      payload,
      timestamp: new Date().toISOString()
    };
    
    const eventLine = JSON.stringify(event) + '\n';
    fs.appendFileSync(this.EVENTS_FILE, eventLine, 'utf8');
  }

  static consume() {
    if (!fs.existsSync(this.EVENTS_FILE)) {
      return [];
    }

    const content = fs.readFileSync(this.EVENTS_FILE, 'utf8');
    
    // Clear the file after reading
    fs.writeFileSync(this.EVENTS_FILE, '', 'utf8');
    
    if (!content.trim()) {
      return [];
    }

    return content.trim().split('\n').map(line => JSON.parse(line));
  }

  static clear() {
    if (fs.existsSync(this.EVENTS_FILE)) {
      fs.unlinkSync(this.EVENTS_FILE);
    }
  }
}

module.exports = EventQueue;