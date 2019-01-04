var redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io) {
  var sessionPath = '/temp_sessions/';
  //collaboration sessions
  var collaborations = {};

  //map from socketId to sessionId
  var socketIdToSessionId = {};
  //when connection event hanppends
  io.on('connection', (socket) => {
    let sessionId = socket.handshake.query['sessionId'];
    socketIdToSessionId[socket.id] = sessionId;
    //if sessionId is not in collaborations, it means no one does this problem before.
    // if(!(sessionId in collaborations)) {
    //   collaborations[sessionId] = {
    //     'participants': []
    //   };
    // }
    if(sessionId in collaborations) {
      collaborations[sessionId]['participants'].push(socket.id);
      let participants = collaborations[sessionId]['participants'];
      for(let i = 0; i < participants.length; i++) {
        io.to(participants[i]).emit('userChange', participants);
      }
    } else {
      redisClient.get(sessionPath + sessionId, (data) => {
        if(data) {
          console.log('session terminated previously, pulling back from redis');
          collaborations[sessionId] = {
            "participants": [],
            'cachedInstructions': JSON.parse(data)
          };
        } else {
          console.log('creating new session');
          collaborations[sessionId] = {
            'participants': [],
            'cachedInstructions': []
          };
        }
        collaborations[sessionId]['participants'].push(socket.id);
        let participants = collaborations[sessionId]['participants'];
        for(let i = 0; i < participants.length; i++) {
          io.to(participants[i]).emit('userChange', participants);
        }
        console.log(collaborations[sessionId]['participants']);
      });
    }
    //socket event listenners
    //delta is the change info
    //it records the row and colum of the changes
    socket.on('change', delta => {
      console.log("change" + socketIdToSessionId[socket.id] + ": " + delta);
      let sessionId = socketIdToSessionId[socket.id];
      if(sessionId in collaborations) {
        collaborations[sessionId]['cachedInstructions'].push(["change", delta, Date.now()]);
        let participants = collaborations[sessionId]['participants'];
        for(let i = 0; i < participants.length; i++) {
          if(socket.id != participants[i]) {
            io.to(participants[i]).emit("change", delta);
          }
        }
      } else {
        console.log("warning: cloud not find socket id in collaborations");
      }
    });

    //when receive restoreBuffer event from redisClient
    socket.on('restorBuffer', () => {
      let sessionId = socketIdToSessionId[socket.id];
      console.log('restore buffer for session: ' + sessionId + ', socket: ' +
      socket.id);
      if(sessionId in collaborations) {
        let instructions = collaborations[sessionId]['cachedInstructions'];
        for(let i = 0; i < instructions.length; i++) {
          socket.emit(instructions[i][0], instructions[i][1]);
        }
      } else {
        console.log('no collaboration found for this socket');
      }
    })

    //when client disconnect from the server
    socket.on('disconnect', () => {
      let sessionId = socketIdToSessionId[socket.id];
      console.log('disconnect session: ' + sessionId + ', socket: ' + socket.id);
      console.log(collaborations[sessionId]['participants']);

      let foundAndRemoved = false;

      if(sessionId in collaborations) {
        let participants = collaborations[sessionId]['participants'];
        let index = participants.indexOf(socket.id);

        if(index >= 0) {
          participants.splice(index, 1);
          foundAndRemoved = true;

          if(participants.length === 0) {
            console.log('last participant in leaving, commit to redis');

            let key = sessionPath + sessionId;
            let value = JSON.stringify(
              collaborations[sessionId]['cachedInstructions']);

              redisClient.set(key, value, redisClient.redisPrint);
              redisClient.expire(key, TIMEOUT_IN_SECONDS);
              delete collaborations[sessionId];
            }
        }
          for(let i = 0; i < participants.length; i++) {
            io.to(participants[i]).emit('userChange', participants);
          }
        }
        if(!foundAndRemoved) {
          console.log('warning: could not find socket id in collaborations');
        }
    });
  })
}
