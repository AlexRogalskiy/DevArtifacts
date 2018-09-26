var Story = require('../models/story');
var storyRouter = require('express').Router();


storyRouter.route('/story')
  .post(function (req, res) {
    // create new story
    var story = new Story({
      author: req.decoded.id,
      title: req.body.title,
      body: req.body.body
    });

    story.save(function (err) {
      if (err) return res.status(500).json(err);

      res.status(201).json({ message: 'Story has been created!' })
    });

  })

  .get(function (req, res) {
    Story.find({}, function (err, stories) {
      if (err) return res.status(500).json(err);

      res.status(200).json({stories : stories, myvalue: req.myValue});
    });

  })


module.exports = storyRouter;