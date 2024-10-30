
const clear = document.getElementById('clear')
const isearch = document.getElementById('search')
const enter = document.getElementById('enter')
const content = document.querySelector('#content')


async function newConsulta(input) {
	const responsenew = await fetch("https://api-textobiblico.vercel.app/api/search/new", {
		mode: "cors",
		method: "POST",
		body: JSON.stringify({"input": input}),
		headers: {
			"Content-Type": "application/json"
		}
	})
	const datanew = await responsenew.json()
	//console.log(datanew.success?datanew.value:datanew.message)

	if(!datanew.success){return}
	const responseget = await fetch(`https://api-textobiblico.vercel.app/api/search/${datanew.value}`, { mode: "cors", method: "GET" })
	const dataget = await responseget.json()
	console.log(dataget.success?dataget.value:dataget.message)
	dataget.value.response.map(res => {
		content.innerHTML += (item_add(res.ref, res.text, res.url, res.cod))
	})
}

function search() {
    if (isearch.value.length < 3) {
		return console.log('Insira ao menos 3 caracteres na busca!')
	}
	newConsulta(isearch.value)
	isearch.focus()
}
function item_add(r, t, u, c) {
	const align = calc_align()
	return `<div class='item ${align}' id=${c} >
				<div>
					<p class='cap ${align}' style="margin-bottom: 4px"> ${t} </p>
					<p class='${align}' style="margin-top: 0"> ${r} </p>
				</div>
				<p class='${align}'>
					<span class="material-symbols-outlined" onclick="copy(this)">content_copy</span>
					<span class="material-symbols-outlined" onclick="window.open('${u}', '_Bland')">link</span>
				</p>
			</div>`
}
function calc_align() {
	return document.querySelector('#content').childElementCount % 2 != 1 ? 'right':'left'
}

/*

<span class="material-symbols-outlined">
share
</span>

*/


function limpar(){
    isearch.value = ""
    isearch.focus()
}
function search_foc(){
	let selected = document.querySelector("#content > div.selected")
	if (selected){selected.classList.remove("selected")}
}


enter.addEventListener('click', search)
isearch.addEventListener('keyup', ()=>{if(event.keyCode == 13){search()}; if(event.keyCode == 46){limpar()}})
isearch.addEventListener('focus', search_foc)
clear.addEventListener('click', limpar)
document.addEventListener('keyup', ()=>{
	//c 67 t 84 l 76 del 46 enter 13
	if (document.querySelector("#content").hasChildNodes()){
		let tecla = event.keyCode
		let selected = document.querySelector("#content > div.selected")
		switch (tecla){
			case 38: if(!selected){document.querySelector("#content > div:nth-last-child(1)").classList.add("selected"); isearch.blur()} else {if(selected.previousSibling){selected.previousSibling.classList.add("selected"); selected.classList.remove("selected")} else {isearch.focus()}}; break;
			case 40: if(!selected){document.querySelector("#content > div:nth-child(1)").classList.add("selected"); isearch.blur()} else {if(selected.nextSibling){selected.nextSibling.classList.add("selected"); selected.classList.remove("selected")} else {isearch.focus()}}; break;
			case 84: if(event.altKey){copyAll()}; break;
			case 67: if(selected){copy(selected.firstChild.children[0])};break;
			case 76: if(selected){selected.firstChild.children[1].click()};break;
		}
	}
}, true)


function clipb(content) {
	navigator.clipboard.writeText(content)
		.then(()=>{ console.log("Text copied to clipboard...") })
		.catch(err=>{ console.log('Something went wrong', err) })
}
function copy(t) {
    let content = ''
	//let item = t.parentElement.parentElement.id.split('_')
    //if (item.length == 2){
    //  content = conteudo[item[0]][item[1]].join(' ')+' '+(lvs_orig[item[0]]) +' '+(parseInt(item[1])+1)
    //} else {
    content = t.parentElement.parentElement.firstElementChild.innerText
	content.replace('\n', ' ')
	content.replaceAll('\n', '')
    //}
    clipb(content)
}
function copyAll() {
	let content = ''
	let t = document.querySelector("#content").children
    for(i of t){
	    //let item = i.id.split('_')
	    if (content != ""){content += `/n`}
	    //if (item.length == 2){
	    //  content += conteudo[item[0]][item[1]].join(' ')+' '+(lvs_orig[item[0]]) +' '+(parseInt(item[1])+1)
	    //} else {
	    content += i.firstChild.innerText
	}
	clipb(content)
}