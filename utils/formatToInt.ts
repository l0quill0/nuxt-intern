export const fromatToInt = (e: InputEvent) => {
  if (!e.data) return;
  if (!/^[0-9]$/.test(e.data)) {
    e.preventDefault();
    return;
  }
};
