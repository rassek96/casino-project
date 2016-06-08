module.exports = function(io) {
  io.on("connection", function(socket) {
    socket.on("changeChips", function(data) {
      socket.handshake.session.chips = data.chips;
    });
  });
};
