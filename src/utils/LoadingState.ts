enum State {
  Off = "OFF",
  Loading = "LOADING",
  Error = "ERROR",
  Loaded = "LOADED",
  Empty = "EMPTY", // e.g., empty list
  None = "NONE", // i.e., not found
}

export default State;


//  LOADING -+-> ERROR  -+
//     ^     |           |
//     |     +-> LOADED -+
//     |     |           |
//     |     +-> EMPTY --+
//     |     |           |
//     |     +-> NONE ---+
//     |                 |
//     +-----------------+
