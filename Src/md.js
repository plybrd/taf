//var m = require("mithril")

const md= {
    files: [], // files in directory at url
    dirs: [],  // dirs in directory at url
    url: null,   // url to DAV base directory with '/'
    crnt_dir: '', // current relative directory
    last_dir: function(dir=md.crnt_dir){
	return dir.split( '/' ).slice( 0, -1 ).join( '/' )},
    getroute: function(name=''){
	return "/./"+md.crnt_dir+(md.crnt_dir && '/')+name},
    getURL: function(name=''){
	return md.url+md.crnt_dir+(md.crnt_dir && '/')+name},
    upload: function upload(file) {
	// Changed in mithril.js line 1503 to:
	// else if (body instanceof $window.FormData || body instanceof $window.URLSearchParams || body instanceof $window.Blob) xhr.send(body)
	// (added "|| body instanceof $window.Blob)")
	m.request({
	    method: "PUT",
	    url: md.url+md.crnt_dir+(md.crnt_dir && '/')+file.name,
	    body: file,
	    withCredentials: true,
	    extract: function(xhr) { return {status: xhr.status, statusText: xhr.statusText}}
	}).then(function(rslt) {
	    switch (rslt.status){
	    case 201: console.log('Resource created')
		md.loadDir(md.crnt_dir)
		break
	    case 204: console.log('Resource changed')
		md.loadDir(md.crnt_dir)
		break
	    default: alert('Return status "'+rslt.status+'": '+rslt.statusText)
	    }})},
    makeDir: function(url){
	console.log('Make dir '+url+'...')
        return m.request({
            method: "MKCOL",
	    url: url,
	    withCredentials: true,
	    extract: function(xhr) { return {status: xhr.status, statusText: xhr.statusText}}
        }).then(function(rslt) {
	    console.log('Return status: ',rslt.statusText)
	    switch (rslt.status){
	    case 201: console.log('Resource created')
		md.loadDir(md.crnt_dir)
		break
	    default: alert('Return status "'+rslt.status+'": '+rslt.statusText)
	    }
        })
    },
    remove: function(url){
	console.log('Removing '+url+'...')
        return m.request({
            method: "DELETE",
	    url: url,
	    withCredentials: true,
	    extract: function(xhr) { return {status: xhr.status, statusText: xhr.statusText}}
        }).then(function(rslt) {
	    switch (rslt.status){
	    case 204: console.log('Resource deleted');
		md.loadDir(md.crnt_dir)
		break
	    default: alert('Return status "'+rslt.status+'": '+rslt.statusText)
	    }
        })
    },
    loadDir: function(rel_dir='') {
	md.crnt_dir=rel_dir
        return m.request({
            method: "GET",
	    url: md.url+rel_dir,
	    withCredentials: true,
	    extract: function(xhr) {
		return {xml: xhr.responseXML}}
        }).then(function(rslt) {
	    if (rslt.xml) {
		md.dirs=Array.from(rslt.xml.getElementsByTagName('directory'));
		md.files=Array.from(rslt.xml.getElementsByTagName('file'));
	    }
        })
    },
}
export default md
