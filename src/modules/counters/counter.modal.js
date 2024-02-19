const mongoose = require('mongoose');

const CounterSchema = mongoose.Schema({
    seq: { type: Number, default: 0 },
    name: { type: mongoose.SchemaTypes.String, required: true}
});

const Counters = mongoose.model('Counters', CounterSchema);
module.exports = Counters;