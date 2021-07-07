const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(
            'mongodb+srv://qtientls:maihang123@cluster0.ad63q.mongodb.net/T2PC',
            { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
        );
        console.log('connect successfully !!! ');
    } catch (error) {
        console.log('connect failed !!');
    }
}

module.exports = { connect };
