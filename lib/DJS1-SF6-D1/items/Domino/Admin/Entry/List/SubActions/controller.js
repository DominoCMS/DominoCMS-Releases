
DominoControllers.registerController( 'Domino.Admin.Entry.List.SubActions', DCDominoController.extend( function( _super ) {
    return {
        'indexAction': function ( el, view, data ) {

            var self = this;

            self.onEvent( document.querySelectorAll('a[name="langSwitcher"]'), 'click', function( ev ) {
                ev.preventDefault();
                var self = this;
                // hide old lang
                var oldLangBtn = el.querySelector('a.is-active');
                if ( oldLangBtn) {
                    var oldLang = oldLangBtn.getAttribute('lang');
                    var oldLangDivs = document.querySelectorAll('div[name="' + 'dim' + oldLang + '"]');
                    if ( oldLangDivs )
                        for ( var i = 0; i < oldLangDivs.length; i++ )
                            oldLangDivs[i].style.display = "none";
                    oldLangBtn.removeAttribute('class');

                    // show new lang
                    var newLang = self.getAttribute('lang');
                    var newLangDivs = document.querySelectorAll('div[name="' + 'dim' + newLang + '"]');
                    if ( newLangDivs)
                        for ( var i = 0; i < newLangDivs.length; i++ )
                            newLangDivs[i].removeAttribute('style');
                    self.setAttribute('class', 'is-active');
                }
            });



        }
    }

}));
