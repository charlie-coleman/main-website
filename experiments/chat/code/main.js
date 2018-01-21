var chatName = "";
var userNameString = "";


$(document).ready(function () {
    var chatInterval = 250; //refresh interval in ms
    var $userName = $("#userName");
    var $chatOutput = $("#chatOutput");
    var $chatInput = $("#chatInput");
    var $chatSend = $("#chatSend");
    
    userNameStringTemp = getParameterByName("username");
    chatNameTemp = getParameterByName("chatroom");
    if(userNameStringTemp != null && chatNameTemp == null) {
        $("#userName").val(userNameStringTemp);
        $("#chat-id").focus();
    }
    else if(chatNameTemp != null && userNameStringTemp == null) {
        $("#chat-id").val(chatNameTemp);
        $("#userName").focus();
    }
    else if(chatNameTemp != null && userNameStringTemp != null) {
        $("#userName").val(userNameStringTemp);
        $("#chat-id").val(chatNameTemp);
        chatName = chatNameTemp;
        userNameString = userNameStringTemp;
        joinChat();
        $("#chatInput").focus();
    }
    else {
        $("#userName").focus();
    }
    
    $("#closePWEntry").onclick = function() {
        $("#myModal").css({
            "display" : "none"
        });
    }
    
    $chatSend.click(function () {
        sendMessage();
    });
    
    $("#createSubmit").click(function() {
        createChat();
    });
    $("#joinSubmit").click(function() {
        joinChat();
    });
    
    $("#pwSubmit").click(function()  {
        userEntry = $("#unClear").val();
        passwordEntry = $("#userPW").val();
        $("#myModal").css({
            "display" : "none"
        });
        $.get("./code/clearchat.php", {
            chatName: chatName,
            un: userEntry,
            pw: passwordEntry
        }, function(data) {
            alert(data);
        });
        $("#userPW").val("");
        $chatInput.focus();
    });

    setInterval(function () {
        retrieveMessages();
        $chatOutput.animate({scrollTop : $chatOutput[0].scrollHeight}, 250);
    }, chatInterval);

    function sendMessage() {
        var chatInputString = $chatInput.val();

        if(userNameString == "") {
            alert("Username must be set.");
        }

        else if(chatInputString == "!clearchat") {
            $("#myModal").css({
                "display" : "block"
            });
            document.getElementById("userPW").focus();
        }
        else {
            $.get("./code/write.php", {
                username: userNameString,
                text: chatInputString,
                chatName: chatName
            });
        }

        $userName.val(userNameString);
        $chatInput.val("");
        retrieveMessages();
    }

    function retrieveMessages() {
        if(chatName != "") {
            var visitortime = new Date();
            var visitortimezone = "-" + visitortime.getTimezoneOffset()/60;
            $.get("./code/read.php", {
                chat: chatName,
                time: visitortimezone
            }, function (data) {
                $chatOutput.html(data); //Paste content into chat output
            });
        }
    }

    function createChat() {
        chatNameTemp = $("#chat-id").val();
        userNameString = $("#userName").val();
        
        nameRegex = new RegExp(/^[A-Za-z0-9_]+$/);
        
        if(chatNameTemp.match(nameRegex)) {
            $.get("./code/newchat.php", {
                chatName: chatNameTemp
            }, function(data) {
                if(data == chatNameTemp) {
                    chatName = chatNameTemp;
                    insertParam('username',userNameString);
                    insertParam('chatroom',chatName);
                    $("#loginModal").css({"display":"none"});
                    $("chatInput").focus();
                    $("#chatlink").val('http://charlie-coleman.com/experiments/chat/?chatroom='+chatName);
                }
                else {
                    alert(data);
                }
            });
        }
        else {
            alert("Invalid chat name. May only include letters, numbers and underscores.");
        }
    }

    function joinChat() {
        chatNameTemp = $("#chat-id").val();
        userNameString = $("#userName").val();

        $.get("./code/checkchat.php", {
            chatName: chatNameTemp
        }, function(data) {
            if(data != "Table exists.") {
                alert(data);
            }
            else {
                chatName = chatNameTemp;
                insertParam('username',userNameString);
                insertParam('chatroom',chatName);
                $("#loginModal").css({
                    "display":"none"
                });
                $("chatInput").focus();
                $("#chatlink").val('http://charlie-coleman.com/experiments/chat/?chatroom='+chatName);
            }
        });

    }

    function insertParam(key, value) {
        key = encodeURI(key); value = encodeURI(value);

        var kvp = document.location.search.substr(1).split('&');

        var i=kvp.length; var x; while(i--) {
            x = kvp[i].split('=');

            if (x[0]==key) {
                x[1] = value;
                kvp[i] = x.join('=');
                break;
            }
        }

        if(i<0) {kvp[kvp.length] = [key,value].join('=');}

        //this will reload the page, it's likely better to store this until finished
        window.history.replaceState(null, null, "?"+kvp.join('&'));
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
});