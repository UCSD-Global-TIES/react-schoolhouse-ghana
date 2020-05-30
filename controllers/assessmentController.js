// TODO: Seed should be stored in the database as opposed to being loaded through the controller. Implement once database logic is finished.
const seed = require("../seeds/assessment1.json");
const formDb = require("../models/Form");
const questionDb = require("../models/Question");
const responseDb = require("../models/Response");
const accountDb = require("../models/Account");

const { writeCSVFile } = require("../scripts/generateFile");

const {
    verifyKey
} = require("./verifyController");

module.exports = {
    getAssessments: (req, res) => {
        // Gets all forms and assessments
        formDb.find({}).then((formDocs) => res.json(formDocs))
                            .catch((e) => res.status(410).send(e));
    },

    getAssessment: async (req, res) => {
        // Gets form and all questions
        const formId = req.params.formId;
        let formObj = await formDb.findById(formId);
        const getQuestions = formObj.questions.map((questionId) => questionDb.findById(questionId));

        try {
            const allQuestions = await Promise.all(getQuestions);
            formObj.questions = allQuestions;
            res.status(200).json(formObj);
        } catch (e) {
            res.status(410).json(e);
        }
    },

    submitStudentResponse: async (req, res) => {
         // Required 
        const formId = req.params.formId;
        const questionToResponseMap = req.body.responses;

        // Optional
        const userId = req.body.userId;

        if (!formId) {
            res.status(422).send("Form id not specified in body.");
            return;
        }

        if (!questionToResponseMap) {
            res.status(422).send("Responses map not specified in body.");
            return;
        }

        try {
            const formObj = await formDb.findById(formId);
            if (!formObj) {
                res.status(410).send("Form Obj not found");
                return;
            }

            let createResponseObjs = Object.keys(questionToResponseMap).map(async (questionId) => {
                let responseObj = questionToResponseMap[questionId];
                
                // Sets rest of response object
                responseObj["question"] = questionId;
                if (formObj.annonymous) {
                    responseObj["profile"] = userId;     
                }

                // Check if question exists in the database
                const questionObj = await questionDb.findById(questionId);
                if (!questionObj) {
                    return null;
                }

                return responseDb.create(responseObj);
            }); 

            // Resolve all the creations 
            createResponseObjs = createResponseObjs.filter((val) => val !== null);
            const allResponseObj = await Promise.all(createResponseObjs);

            // Creates list of pairs [questino id, response id]
            const allPairs = allResponseObj.map((obj) => [obj.question, obj._id]);
            const updateQuestionsPromises = allPairs.map(
                // Arrow function that maps each pair to a Promise that updates in MongoDB
                (pair) => questionDb.findOneAndUpdate({ _id: pair[0]},
                    {
                        // MongoDB specific syntax that pushes the specified object to a nested array
                        $push: {
                            "responses": pair[1]
                        }
                    }
            ));

            const updateQuestions = await Promise.all(updateQuestionsPromises);

            // Adds metadata to the form
            const updatedForm = await formDb.findByIdAndUpdate(formId, {
                $inc: {
                    numberOfResponses: 1
                }
            });

            res.status(200).send("Form has been updated.");

        } catch (e) {
            res.status(410).send(e);
        }
    },

    createForm: (req, res) => {
        verifyKey(req.header('Authorization'), 'Student,Teacher,Admin')
            .then(async (isVerified) => {
                // Checks if user has been verified
                if (!isVerified) {
                    res.status(403).json(null);
                    return;
                }

                let questionDoc = seed.questions[0];
                questionDoc["responses"] = [];

                // Stores all the creation of question objects
                let promises = [];
                for (let questionDoc of seed.questions) {
                    promises.push(questionDb.create(questionDoc));
                }

                console.log("yike")
                
                try {
                    let allQuestions = await Promise.all(promises);

                    // Grabs all the object IDs (we can change this later)
                    let filteredIds = allQuestions.map((doc) => doc._id);
                    let formObj = seed;

                    // Set needed fields
                    formObj["questions"] = filteredIds;
                    formObj["numberOfResponses"] = 0;
                    formObj["usersAnswered"] = [];

                    let form = await formDb.create(formObj);
                    res.send(form);
                } catch (e) {
                    res.send(e);
                }
    })},

    deleteForm: async (req, res) => {
        const formId = req.params.formId;
        if (!formId) {
            res.status(422).send("formId not specified");
            return;
        }

        try {
            const formObj = await formDb.findByIdAndDelete(formId);

            // Checks if the form exists
            if (!formObj) {
                res.status(422).send(`Form id ${formId} does not exist in the database`);
                return;
            }

            // Maps all questions IDs to the promises that remove the question
            const questionPromises = formObj.questions.map((id) => questionDb.findByIdAndDelete(id));

            // Delets all the questions and gets their info
            const allQuestionObj = await Promise.all(questionPromises);

            // Reduces all the questions in order to get one response array in the end
            const allResponseId = allQuestionObj.reduce(
                (acc, questinoObj) => acc.concat(questinoObjs)
            , []);

            const responsePromises = allResponseId.map((id) => responseDb.findByIdAndDelete(id));
            const allResponseObj = await Promise.all(responsePromises);
            
            res.send(`Form ${formId} has been deleted, along with its questions and responses.`);
        } catch (e) {
            res.status(410).send(e);
        }
    },

    sendFileToDrive: async (req, res) => {
        const formId = req.params.formId;

        if (!formId) {
            res.status(410).send("Form ID not provided in the query");
            return;
        }

        try {
            // Main object that will be passed into the writeCSVFile function
            const dataObj = [];
            const formObj = await formDb.findById(formId);

            // Checks if the form exists
            if (!formObj) {
                res.status(422).send(`Form id ${formId} does not exist in the database`);
                return;
            }

            for (let questionId of formObj.questions) {
                const questionObj = await questionDb.findById(questionId);

                // Iterates through all the responses to make CSV rows
                for (let responseId of questionObj.responses) {
                    const csvObj = {};

                    const responseObj = await responseDb.findById(responseId);
                    const accountObj = await accountDb.findById(responseObj.profile);

                    csvObj["question"] = questionObj.prompt;
                    csvObj["answer"] = responseObj.answer;
                    csvObj["explanation"] = responseObj.explanation;
                    csvObj["timeSubmitted"] = responseObj.createdAt;

                    if (accountObj) {
                        csvObj["typeOfAccount"] = accountObj.type;
                    }

                    dataObj.push(csvObj);
                }
            }

            // Expects a Boolean
            const result = await writeCSVFile(dataObj, formObj.title);
            res.status(200).json(dataObj);
        } catch (e) {
            console.log("yeeeters");
            res.send(e);
        }
    }
}