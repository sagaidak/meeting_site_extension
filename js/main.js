(function ($) {

    function ajaxStart() {
        $('#progress').show();
    }

    function ajaxStop() {
        $('#progress').hide();
    }

    function login(mail = '', pass = '') {
        $.post('https://api.prime.date/auth/login',
            {
                email: mail,
                password: pass
            })
            .done(function (data) {
                console.log(data);
                /*
                data:
                page: ""
                profile: {id: 91630, firstname: "netperevodchika", lastname: "netperevodchika", id_role: 3, id_agency: 1200, …}
                 */
                getFemales();
            });
    }

    function getFemales() {
        $.ajax({
            url: "https://api.prime.date/operator/find-females",
            type: "POST",
        }).done(function(data){
            console.log(data);
            /*
            data: {,…}
                list: [{id: 29464403, id_user: 29464403, name: "Olga", age: 24, country: "Ukraine", city: "Mykolayiv",…}]
                    0: {id: 29464403, id_user: 29464403, name: "Olga", age: 24, country: "Ukraine", city: "Mykolayiv",…
                           avatar_small: "https://i.gstatvb.com/shpzkl2uo8l2pl5a3g.r50x50.50a0cfc2.jpg",

                    }
             */
            data.data.list.forEach(function(item){
                $('#females').append('<div class="female">Name: '+item.name+' Age: '+item.age+'</div>');
            });
        });
    }

    function findMen() {
        ajaxStart();
        let obj = {
            filters: {ageFrom: 25, ageTo: 50, countries: [], withPhoto: false, moreChildren: false},
            limit: 15,
            page: 1
        };
        let b = $.ajax({
                url: "https://api.prime.date/account/search",
                type: "POST",
                data: obj,
                contentType: "json; charset=utf-8",
                xhrFields: {
                    withCredentials: true
                }
        });
        b.done(function (d) {
            analysisSite(d);
            ajaxStop();
        });
        b.fail(function (e, g, f) {
            alert('Epic Fail');
            ajaxStop();
        })
    }

    function getMedia(idUser) {
        $.ajax({
            url: "https://api.prime.date/upload/get-mail-media-gallery?idUser="+idUser,
            type: "POST",
            contentType: "json; charset=utf-8",
            data: obj
        }).done(function(data){
            // {data->images->[{"id":"403309437",
            // "id_email":null,
            // "url_original":"https://i.gstatvb.com/shpzkl2hkljc3oftcg.a46a30a9.jpg",
            // "url_uploaded":"https://i.gstatvb.com/shpzkl2hkljc3oftcg.r100x100.9d0e4b4e.jpg",
            // "url_preview":"https://i.gstatvb.com/shpzkl2hkljc3oftcg.r50x50.14b717af.jpg",
            // "url_standart":"https://i.gstatvb.com/shpzkl2hkljc3oftcg.r600x800.b57e69e4.jpg",
            // "date_created":"2019-06-04 08:51:20",
            // "status":"0",
            // "id_user":"29464403",
            // "url_thumbnail":"https://i.gstatvb.com/shpzkl2hkljc3oftcg.r100x100.9d0e4b4e.jpg",
            // "full_size":"https://i.gstatvb.com/shpzkl2hkljc3oftcg.a46a30a9.jpg"},]}
        });
    }

    function sendChat(manId, femaleId, message) {
        //Send chat message: не более 300 символов
        //if (message.length > 300) return console.log('error, message should be no more than 300 symbols');

        //temp
        manId = 33987138;
        femaleId = 29464403;
        message = 'hey, honey';

        $.ajax({
            url: "https://api.prime.date/operator/add-activity/message/"+manId,
            type: "POST",
            contentType: "json; charset=utf-8",
            data: {
                content: {message: message, }, //id: 1565017889715
                idFemale: femaleId,
                idMale: manId,
                idUserTo: manId
            }
        }).done(function(data){
            console.log(data);
        });
    }



    function sendMail() {
        let content = "Many women feel that their boyfriends or husbands are unromantic, but at the end of the day, men aren't unromantic: They just aren't usually as sentimental as women are. To say that a person isn't romantic as a result of their being less sentimental is a mistake. Men want romance as much as women do, but their understanding of romance, and those things that they feel are romantic, are often different from women.";
        let manId = 33987138;
        let femaleId = 29464403;

        let obj = {
            email: {
                content: content,
                from: femaleId,
                title: "",
                to: manId,
            },
            images: [],
            videos: []
        };
        $.ajax({
            url: "https://api.prime.date/correspondence/send",
            type: "POST",
            contentType: "json; charset=utf-8",
            data: obj
        }).done(function(data){
            //{"data":{"status":"success"}}
            console.log(data);
        });
    }

    function analysisSite(data) {
        let res = '';
        console.log(data);
        $(data).find('a').each(function () {
            res += $(this).text() + '=>' + $(this).attr('href') + '<br/>';
        });
        $('#resultbox').html(res);
    }

    function setData() {
        let value = $('#text').val();

        let obj = {name: 'Alina', mail: 'a@a.com', pass: 'qweqwe'};

        chrome.storage.local.set({key: obj}, function () {
            console.log('Value is set to ' + obj);
        });
    }

    function readData() {
        chrome.storage.local.get(['key'], function (result) {
            console.log('Value currently is ' + result.key.name);
        });
    }

    function Run()
    {
        //
        const
            w=800,
            h=660;

        //
        chrome.app.window.create("/",{  //html
            frame: "chrome",
            innerBounds: {
                top: Math.round((screen.height-h)/2),
                left: Math.round((screen.width-w)/2),
                width: w,
                height: h,
                minWidth: w,
                minHeight: h,
            },
            resizable: false,
            alwaysOnTop: true,
            id: "run"
        });

    }

    $(function () {
        $('#progress').hide();
        $('#text_set').click(setData);
        $('#text_get').click(readData);

        $('#login').click(function(){
            let mail_input = $('#mail_input').val();
            let pass_input = $('#pass_input').val();

            login(mail_input, pass_input);
        });

        $('#test_send_message').click(sendChat);
        $('#test_send_mail').click(sendMail);

    });
})(jQuery);