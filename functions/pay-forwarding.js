exports.handler = function(context, event, callback) {
    const toNumber = event.To;

    // Conferenceを生成して発信元と接続
    const twiml = new Twilio.twiml.VoiceResponse();
    let dialParams = {}
    dialParams.callerId = toNumber
    dial = twiml.dial(dialParams)
    dial.conference({
        region: 'jp1',
        endConferenceOnExit: true,
    }, 'payConference')  

    // 自身のケータイへ発信、Conferenceに参加させる
    const client = context.getTwilioClient() 
    client
    .conferences('payConference')
    .participants.create({
        region: 'jp1',
        to: context.PAY_MY_MOBILE_NUMBER,
        from: toNumber,
        endConferenceOnExit: true,
        earlyMedia: true,
    })
    .then(participant => {
        console.log(participant.sid)
        callback(null, twiml)
    })
    .catch(error => {
        console.log(error)
        callback(error)
    })      
};