const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports.writeCSVFile = async (data, name) => {
    // CSV Format
    const csvWriter = createCsvWriter({
        path: `${name}.csv`,
        header: [
          {id: 'question', title: 'Question'},
          {id: 'answer', title: 'Answer'},
          {id: 'explanation', title: 'Explanation'},
          {id: 'timeSubmitted', title: 'TimeSubmitted'},
          {id: 'typeOfAccount', title: 'Type'}
        ]
      });
    
    try {
        await csvWriter.writeRecords(data);
        return true;
    } catch (e) {
        return false;
    }
};

