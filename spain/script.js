var posts = new Array(5);
for (i = 0; i < posts.length; i ++) {
    posts[i] = new Array();
}
var month_urls = ['/spain/01/posts/', '/spain/02/posts/', '/spain/03/posts/', '/spain/04/posts/', '/spain/05/posts/'];
FindFiles = function(folder, array) {
    $.ajax({
            url : folder,
            success: function (data) {
                $(data).find("a").attr("href", function (i, val) {
                    if( val.match(/\d{2}.(html)$/) ) {
                        array.push(folder + val);
                    }
                });
            }
    });
}
FindAllFiles = function() {
    for (i = 0; i < month_urls.length; i++) {
        FindFiles(month_urls[i], posts[i])
    }
}
$(document).ready(function() {
    FindAllFiles();
    $(document).ajaxStop(function(){
        for (i = posts.length-1; i >= 0; i--) {
            if (posts[i].length > 0) {
                $('#recent').attr('href', posts[i][posts[i].length-1]);
                break;
            }
        }
        $('#first').attr('href', posts[0][0]);
    });
});
PopulateCalendar = function(month_num) {
    $(document).ajaxStop(function(){
        for( i = 0; i < posts[month_num].length; i++ ) {
            string = posts[month_num][i];
            $('#calendar').append('<div><h6><a href='+string+'>'+string.match(/\d{2}.html/).toString().substr(0,2)+'</a></h6></div>');
        } 
    });
}
NavPosts = function(pathname) {
    var nindex = null;
    var pindex = null;
    $(document).ajaxStop(function() {
    for (i = 0; i < posts.length; i++) {
        for (j = 0; j < posts[i].length; j++) {
            if (posts[i][j] == pathname) {
                if (j > 0) {
                    pindex = [i, j-1];
                }
                else {
                    for ( k = i-1; k >= 0; k--) {
                        if(posts[k].length > 0) pindex = [k, posts[k].length-1];
                    }
                }
                if(pindex == null)
                    $('#prevlink').attr('href', 'javascript:void(0);');
                else
                    $('#prevlink').attr('href', posts[pindex[0]][pindex[1]]);
                if (j < posts[i].length-1)
                    nindex = [i, j+1];
                else {
                    for (k = i+1; k < posts.length; k++) {
                        if (posts[k].length > 0) nindex = [k,0]
                    }
                }
                if(nindex == null)
                    $('#nextlink').attr('href', 'javascript:void(0);');
                else
                    $('#nextlink').attr('href', posts[nindex[0]][nindex[1]]);
            }
        }
    } 
    });
}