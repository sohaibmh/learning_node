const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = (app) => {
  app.get("/api/surveys", requireLogin, async (req, res) => {
    // remember each time you reach the database it is asynchronous
    // we are excluding the recipients from the list because it could be so many
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false,
    });

    res.send({ surveys });
  });

  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for your feedback!");
  });

  app.post("/api/surveys/webhooks", (req, res) => {
    // the colon parts in this route is the parts that we want to extract
    const p = new Path("/api/surveys/:surveyId/:choice");

    const events = _.map(req.body, (event) => {
      const pathname = new URL(event.url).pathname;
      // the survey ID and choice will be returned in an Object, if that's not the case it will return null
      const match = p.test(pathname);
      if (match) {
        return {
          email: event.email,
          surveyId: match.surveyId,
          choice: match.choice,
        };
      }
    });

    console.log("events... ", events);

    // compact filters out all the undefined elements
    const compactEvents = _.compact(events);
    const uniqueEvents = _.uniqBy(compactEvents, "email", "surveyId");
    uniqueEvents._.each((event) => {
      Survey.updateOne(
        {
          // this is the record that we want to update in Mongo, the record is the one that matches the criteria of the recipient
          _id: event.surveyId,
          recipients: {
            $elemMatch: { email: event.email, responded: false },
          },
        },
        // this is how we want the record to be updated, $inc means to increment,
        // [event.choice] is the key that we want its value to be incremented
        {
          $inc: { [event.choice]: 1 },
          $set: { "recipients.$.responded": true },
          lastResponded: new Date(),
        }
      ).exec();
    });

    res.send({});
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    // creating a new instance of the Survey model
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(",").map((email) => {
        return { email: email.trim() };
      }),
      _user: req.user.id,
      dateSent: Date.now(),
    });

    try {
      const mailer = new Mailer(survey, surveyTemplate(survey));
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
