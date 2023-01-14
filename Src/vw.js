//var m = require("mithril")
import md from './md.js'

const os ={
    dispatch: function(action, args=[]){
	//console.log(action, args)
	switch(action){
	case 'seturl':
	    let url = args.target.value
	    if (url.substr(-1)!='/')  url+='/'
	    //if (confirm('Set url to "'+url+'"?')){
		md.url=url
		m.route.set('/.?refresh=true')
	    //}
	    //args.target.value=''
	    break
	case 'makedir':
	    let dir = args.target.value
	    if (confirm('Create folder "'+dir+'"?'))
		md.makeDir(md.getURL(dir)+'/')
	    args.target.value=''
	    break
	case 'upload':
	    let file = args.target.files[0]
	    if (confirm('Upload file "'+file.name+'"?'))
		md.upload(file)
	    break
	case 'delete':
	    const type=args[0]
	    const name=args[1]
	    if (confirm('Should '+
			(type=='dir' ? 'directory' : type)
			+' "'+name+'" be deleted?'))
		md.remove(md.getURL(name)+(type=='dir' ? '/' : ''))
	    break
	default:
	    alert('Action "'+action+'" unknown')
	}
    },
    compute: function(){ // Data update?
	let dir= m.route.param('dir') || ''
	if (!md.url)
	    m.route.set('/page1')
	else {
	    if (m.route.param('refresh')) {
		m.route.set('/./'+dir)
		md.loadDir(dir)}
	    if (md.crnt_dir!=dir) md.loadDir(dir)
	}
    },
}

// With in nginx:   autoindex_exact_size on;
//                  autoindex_format xml;
// -> dirs=[<directory mtime="2021-10-27T15:03:12Z">Text</directory>,...
//   files=[<file mtime="2021-10-27T14:00:43Z" size="38">text.txt</file>,...
const frmt = {
    ln: function(slctr, clss, path) {
	return function(xml_ln){
	    let url=document.URL+'/'
	    let sz=xml_ln.attributes['size'] ? xml_ln.attributes['size'].value : '-'
	    let mt=xml_ln.attributes['mtime'].value
	    let nm=xml_ln.firstChild.wholeText
	    return m('tr#vzitem',
		     m('td', m(slctr,{class: clss, href: path+nm,}, nm)),
		     m('td[style="text-align:right"]', sz),
		     m('td', mt),
		     m('td', m('button.destroy',
			       {onclick: function() {os.dispatch('delete', [clss, nm])}},'✕'))//x
		    )}},
    dir: function(){
	return frmt.ln(m.route.Link, 'dir', md.getroute())},
    file: function(){
	return frmt.ln('a', 'file', md.getURL())},
}

const vw = {
    Menu: {
	view: function() {
	    return [
		m('.info', 'Current folder: "'+md.crnt_dir+'"'),
		m('nav.dir',
		  m(m.route.Link,{class: 'mn',
				  href: '/./'+md.last_dir(),
				  title: 'Go up'}, '⇑'), //'Up'),
		  m(m.route.Link, {class: 'mn', href: '/.',
				   title: 'Home folder'}, '⌂'),//'Home'),
		  m(m.route.Link,{class: 'mn',
				  href: '/./'+md.crnt_dir+'?refresh=true',
				  title: 'Refresh folder'}, '⟳'),// 'Refresh'),
		  m('label[for=uplds][class=mn]', 'Upload file'),
		  m('input#uplds[type=file][name=uploads][placeholder=]',
		    {onchange: function (e){
			os.dispatch('upload', e)}}),
		  m('input#mkdr[type=text][class=mn][placeholder=Folder to make]',
		    {onchange: function (e){
			os.dispatch('makedir', e)}}),
		  m(m.route.Link, {class: 'mn about', href: '/'}, 'About'),
		 )]}},
    About: {
	view: function() {
	    return [
		m('.top', m(vw.Menu)),
		m('.about',
		  m('h1','Welcome to TAF v0.7'),
		  m('p','a WebDAV client which uses ',
		    m('a[href=https://mithril.js.org]','mithril.js'), '.'))
	    ]}},
    Page1: {
	view: function() {
	    return [
		m('.top', m(vw.Menu)),
		m('.seturl',
		  m('p','Please insert the URL to the base directory of your WebDAV server'),
		  m('input#seturl[type=text][placeholder=https://your.server/DAV/]',
		    {onchange: function (e){
			os.dispatch('seturl', e)}})),
		 ]}},
    DirList: {
	oninit: os.compute,
	onbeforeupdate: os.compute,
	view: function() {
	    return [
		m('.top', m(vw.Menu)),
		m('table.vz-list', [md.dirs.map(frmt.dir()),
				    md.files.map(frmt.file())])
	    ]}},
}

export default vw
