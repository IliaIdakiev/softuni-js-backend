module.exports = function controllerFactory(model) {

  function createOne(req, res, next) {
    model.create(req.body).then(doc => {
      res.status(201).send(doc);
    }).catch(next);
  };

  function updateOne(req, res, next) {
    const id = req.params.id;
    model.findByIdAndUpdate(id, req.body).then(user => {
      res.send(user);
    }).catch(next);
  };

  function getAll(req, res, next) {
    model.find({}).then(users => {
      res.send(users);
    }).catch(next);
  };

  function getOne(req, res, next) {
    const id = req.params.id;
    model.findById(id).then(user => {
      res.send(user);
    }).catch(next);
  }

  function deleteOne(req, res, next) {
    const id = req.params.id;
    model.findByIdAndRemove(id).then(user => {
      res.send(user);
    }).catch(next);
  }

  return {
    createOne,
    updateOne,
    getAll,
    getOne,
    deleteOne
  };
}
