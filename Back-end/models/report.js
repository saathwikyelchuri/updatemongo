const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    childname: {
        type: String,
        required: true
    },
    sessionid: {
        type: String,
        required: true
    },
    sessiondate: {
        type: Date,
        required: true,
        default: Date.now
    },
    images: [{
            imgpath: {
                type: String,
                required: true,
            },
            emotions: [{
                angry: {
                    type: Number,
                    required: true
                },
                disgust: {
                    type: Number,
                    required: true
                },
                fear: {
                    type: Number,
                    required: true
                },
                happy: {
                    type: Number,
                    required: true
                },
                sad: {
                    type: Number,
                    required: true
                },
                surprise: {
                    type: Number,
                    required: true
                },
                neutral: {
                    type: Number,
                    required: true
                },
            }],
            max_emotion_img: {
                emotion: {
                    type: String,
                    required: true
                }
            }
}],

},{new:true});

const reports = mongoose.model('report', reportSchema);

module.exports = reports;