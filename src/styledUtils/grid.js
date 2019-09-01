export default function grid(columns = '100%', rows = '100%') {
  return `display: grid;
  grid-template-columns: ${columns};
  grid-template-rows: ${rows};`;
}
