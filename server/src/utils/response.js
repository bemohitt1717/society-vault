export const sendData = (res, data, statusCode = 200, meta) => {
  const response = { data };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};
