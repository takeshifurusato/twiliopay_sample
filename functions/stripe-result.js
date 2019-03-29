exports.handler = function(context, event, callback) {
    let twiml = new Twilio.twiml.VoiceResponse();

    switch (event.Result) {
    case "success":
        text = "100円の決済が完了しました。ご利用ありがとうございました。";
        break;
    case "payment-connector-error":
        text = "エラーが発生しました。決済に失敗しました。";
        console.log(decodeURIComponent(event.PaymentError));
        break;
    default: 
        status_text = "error";
        text = "決済に失敗しました。";
    }

    twiml.say({ language: 'ja-JP', voice: 'Polly.Mizuki' },text);
    callback(null, twiml);
};