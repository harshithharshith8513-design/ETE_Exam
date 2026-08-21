const express = require('express');
const router = express.Router();
const {
  getIdeas,
  getIdeaStats,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  voteIdea
} = require('../controllers/ideaController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.get('/stats', getIdeaStats);

router.route('/')
  .get(getIdeas)
  .post(protect, createIdea);

router.route('/:id')
  .get(getIdeaById)
  .put(protect, updateIdea)
  .delete(protect, deleteIdea);

router.post('/:id/vote', optionalAuth, voteIdea);

module.exports = router;
