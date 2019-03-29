exports.handler = function(context, event, callback) {

    try{
        let sync = Runtime.getSync({serviceName: context.PAY_SYNC_SERVICE_SID});
        sync.documents("PayStatus")
            .fetch()
            .then(response => {
                let payload = response.data;
                if(payload.callSid){
                    const client1 = context.getTwilioClient();
                    client1.conferences(payload.conferenceSid)
                    .participants(payload.callSid)
                    .update({hold: true, holdUrl: 'http://com.twilio.music.classical.s3.amazonaws.com/ClockworkWaltz.mp3'})
                    .then(participant => {
                        const client = context.getTwilioClient();
                        client.conferences(payload.conferenceSid)
                        .participants.create({
                            region: 'jp1',
                            to: context.PAY_NUMBER,
                            from: context.PAY_NUMBER,
                        }).then(participant=>{
                            callback(null);
                        });
                    });
                }
            });
    }catch(error){
        console.log(error);
        callback(error);
    }
};