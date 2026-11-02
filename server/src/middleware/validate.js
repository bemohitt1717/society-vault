import ApiError from '../utils/ApiError.js';

const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return next(new ApiError(
      400,
      'Some information is missing or invalid.',
      result.error.issues.map(({ path, message }) => ({ path: path.join('.'), message })),
    ));
  }

  req.validated = result.data;
  return next();
};

export default validate;
