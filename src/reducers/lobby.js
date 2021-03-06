import {
  LOBBY_SNAPSHOT,
  PLAYER_JOINED,
  PLAYER_LEAVE,
  PLAYER_SLOT_CHANGED,
  STATUS_CHANGED,
  ALL_READY,
  HOST_CHANGED,
  SETTING_CHANGED,
  COLOR_CHANGED,
} from '../actions/lobby';
import {
  HELLO
} from '../actions/global';

const defaultState = {
  id: null,
  isReady: false,
  allReady: false,
  playerData: {},
  players: [],
  settings: []
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case HELLO:
      state = {...state,
        playerId: action.data.playerId,
        playerData: {...state.playerData,
          [action.data.playerId]: {
            status: 'Loading'
          }
        }
      };
      break;
    case PLAYER_JOINED:
      console.log('Player joined', action);
      state = {...state,
        playerData: {...state.playerData,
          [action.player.player]: {...action.player,
            id: action.player.player
          }
        }
      };
      break;
    case PLAYER_LEAVE:
      state = {...state,
        playerData: {...state.playerData},
      };
      delete state.playerData[action.data.player];
      break;
    case LOBBY_SNAPSHOT:
      console.log('snapshot', action);
      state = {...state,
        id: action.snapshot.id,
        settings: action.snapshot.settings,
        host: action.snapshot.host,
        slots: [],
        playerData: {}
      };
      action.snapshot.players.forEach(function (player) {
        state.playerData[player.id] = {...player,
          ready: player.status === 'Ready'
        };
      });
      break;
    case STATUS_CHANGED:
      state = {...state,
        playerData: {...state.playerData,
          [action.player]: {...state.playerData[action.player],
            ready: action.status === 'Ready',
            status: action.status
          }
        }
      };
      if (action.player === state.playerId) {
        state.isReady = action.status === 'Ready';
      }
      break;
    case COLOR_CHANGED:
      console.log('Color changed', action.data);
      state = {...state,
        playerData: {...state.playerData,
          [action.data.player]: {...state.playerData[action.data.player],
            color: action.data.to,
          }
        }
      };
      break;
    case ALL_READY:
      state = {...state,
        allReady: action.allReady
      };
      break;
    case HOST_CHANGED:
      console.log('The host changed', action.data.player);
      state = {...state,
        host: action.data.player
      };
      break;
    case SETTING_CHANGED:
      console.log('Host changed the settings...', action.data);
      state = {...state,
        settings: state.settings.map(function (setting) {
          if (setting.key === action.data.key) {
            setting.value = action.data.value;
          }
          return setting;
        })
      };
      break;
  }

  return state;
}
