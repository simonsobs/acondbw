enum State {
  Off = "OFF",
  Init = "INIT",
  Loading = "LOADING",
  Error = "ERROR",
  Loaded = "LOADED",
  Empty = "EMPTY", // e.g., empty list
  None = "NONE", // i.e., not found
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
