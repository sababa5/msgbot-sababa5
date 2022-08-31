const amountRange = ["1", "2", "3", "4", "5"];
const Helper = require("./Helper");
let status;
const {
  userData: { script },
} = require("./cach.json");
const handleMsg = async (message) => {
  let f = await Helper.readFileData();


  if (message.body == "0") {
    Helper.resetVisiterData(message, f);
  }
  if (message.body == "12") {
    return JSON.stringify(f, null, 2);
  }

  if (message.body === "11") {
    Helper.resetVisiterData(message, f);
    console.log("file ", f);
    return;
  }


  
  let isAns = Helper.readFileData;
  if (!isAns[currentIndex].answerd) {
    if (message.body === "כן") {
      status = true;
      await Helper.updateIsComing(isAns, message, status);
      return script.ifApproved;
    } else if (message.body == "לא") {
      status = false;
      await Helper.updateIsComing(isAns, message, status);
      return script.ifDeclined;
    }
  }

  if (Helper.testPath(isAns, currentIndex, "answer not Clear"))
    return script.ifNotClear;
  if (Helper.testPath(isAns, currentIndex, "need Amount"))
    return Helper.checkAmount(isAns, message, currentIndex);

  if (Helper.testPath(isAns, currentIndex, "data update req"))
    return script.ifUpdateReq;

  return false;
};

module.exports.handleMsg = handleMsg;
