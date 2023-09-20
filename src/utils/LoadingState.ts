type State = "off" | "loading" | "error" | "loaded" | "empty" | "none";

export default State;

//  loading -+-> error  -+
//     ^     |           |
//     |     +-> loaded -+
//     |     |           |
//     |     +-> empty --+
//     |     |           |
//     |     +-> none ---+
//     |                 |
//     +-----------------+
