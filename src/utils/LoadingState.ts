export default {
  OFF: 0,
  INIT: 1,
  LOADING: 2,
  ERROR: 3,
  LOADED: 4,
  EMPTY: 5, // e.g., empty list
  NONE: 6, // i.e., not found
};

// INIT -+-> LOADING -+-> ERROR  -+
//       |            |           |
//       |            +-> LOADED -+
//       |            |           |
//       |            +-> EMPTY --+
//       |            |           |
//       |            +-> NONE ---+
//       |                        |
//       +------------------------+
