const cubeController = require('../controllers/cube');

module.exports = (app) => {
  app.get('/', cubeController.getCubes);
  app.get('/details/:id', cubeController.getCube);
  app.post('/create', cubeController.postCreateCube);
  app.get('/create', cubeController.getCreateCube);

  app.get('/about', function (req, res) {
    res.render('about', { layout: false });
  });

  app.get('*', function (req, res) {
    res.render('404', { layout: false });
  });
};