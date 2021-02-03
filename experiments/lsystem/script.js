
String.prototype.splice = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};
// AA+B+B-A-A+B+BA-B-AAB+A-B-AA-B+AB+B+A-A-BB+
// -AA+B+B-A-AB-A+BB+A+B-ABB+A+BA-A-B+B+A-A-BB
var curve = null;
var canvas = null;
var ctx = null;
var bg_color = '#222';
var standard_width = $(window).width()/1920;
if (standard_width < 1) {
    standard_width = 1;
}
var start_color = '#BBB';
var examp_constants = ['FAB', 'AB', 'FAB', 'AB', 'F', 'FA'];
var examp_axiom = ['A', 'A', 'FA', 'A', 'F', 'A'];
var examp_size = [4, 4, 4, 4, 4, 4];
var examp_width = [standard_width, standard_width, standard_width, standard_width, standard_width, standard_width];
var examp_start_angle = [0, -60, 0, 0, -90, -90];
var examp_angle = [90, 60, 90, 60, 25.7, 25];
var examp_rules = [['F', '-BF+AFA+FB-', '+AF-BFB-FA+'],
                   ['+B-A-B+', '-A+B+A-'],
                   ['F', 'A+BF+', '-FA-B'],
                   ['A-B--B+A++AA+B-', '+A-BB--B-A++A+B'],
                   ['F[+F]F[-F]F'],
                   ['FF', 'F-[[A]+A]+F[+FA]-A']];
var examp_draw_end = [false, true, false, true, false, false];
var examp_level = [6, 6, 13, 5, 6, 6];
var curve_chosen = false;
var speed = 25;
var width = standard_width;
var start_angle = 0;
var draw_end = false;
var rainbow = true;
var center = true;
var centered = false;
var count = 0;
var start;


$(document).ready(function() {
    create();
    setInterval(update, 0);
});
$(window).resize(function() {
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    ctx.fillStyle = bg_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = start_color;
    ctx.translate(0.5, 0.5);
    if(curve_chosen) {
        curve.x = parseInt(mid_x);
        curve.y = parseInt(mid_y);
        curve.reset();
        centered = false;
    }
});


