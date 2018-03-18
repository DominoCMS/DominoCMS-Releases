/**
 * DominoCMS
 * www.dominocms.com
 * 1.0.0
 * 2017-04-02 17:21
 */
function addLoadEvent(func) {

	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function () {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}

}
