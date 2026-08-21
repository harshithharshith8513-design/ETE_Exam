const Idea = require('../models/Idea');

// @desc    Get all ideas with pagination, search, filter, and sorting
// @route   GET /api/ideas
// @access  Public
const getIdeas = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const skip = (page - 1) * limit;

    const { search, domain, status, sort } = req.query;

    let query = {};

    if (domain && domain !== 'All') {
      query.domain = domain;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { problemStatement: searchRegex },
        { description: searchRegex },
        { technologies: searchRegex }
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'most_voted') {
      sortOptions = { votes: -1, createdAt: -1 };
    }

    const totalIdeas = await Idea.countDocuments(query);
    const ideas = await Idea.find(query)
      .populate('author', 'name email role')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalIdeas / limit) || 1;

    res.status(200).json({
      success: true,
      count: ideas.length,
      totalIdeas,
      totalPages,
      currentPage: page,
      ideas
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregated statistics for Innovation Hub
// @route   GET /api/ideas/stats
// @access  Public
const getIdeaStats = async (req, res, next) => {
  try {
    const totalIdeas = await Idea.countDocuments();

    const statusCounts = {
      submitted: 0,
      under_review: 0,
      approved: 0,
      prototype: 0,
      implemented: 0
    };

    const statusAggregation = await Idea.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    statusAggregation.forEach((item) => {
      if (statusCounts.hasOwnProperty(item._id)) {
        statusCounts[item._id] = item.count;
      }
    });

    const domainAggregation = await Idea.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const topDomains = domainAggregation.map((item) => ({
      domain: item._id,
      count: item.count,
      percentage: totalIdeas > 0 ? Math.round((item.count / totalIdeas) * 100) : 0
    }));

    const topVotedIdea = await Idea.findOne()
      .sort({ votes: -1 })
      .populate('author', 'name email role')
      .select('title domain votes status problemStatement');

    res.status(200).json({
      success: true,
      stats: {
        totalIdeas,
        statusCounts,
        topDomains,
        topVotedIdea
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single idea by ID
// @route   GET /api/ideas/:id
// @access  Public
const getIdeaById = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id).populate(
      'author',
      'name email role'
    );

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: `Idea not found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      idea
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new innovation idea
// @route   POST /api/ideas
// @access  Private
const createIdea = async (req, res, next) => {
  try {
    const {
      title,
      problemStatement,
      description,
      domain,
      technologies,
      expectedImpact,
      status
    } = req.body;

    if (!title || !problemStatement || !description || !domain || !expectedImpact) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: title, problemStatement, description, domain, expectedImpact'
      });
    }

    if (description.length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 20 characters long'
      });
    }

    let parsedTech = technologies;
    if (typeof technologies === 'string') {
      parsedTech = technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }

    if (!Array.isArray(parsedTech) || parsedTech.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least 1 technology tag is required'
      });
    }

    const existingTitle = await Idea.findOne({
      title: { $regex: new RegExp(`^${title.trim()}$`, 'i') }
    });

    if (existingTitle) {
      return res.status(400).json({
        success: false,
        message: `An idea with the title "${title}" already exists. Please choose a unique title.`
      });
    }

    const idea = await Idea.create({
      title: title.trim(),
      problemStatement: problemStatement.trim(),
      description: description.trim(),
      domain,
      technologies: parsedTech,
      expectedImpact: expectedImpact.trim(),
      status: status || 'submitted',
      author: req.user._id
    });

    const populatedIdea = await Idea.findById(idea._id).populate(
      'author',
      'name email role'
    );

    res.status(201).json({
      success: true,
      message: 'Idea created successfully',
      idea: populatedIdea
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an innovation idea
// @route   PUT /api/ideas/:id
// @access  Private
const updateIdea = async (req, res, next) => {
  try {
    let idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: `Idea not found with id ${req.params.id}`
      });
    }

    // Authorization check (Author OR Admin)
    const isAuthor = idea.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to edit this idea. Only the author or system admin can make edits.'
      });
    }

    const {
      title,
      problemStatement,
      description,
      domain,
      technologies,
      expectedImpact,
      status
    } = req.body;

    if (title && title.trim().toLowerCase() !== idea.title.toLowerCase()) {
      const existingTitle = await Idea.findOne({
        title: { $regex: new RegExp(`^${title.trim()}$`, 'i') }
      });
      if (existingTitle) {
        return res.status(400).json({
          success: false,
          message: `An idea with title "${title}" already exists.`
        });
      }
      idea.title = title.trim();
    }

    if (problemStatement) idea.problemStatement = problemStatement.trim();
    if (description) {
      if (description.length < 20) {
        return res.status(400).json({
          success: false,
          message: 'Description must be at least 20 characters long'
        });
      }
      idea.description = description.trim();
    }
    if (domain) idea.domain = domain;
    if (expectedImpact) idea.expectedImpact = expectedImpact.trim();
    if (status) idea.status = status;

    if (technologies) {
      let parsedTech = technologies;
      if (typeof technologies === 'string') {
        parsedTech = technologies.split(',').map((t) => t.trim()).filter(Boolean);
      }
      if (Array.isArray(parsedTech) && parsedTech.length > 0) {
        idea.technologies = parsedTech;
      }
    }

    await idea.save();

    const updatedIdea = await Idea.findById(idea._id).populate(
      'author',
      'name email role'
    );

    res.status(200).json({
      success: true,
      message: 'Idea updated successfully',
      idea: updatedIdea
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an innovation idea
// @route   DELETE /api/ideas/:id
// @access  Private
const deleteIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: `Idea not found with id ${req.params.id}`
      });
    }

    // Authorization check (Author OR Admin)
    const isAuthor = idea.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this idea. Only the author or system admin can delete it.'
      });
    }

    await idea.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Idea deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vote / Toggle vote for an idea
// @route   POST /api/ideas/:id/vote
// @access  Public
const voteIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: `Idea not found with id ${req.params.id}`
      });
    }

    const voterKey = req.user ? req.user._id.toString() : req.body.voterId;

    if (!voterKey) {
      return res.status(400).json({
        success: false,
        message: 'Voter identification key required'
      });
    }

    const hasVoted = idea.votedBy.includes(voterKey);

    if (hasVoted) {
      idea.votedBy = idea.votedBy.filter((id) => id !== voterKey);
      idea.votes = Math.max(0, idea.votes - 1);
    } else {
      idea.votedBy.push(voterKey);
      idea.votes += 1;
    }

    await idea.save();

    res.status(200).json({
      success: true,
      votes: idea.votes,
      hasVoted: !hasVoted,
      message: !hasVoted ? 'Vote registered!' : 'Vote removed'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIdeas,
  getIdeaStats,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  voteIdea
};
