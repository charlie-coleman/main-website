function loadFile(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      dataSources[url] = createFileSource.bind(undefined, buffer)
      ondatasource(url)
    }, function(err) {
      console.log("Error loading file", url, ":", err)
    })
  }
  request.send()
}

function loadFiles(list) {
  for(var i=0; i<list.length; ++i) {
    loadFile(list[i])
  }
}

var fsize = 1024;
var nsamples = 20000;

var shifter = require("./js/pitchshift.js");

var out_ptr = 0;
var put_bud = new Float32Array(nsamples);

var tuner = pitchshift(function(data) {
    out_buf.set(data, out_ptr);
    out_ptr += data.length;
}, function(t, pitch) {
    return 0.5;
}, {
    frameSize: fsize
});

for var in_ptr=0; in_ptr + fsize < source.length; in_ptr += fsize) {
    tuner(source.subarray(in_ptr, inptr+fsize));
}
