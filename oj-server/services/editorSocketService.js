module.exports = function(io) {
  var collaborations = {};
  var socketIdToSessionId = {};
  //when connection event hanppends
  io.on('connection', (socket) => {
    let sessionId = socket.handshake.query['sessionId'];
    socketIdToSessionId[socket.id] = sessionId;
    //if sessionId is not in collaborations, it means no one does this problem before.
    if(!(sessionId in collaborations)) {
      collaborations[sessionId] = {
        'participants': []
      };
    }
    collaborations[sessionId]['participants'].push(socket.id);
    //socket event listenners
    //delta is the change info
    //it records the row and colum of the changes
    socket.on('change', delta => {
      console.log("change" + socketIdToSessionId[socket.id] + ": " + delta);
      let sessionId = socketIdToSessionId[socket.id];
      if(sessionId in collaborations) {
        let participants = collaborations[sessionId]['participants'];
        for(let i = 0; i < participants.length; i++) {
          if(socket.id != participants[i]) {
            io.to(participants[i]).emit("change", delta);
          }
        }
      } else {
        console.log("warning: cloud not find socket id in collaborations");
      }
    })
  })
}
