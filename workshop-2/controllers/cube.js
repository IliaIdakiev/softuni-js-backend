const cubeModel = require('../models/cube');
module.exports = {
  getCubes(req, res, next) {
    const { from, search, to } = req.query;
    let query = {};
    if (search) { query.name = new RegExp(search, 'i'); }
    if (from) {
      query.difficultyLevel = { $gte: +from };
    }
    if (to) {
      query.difficultyLevel = query.difficultyLevel || {};
      query.difficultyLevel.$lte = +to;
    }

    cubeModel.find(query).populate('accessories')
      .then(cubes => {
        res.render('index', { cubes, from, search, to });
      })
      .catch(next);;
  },
  getCube(req, res, next) {
    const id = req.params.id;
    return cubeModel.findById(id).populate('accessories').then(cube => {
      res.render('details', { cube });
    }).catch(next);
  },
  postCreateCube(req, res, next) {
    const { name, description, difficultyLevel, imageURL } = req.body;
    cubeModel.create({ name, description, imageURL, difficultyLevel: +difficultyLevel })
      .then(() => res.redirect('/'))
      .catch(next);
  },
  getCreateCube(_, res) {
    res.render('create');
  }
}