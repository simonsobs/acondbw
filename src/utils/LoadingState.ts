enum State {
  OFF = "OFF",
  INIT = "INIT",
  LOADING = "LOADING",
  ERROR = "ERROR",
  LOADED = "LOADED",
  EMPTY = "EMPTY", // e.g., empty list
  NONE = "NONE", // i.e., not found
}

export default State;


// INIT -+-> LOADING -+-> ERROR  -+
//       |            |           |
//       |            +-> LOADED -+
//       |            |           |
//       |            +-> EMPTY --+
//       |            |           |
//       |            +-> NONE ---+
//       |                        |
//       +------------------------+
