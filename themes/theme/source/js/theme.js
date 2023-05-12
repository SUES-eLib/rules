function showhide(id) {
    var e = document.getElementById(id);
    if (e) {
        if (e.style.display == 'none') {
            e.style.display = null
        } else {
            e.style.display = 'none'
        }
    }
}
var scrolllock = false
function titlescroll() {
    if (!scrolllock) {
        scrolllock = true
        try { document.getElementsByClassName('txt')[1].remove() } catch (e) { }
        var info = document.getElementById('info');
        var p = document.getElementsByClassName('txt')[0];
        var p_w = p.offsetWidth + 2;
        var div_w = document.getElementById('title').offsetWidth - 1
        var style = document.getElementById('style')
        console.log(div_w)
        console.log(p_w)
        if (div_w > p_w) {
            info.align = 'center'
            style.innerHTML = ''
        } else {
            info.align = 'left';
            info.innerHTML += info.innerHTML
            info.scrollLeft = p_w
            style.innerHTML = '@keyframes myfirst{from{padding-left: ' + (p_w + 2) + 'px;}to{padding-left: 0px;}} .info{animation:myfirst ' + parseInt(p_w / 30) + 's infinite;animation-timing-function: linear;}'
        }
        scrolllock = false
    }
}
titlescroll()

window.onresize = function() {
    var target = this;
    if (target.resizeFlag) {
        clearTimeout(target.resizeFlag);
    }
    target.resizeFlag = setTimeout(function() {
        titlescroll();
        target.resizeFlag = null;
    }, 100);
}