const { Router } = require('express');
const postModel = require('../../models/posts');
const controllerFactory = require('../modules/controller-factory');

const postController = controllerFactory(postModel);

const router = Router();

router.route('/')
  .get(postController.getAll)
  .post(postController.createOne);

router.route('/:id')
  .get(postController.getOne)
  .put(postController.updateOne)
  .delete(postController.deleteOne);

module.exports = router;