// ----------------------------------------------------------------------

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

export const emptyRows = (page: number, rowsPerPage: number, arrayLength: number) =>
  page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;

export function applyFilter({
  inputData,
  filterName,
}: {
  inputData: any[];
  filterName: string;
}) {
  if (filterName) {
    inputData = inputData.filter(
      (sensor) =>
        sensor.name?.toLowerCase().includes(filterName.toLowerCase()) ||
        sensor.code?.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  return inputData;
}
