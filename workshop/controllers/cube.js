const cubeModel = require('../models/cube');
module.exports = {
  getCubes(req, res, next) {
    const { from, search, to } = req.query;
    cubeModel.getAll({ name: search, from: +from, to: +to }).then(cubes => {
      // throw new Error('ERROR!');
      res.render('index', { layout: false, cubes, from, search, to });
    }).catch(next);
  },
  getCube(req, res) {
    const id = +req.params.id;
    cubeModel.findById(id).then(cube => {
      res.render('details', { layout: false, cube });
    }).catch(next);
  },
  postCreateCube(req, res, next) {
    const { name, description, difficultyLevel, imageURL } = req.body;
    cubeModel.insert(name, description, imageURL, +difficultyLevel)
      .then(() => res.redirect('/'))
      .catch(next);
  },
  getCreateCube(req, res) {
    res.render('create', { layout: false });
  }
}