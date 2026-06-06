import { dataUrl, initialRows, stats } from "./records.js";

export const filterRecords = ({
  limit = 24,
} = {}) => initialRows.slice(0, limit);

export const visibleRows = ({ limit = 24 } = {}) => filterRecords({ limit });

export const searchStats = () => stats;

export const searchPayload = () => ({
  dataUrl,
  initialRows,
  stats,
});
