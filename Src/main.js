//var m = require("mithril")
import vw from './vw.js' // Views

let errorPageComponent ={
    view: function() {
	return m("","TAF: Page not found.")
    }
}

m.route(document.body, "/page1",{
    "/": vw.About,
    "/about": vw.About, // defines `https://my.domain/#!/about`
    "/page1": vw.Page1,
    "/.": vw.DirList,
    "/./:dir...": vw.DirList,
    "/:404...": errorPageComponent,
})
