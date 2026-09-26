// TODO: implement in Day 2 — list places, get place by id, and related place handlers

const listPlaces = async (_req, res) => {
  res.json({ data: [] });
};

const getPlaceById = async (_req, res) => {
  res.json({ data: null });
};

module.exports = {
  listPlaces,
  getPlaceById,
};
