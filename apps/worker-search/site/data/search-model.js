import { records } from "./records.js";
import { filterRows } from "../../public/app/search-core.js";

export const filterRecords = ({
  rows = records,
  query = "",
  limit = 24,
} = {}) => filterRows({ rows, query, limit }).results;

export const visibleRows = ({ query = "", limit = 24 } = {}) =>
  filterRecords({ query, limit });

export const searchStats = () => ({
  categories: new Set(records.map((record) => record.category)).size,
  records: records.length,
  regions: new Set(records.map((record) => record.region)).size,
});

export const searchPayload = () => records;
