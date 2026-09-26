// TODO: implement in Day 2 — request body/query validation middleware

const validateRequest = (_schema) => {
  return (_req, _res, next) => {
    next();
  };
};

module.exports = validateRequest;
