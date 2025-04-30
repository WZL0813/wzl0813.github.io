if (!!window.ActiveXObject || "ActiveXObject" in window) { //is IE?
    alert('孩子，上古浏览器不支持呢喵~');
}
let divTyping = document.getElementById('wzl_type')
let i = 0,
    timer = 0,
    str = 'Ryokuryuneko' //text
function typing() {
    if (i <= str.length) {
        divTyping.innerHTML = str.slice(0, i++) + '_'
        timer = setTimeout(typing, 150) //time
    } else {
        divTyping.innerHTML = str
        clearTimeout(timer)
    }
}

typing()
var binft = function (r) {
    function t() {
        return b[Math.floor(Math.random() * b.length)]
    }
    function e() {
        return String.fromCharCode(94 * Math.random() + 33)
    }
    function n(r) {
        for (var n = document.createDocumentFragment(), i = 0; r > i; i++) {
            var l = document.createElement("span");
            l.textContent = e(),
                l.style.color = t(),
                n.appendChild(l)
        }
        return n
    }
    function i() {
        var t = o[c.skillI];
        c.step ? c.step-- : (c.step = g, c.prefixP < l.length ? (c.prefixP >= 0 && (c.text += l[c.prefixP]), c.prefixP++) : "forward" === c.direction ? c.skillP < t.length ? (c.text += t[c.skillP], c.skillP++) : c.delay ? c.delay-- : (c.direction = "backward", c.delay = a) : c.skillP > 0 ? (c.text = c.text.slice(0, -1), c.skillP--) : (c.skillI = (c.skillI + 1) % o.length, c.direction = "forward")),
            r.textContent = c.text,
            r.appendChild(n(c.prefixP < l.length ? Math.min(s, s + c.prefixP) : Math.min(s, t.length - c.skillP))),
            setTimeout(i, d)
    }
    i()
};
binft(document.getElementById('wzl_txt'));