exports.handler = function(context, event, callback) {
    const client = context.getTwilioClient();
    client
    .conferences('payConference')
    .participants.create({
        region: 'jp1',
        to: context.PAY_NUMBER,
        from: context.PAY_NUMBER,
    })
    .catch(error => {
        console.log(error);
        callback(error);
    });  
};