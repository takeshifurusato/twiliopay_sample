exports.handler = function(context, event, callback) {
    
    try{
        let sync = Runtime.getSync({serviceName: context.PAY_SYNC_SERVICE_SID});
        sync.documents("PayStatus")
            .fetch()
            .then(response => {
                let payload = response.data;
    
                if(event.PaymentCardNumber && event.ExpirationDate ==='' && event.SecurityCode === '' ){
                    const client = context.getTwilioClient();
                    client.conferences(payload.conferenceSid)
                    .participants(payload.callSid)
                    .update({hold: false});
                }
    
                payload.PaymentCardNumber = event.PaymentCardNumber;
                payload.ExpirationDate    = event.ExpirationDate;
                payload.SecurityCode      = event.SecurityCode;
                payload.Status            = 'Busy';
                
                sync.documents("PayStatus").update({
                    data: payload
                }).then(response => {
                    callback(null, 'OK');
                });
            });
    }catch(error){
        console.log(error);
        callback(error);
    }
};