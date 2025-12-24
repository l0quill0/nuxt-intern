export const formatToFloat = (e: InputEvent) => {
  const input = e.target as HTMLInputElement;

  if (!e.data) return;
  if (!/^[0-9.]$/.test(e.data)) {
    e.preventDefault();
    return;
  }

  if (!/^([0-9]*\.[0-9]{1,2}|[0-9]+\.?)$/.test(input.value + e.data)) {
    e.preventDefault();
    return;
  }
};
