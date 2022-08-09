export default {
  INIT: 0,
  LOADING: 1,
  ERROR: 2,
  LOADED: 3,
  EMPTY: 4, // e.g., empty list
  NONE: 5, // i.e., not found
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
