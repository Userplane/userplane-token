var Base64 = {
 
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = Base64._utf8_encode(input);
 
        while (i < input.length) {
 
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
 
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
 
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
 
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
        }
 
        return output;
    },
 
    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
        while (i < input.length) {
 
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
 
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
 
            output = output + String.fromCharCode(chr1);
 
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
 
        }
 
        output = Base64._utf8_decode(output);
 
        return output;
 
    },
 
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    },
 
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
 
        while ( i < utftext.length ) {
 
            c = utftext.charCodeAt(i);
 
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
 
        }
 
        return string;
    }
 
}

if ( typeof hash == "undefined" ) {
    alert("You must have the md5 utility loaded to use this.");
}

//NOTE: to use, you must also set tokenType="base64" in your settings.
var createEncodedSSOToken = function(userId, displayName, line1, line2, line3, line4, avatarFull, avatarIcon, avatarThumb, email, apiKey) {
    //encode each parameter and then return the results of createSSOToken..
    //var bec = Base64.encode;
    return createSSOToken(Base64.encode(userId), Base64.encode(displayName), Base64.encode(line1), Base64.encode(line2), Base64.encode(line3), Base64.encode(line4), Base64.encode(avatarFull), Base64.encode(avatarIcon), Base64.encode(avatarThumb), Base64.encode(email), Base64.encode(String(new Date().getTime())), apiKey);
};

var createSSOToken = function ( userID, displayName, line1, line2, line3, line4, avatarFull, avatarIcon, avatarThumb, email, timeStamp, apiKey ) {
    //JR:  force first character of the displayName to be upper-case
    //var fc = displayName.substring(0,1).toUpperCase();
    //displayName = fc+displayName.substring(1);//Base64.encode("\"&654$321!@#${}()&'''");
    
    // get session from url
    /*var raw_token = "&avatarFull=" + Base64.encode("http://c.api.stage.userplane.com/sandbox/avatar-icon.jpg?biteme=true") +
                "&avatarIcon=" + Base64.encode("http://c.api.stage.userplane.com/sandbox/avatar-icon.jpg") +
                "&avatarThumb=" + Base64.encode("http://c.api.stage.userplane.com/sandbox/avatar-icon.jpg") + 
                "&displayName=" + Base64.encode(displayName) + 
                "&email=" + Base64.encode(userID+"@userplane.com")+
                "&line1=" + Base64.encode("25") + 
                "&line2=" + Base64.encode("Male") +
                "&line3=" + Base64.encode("Santa Monica") + 
                "&line4=" + Base64.encode("CA") +
                "&ts=" + Base64.encode( String(new Date().getTime()) ) + 
                "&userId=" + Base64.encode( userID)
            console.log("raw_token:", raw_token);   */
    
    // default the api key if one is not passed
    if ( typeof apiKey == "undefined" ) {
        // default apiKey for siteID = 47443322204CB6BE3938C30F445F7215
        apiKey = "389EBC801E8CE2802023F136356FA724";
    }
            
    var raw_token = "&avatarFull=" + ((avatarFull !== undefined && avatarFull !== null) ? avatarFull : "http://c.api.stage.userplane.com/sandbox/avatar-icon.jpg") +
                "&avatarIcon=" + ((avatarIcon !== undefined && avatarIcon !== null) ? avatarIcon : "http://c.api.stage.userplane.com/sandbox/avatar-icon.jpg") +
                "&avatarThumb=" + ((avatarThumb !== undefined  && avatarThumb !== null) ? avatarThumb : "http://c.api.stage.userplane.com/sandbox/avatar-icon.jpg") + 
                "&displayName=" + displayName + 
                "&email=" + ((email !== undefined && email !== null) ? email : userID+"@userplane.com") +
                "&line1=" + line1 + 
                "&line2=" + line2 +
                "&line3=" + line3 + 
                "&line4=" + line4 +
                "&ts=" + ((timeStamp !== undefined && timeStamp !== null) ? timeStamp : String(new Date().getTime()) )  + 
                "&userId=" +  userID
    var secure_token = raw_token + "&token=" + hash( raw_token + "&apiKey=" + apiKey );
    //console.log("secure_token:",secure_token);
    return secure_token;

}