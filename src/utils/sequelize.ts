import { Op } from "sequelize";

const buildWhereClause = (query: any): any => {
  const where: any = {};

  Object.keys(query).forEach((key) => {
    const value = query[key];

    if (typeof value === "string") {
      where[key] = { [Op.like]: `%${value}%` };
    } else {
      where[key] = { [Op.eq]: query.value };
    }
  });

  return where;
};

const buildOrderClause = (sort: string | undefined): any => {
  if (!sort) return [];

  const order = sort.startsWith("-")
    ? [[sort.substring(1), "DESC"]]
    : [[sort, "ASC"]];
  return order;
};

export { buildOrderClause, buildWhereClause };
