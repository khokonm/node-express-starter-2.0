const paginate = async (model, query, args, defaultLimit = 10) => {
  // Extract page and limit from query parameters
  const page = parseInt(query.page, 10) || 1; // Default to page 1
  const limit = parseInt(query.limit, 10) || defaultLimit; // Default to 10 items per page
  const offset = (page - 1) * limit;

  // Fetch data with pagination
  const { count, rows } = await model.findAndCountAll({
    ...args,
    limit,
    offset,
    raw: true,
    nest: true,
  });

  // Calculate total pages
  const totalPages = Math.ceil(count / limit);

  return {
    currentPage: page,
    totalPages,
    totalItems: count,
    itemsPerPage: limit,
    rows,
  };
};

module.exports = paginate;
