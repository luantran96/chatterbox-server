var Messages = {


  _data: {},

  items: function() {
    return _.chain(Object.values(Messages._data)).sortBy('createdAt');
  },

  objectIDgenerator: function(message) {
    message.objectId = Date.now();
  },
  
  add: function(message, callback = ()=>{}) {
    Messages.objectIDgenerator(message);
    
    Messages._data[message.objectId] = message;
    callback(Messages.items());
  },

  update: function(messages, callback = ()=>{}) {
    
    console.log('_data before update:' ,Messages._data);
    var length = Object.keys(Messages._data).length;
    
    for (let message of messages) {
      Messages._data[message.objectId] = Messages._conform(message);   
    }
    console.log('_data after update:' ,Messages._data);
    console.log('length: ', length);
    console.log('messages.length: ', messages.length);
    
    // only invoke the callback if something changed
    if (Object.keys(Messages._data).length !== length) {
      callback(Messages.items());
    }
  },

  _conform: function(message) {
    // ensure each message object conforms to expected shape
    message.text = message.text || '';
    message.username = message.username || '';
    message.roomname = message.roomname || '';
    return message;
  }
  
};