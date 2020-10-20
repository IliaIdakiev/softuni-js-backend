const { Router } = require('express');
const userMiddleware = require('../middlewares/user');
const userModel = require('../../models/user');
const controllerFactory = require('../modules/controller-factory');

const userController = controllerFactory(userModel);

const router = Router();

router.route('/')
  .get(userController.getAll)
  .post(userMiddleware.extractBodyData, userController.createOne);

router.route('/:id')
  .get(userController.getOne)
  .put(userMiddleware.extractBodyData, userController.updateOne)
  .delete(userController.deleteOne);

module.exports = router;