exports.handler = function(context, event, callback) {
    console.log(event);

	let twiml = new Twilio.twiml.VoiceResponse();
	
	switch (event.Result) {
    case "success":
        status_text = "completed";
        text = "100円の決済が完了しました。ご利用ありがとうございました。";
        break;
    case "payment-connector-error":
        status_text = "error";
        text = "エラーが発生しました。決済に失敗しました。";
        console.log(decodeURIComponent(event.PaymentError));
        break;
    
    default: 
        status_text = "error";
        text = "決済に失敗しました。";
    }

	twiml.say({ language: 'ja-JP', voice: 'Polly.Mizuki' },text);

    let payload = {
        PaymentCardNumber : event.PaymentCardNumber,
        ExpirationDate    : event.ExpirationDate,
        SecurityCode      : event.SecurityCode,
        Status            : status_text,
	};
    let sync = Runtime.getSync({serviceName: context.PAY_SYNC_SERVICE_SID});
    sync.documents("PayStatus")
        .update({
            ttl : 120,
            data: payload,
        }).then(response => {
            console.log(response);
        	callback(null, twiml);
        }).catch(error => {
            sync.documents.create({
                uniqueName: "PayStatus",
                ttl : 120,
                data: payload
            }).then(response => {
                console.log(response);
            	callback(null, twiml);
            }).catch(error => {
                console.log(error);
                callback(error);
            });
        });
};