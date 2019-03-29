let syncDoc, syncClient;

$(function() {

    $.getJSON('../pay-status-sync-token', function (tokenResponse) {
        syncClient = new Twilio.Sync.Client(tokenResponse.token, { logLevel: 'info' });
        syncClient.document('PayStatus')
        .then(function(doc) {
            syncDoc = doc;
            syncDoc.on('updated', event => {
                console.log("Sync updated.");
                console.log(event);
                $('#PaymentCardNumber').val(event.value.PaymentCardNumber);
                $('#ExpirationDate').val(event.value.ExpirationDate);
                $('#SecurityCode').val(event.value.SecurityCode);
                $('#Status').html(event.value.Status);
            });
        })
        .catch(function(error) {
            console.log(error);
        });

        syncClient.on('tokenAboutToExpire', () => {
            $.getJSON('../pay-status-sync-token', function (tokenResponse) {
                syncClient.updateToken(tokenResponse.token);
            });
        });
    });

    $('#btnClear').on('click', function() {
        const value = {
            PaymentCardNumber : "",
            ExpirationDate    : "",
            SecurityCode      : "",
            Status            : "",
        };
        syncDoc.set(value);
    });

    // こちらの処理を追加
    $('#btnGuide').on('click', function() {
        $.ajax({
                url:'../pay-guide-start',
                type:'POST',
            })
            .done( (data) => {
                alert('Sending completed');
            }
        );
    });

});