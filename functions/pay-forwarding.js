exports.handler = function(context, event, callback) {
    const toNumber = event.To;

    // Conference作成 参加
    const twiml = new Twilio.twiml.VoiceResponse();
    let dialParams = {};
    dialParams.callerId = toNumber;
    dial = twiml.dial(dialParams);
    dial.conference({
        region: 'jp1',
        endConferenceOnExit: true,
    }, 'payConference');

    // PAY_MY_MOBILE_NUMBERに発信＆Conference参加
    const client = context.getTwilioClient();
    client
    .conferences('payConference')
    .participants.create({
        region: 'jp1',
        to: context.PAY_MY_MOBILE_NUMBER,
        from: toNumber,
        endConferenceOnExit: true,
        earlyMedia: true,
    }).then(participant => {
        // PAY_MY_MOBILE_NUMBERに発信のCallSidをSyncに保存
        let sync = Runtime.getSync({serviceName: context.PAY_SYNC_SERVICE_SID});
        sync.documents("PayStatus")
            .fetch()
            .then(response => {
                let payload = response.data;
                payload.callSid       = participant.callSid;
                payload.conferenceSid = participant.conferenceSid;
                sync.documents("PayStatus").update({
                    data: payload
                }).then(response => {
                    callback(null, twiml);
                }).catch(error => {
                    console.log(error);
                    callback(error);
                });
        }).catch(error => {
            let payload = {
                callSid       : participant.callSid,
                conferenceSid : participant.conferenceSid
        	};
            sync.documents.create({
                uniqueName: "PayStatus",
                data: payload
            }).then(response => {
                callback(null, twiml);
            }).catch(error => {
                console.log(error);
                callback(error);
            });
        });
    }).catch(error => {
        console.log(error);
        callback(error);
    });
};