const Counters = require("../modules/counters/counter.modal");

const counterIncrementor =  async (name) =>  {
    try {
        let counter = await Counters.findOneAndUpdate({name: name}, {$inc: { seq: 1}, name: name });
        if(counter){
            return counter.seq + 1;
        } else {
            Counters.create({seq: 1, name: name})
            return 1;
        }
      } catch (error) {
          return null
      }
}
module.exports = counterIncrementor