export function validateState(state) {
  const authState = JSON.parse(localStorage.getItem("auth-state"));
  if (!authState) {
    return false;
  }
  if (!(authState == state)) {
    return false;
  }
  return true;
}
