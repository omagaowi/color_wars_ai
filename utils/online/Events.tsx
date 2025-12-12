import {
  handleEnded,
  handlePlay,
  handlePlayerDisconnect,
  handleResults,
  handleTimeout,
} from "../../pages/Game/OnlineGame";
import {
  handleConnectErrors,
  handleEndedLobby,
  handleStartEvent,
  handleUserEvents,
} from "../../pages/Options/Lobby";

const Events = (socket) => {
  socket.on("users", (data) => {
    //  console.log(data)
    if (window.location.href.split("/")[4] == "lobby") {
      handleUserEvents(data);
    } else if( window.location.href.split("/")[4] == "game" ) {
      handlePlayerDisconnect(data);
    }
  });
  socket.on("joinError", (data) => {
    handleConnectErrors(data);
  });
  socket.on("startGame", (data) => {
    handleStartEvent(data);
  });
  socket.on("play", (data) => {
    console.log('play')
    handlePlay(data);
  });

  socket.on("ended", (msg) => {
    if (window.location.href.split("/")[4] == "lobby") {
      handleEndedLobby(msg);
    } else if(window.location.href.split("/")[4] == 'game') {
      handleEnded(msg);
    }
  });

  socket.on("results", (data) => {
    handleResults(data);
  });

  socket.on("timeout", (data) => {
    handleTimeout(data);
  });
};

export default Events;