function create() {
    function update_inputs() {
        $('#draw_speed').val(speed);
        $('#size').val(size);
        $('#start_angle').val(start_angle);
        $('#width').val(standard_width);
        $('#angle').val(angle);
        $('#level').val(level);
        $('#constants').val(constants);
        $('#axiom').val(axiom);
        $('#rainbow').prop('checked', rainbow);
        $('#center').prop('checked', center);
        constants = $('#constants').val()
        $('#draw_end').prop('checked', !draw_end);
        $('.rule').remove();
        for (var i = 0; i < constants.length; i++) {
            c = constants[i];
            $("#rules").append("<div class='rule' id='"+c+"'>"+c+"<input class='inp' id='"+c+"'></div>");
            var id = '#rules #'+constants[i];
            $(id).val(rules[i]);
        }
    }
    canvas = document.getElementById('lsystem_canvas');
    ctx = canvas.getContext("2d");
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    ctx.fillStyle = bg_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    mid_x = canvas.width/2;
    mid_y = canvas.height/2;
    ctx.strokeStyle = start_color;
    ctx.lineWidth = width;
    ctx.lineCap = 'square';
    ctx.translate(0.5, 0.5);
    $('#restart').click(restart);
    $('.examp_button').each(function(i, val) {
        $(this).on('click', function() {
            canvas.width = $(window).width();
            canvas.height = $(window).height();
            ctx.fillStyle = bg_color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = start_color;
            ctx.translate(0.5, 0.5);
            size = parseInt(examp_size[i]);
            width = parseInt(examp_width[i]);
            start_angle = parseFloat(examp_start_angle[i]);
            angle = parseFloat(examp_angle[i]);
            level = parseInt(examp_level[i]);
            constants = examp_constants[i];
            axiom = examp_axiom[i];
            rules = examp_rules[i];
            draw_end = examp_draw_end[i];
            update_inputs();
            rainbow = true;
            curve = new LSystemConstruct(ctx, constants, axiom, size, start_angle, angle, mid_x, mid_y, rules, draw_end);
            curve.create();
            start = performance.now();
            $('#restart').text('Calculating...');
            curve_chosen = true;
            centered = false;
        });
        
    });
    $('#inputs').focusin(function(e) {
        $('#inputs').css('opacity', 1);
    });
    $('#inputs').focusout(function(e) {
        $('#inputs').css('opacity', 0.07);
    });
    var dl = $('#dl');
    dl.click(function() {
        var dt = canvas.toDataURL('image/png');
        this.href = dt.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    });
    $('#constants').bind('input', function() {
        constants = $('#constants').val()
        $('.rule').remove();
        for (var i = 0; i < constants.length; i++) {
            var string = ''
            if (rules.length > i)
                string = rules[i];
            $("#rules").append("<div class='rule' id='"+constants[i]+"'>"+constants[i]+"<input class='inp' id='"+constants[i]+"' value='"+string+"'></div>");
        }
    });
    $('#center').change(function() {
        center = $('#center').prop('checked');
        centered = false;
    });
    canvas.onmousedown = function(e) {
        if (!center) {
            mid_x = parseInt(e.x);
            mid_y = parseInt(e.y);
        }
    }
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function update() {
    if(curve_chosen && !curve.created)
        var temp_speed = 500;
    else if (curve_chosen && center && !centered)
        var temp_speed = 10000;
    else
        var temp_speed = speed;
    for (var i = 0; i < temp_speed; i ++) {
        if(curve_chosen && curve.created && $('#restart').text() == 'Calculating...') {
            if (center && !centered) {
                $('#restart').text('Centering...');
            }
            else {
                $('#restart').text('Drawing...');
            }
        }
        else if (curve_chosen && curve.created && centered && $('#restart').text() == 'Centering...') {
            $('#restart').text('Drawing...');
        }
        else if (curve_chosen && curve.created && (curve.i <= curve.axiom.length)) {
            curve.draw(ctx);
            ctx.stroke();
            if( center && !centered ) {
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            curve.i += 1;
        }
        else if(curve_chosen && !curve.created) {
            curve.create_string(level);
            count += 1;
        }
        else {
            $('#restart').text('Restart');
            if (curve_chosen && !centered ) {
                hold_x = (curve.max_x + curve.min_x)/2-canvas.width/2;
                hold_y = (curve.max_y + curve.min_y)/2-canvas.height/2;
                var percent_error = Math.abs((curve.max_x + curve.min_x)/2 - hold_x - canvas.width/2)/(canvas.width/2);
                percent_error += Math.abs((curve.max_y + curve.min_y)/2 - hold_y - canvas.height/2)/(canvas.height/2);
                percent_error /= 2.0;
                if (center && !centered && curve_chosen && (percent_error <= 0.1)) {
                    mid_x -= hold_x;
                    mid_y -= hold_y;
                    centered = true;
                    restart();
                }
            }
            break;
        }
    }
    
}
function restart() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    ctx.fillStyle = bg_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = start_color;
    ctx.translate(0.5, 0.5);
    var inputs = []
    for(var i = 0; i < $('.inp').length; i++) {
        inputs.push($('.inp')[i].value);
    }
    if(inputs[0] != '' && inputs[1] != '') {
        speed = parseInt(inputs[0]);
        size = inputs[1];
        width = inputs[2];
        start_angle = parseFloat(inputs[3]);
        angle = parseFloat(inputs[4]);
        level = parseInt(inputs[5]);
        constants = inputs[6];
        axiom = inputs[7];
        rules = inputs.slice(8);
        draw_end = !$('#draw_end').prop('checked');
        rainbow = $('#rainbow').prop('checked');
        if (curve_chosen && (curve.size != size || curve.angle != angle || curve.level != level || !arraysEqual(curve.rules, rules) || curve.start_angle != start_angle || curve.orig_axiom != axiom)) {
            centered = false;
        }
        if (!curve_chosen || curve.level != level || curve.constants != constants || !arraysEqual(curve.rules, rules) || curve.draw_end != draw_end || curve.random_rules || curve.orig_axiom != axiom) {
            curve = new LSystemConstruct(ctx, constants, axiom, size, start_angle, angle, parseInt(mid_x), parseInt(mid_y), rules, draw_end);
            curve.rainbow = rainbow
            curve.create();
        }
        else {
            curve.reset();
            curve.size = size;
            curve.start_angle = start_angle;
            curve.angle = angle;
            curve.x = parseInt(mid_x);
            curve.y = parseInt(mid_y);
            curve.curr_angle = start_angle;
            curve.rainbow = rainbow;
        }
        ctx.lineWidth = width;
        ctx.lineCap = 'square';
        start = performance.now();
        $('#restart').text('Calculating...');
        curve_chosen = true;
    }
}
