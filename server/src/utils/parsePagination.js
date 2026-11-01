import ApiError from './ApiError.js';

const parsePagination = (query) => {
  const page = Number.parseInt(query.page ?? '1', 10);
  const limit = Number.parseInt(query.limit ?? '20', 10);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new ApiError(400, 'page must be positive and limit must be between 1 and 100.');
  }

  return { page, limit, skip: (page - 1) * limit };
};

export default parsePagination;
