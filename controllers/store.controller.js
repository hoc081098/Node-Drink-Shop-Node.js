const Store = require('../models/store.model');

module.exports.getNearbyStore = (req, res) => {
  let { lng, lat, max_distance } = req.query;
  lng = parseFloat(lng);
  lat = parseFloat(lat);
  max_distance = parseInt(max_distance);

  Store.aggregate(
    [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          spherical: true,
          distanceField: 'distance',
          maxDistance: max_distance
        }
      },
      { $sort: { distance: 1 } } // Sort nearest first
    ],
    (err, docs) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json(docs);
    }
  );
};
