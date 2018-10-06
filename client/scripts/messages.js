var Messages = {


  _data: {},

  items: function() {
    return _.chain(Object.values(Messages._data));
  },

  objectIDgenerator: function(message) {
    message.objectId = Math.random() * Math.pow(2,10);
  },
  
  add: function(message, callback = ()=>{}) {
    Messages.objectIDgenerator(message);
    console.log('message.objectId: ', message.objectId);
    Messages._data[message.objectId] = message;
    callback(Messages.items());
  },

  update: function(messages, callback = ()=>{}) {
    var length = Object.keys(Messages._data).length;
    
    var counter = 0;
    
    for (let message of messages) {
      Messages.objectIDgenerator(message);
      Messages._data[message.objectId] = Messages._conform(message);
      counter++;
    }
    console.log('counter : ', counter);
    console.log('_data: ', Messages._data);
    
    callback(Messages._data);
    
    // only invoke the callback if something changed
    // if (Object.keys(Messages._data).length !== length) {
    //   callback(Messages.items());
    // }
  },

  _conform: function(message) {
    // ensure each message object conforms to expected shape
    message.text = message.text || '';
    message.username = message.username || '';
    message.roomname = message.roomname || '';
    return message;
  }
  
};