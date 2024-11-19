
const clear = document.getElementById('clear')
const isearch = document.getElementById('search')
const enter = document.getElementById('enter')
const content = document.querySelector('#content')


async function newConsulta(input) {
	const responsenew = await fetch("https://api-textobiblico.vercel.app/search/new", {
		mode: "cors",
		method: "POST",
		body: JSON.stringify({"input": input}),
		headers: {
			"Content-Type": "application/json"
		}
	})
	const datanew = await responsenew.json()
	if(!datanew.success){return}
	const id = datanew.value

	const responseget = await fetch(`https://api-textobiblico.vercel.app/search/${id}`, { mode: "cors", method: "GET" })
	const dataget = await responseget.json()
	console.log(dataget.success?dataget.value:dataget.message)

	const arrRefs = new Array()
	dataget.value.response.map( r => { arrRefs.push(r.ref.replace(' ARC', '')) } )
	content.innerHTML = cabecalho(id, arrRefs)
	dataget.value.response.map(res => content.innerHTML += (item_add(res.ref, res.text, res.url, res.cod)))
}
function search() {
    if (isearch.value.length < 3) {
		return console.log('Insira ao menos 3 caracteres na busca!')
	}
	newConsulta(isearch.value)
	isearch.focus()
}

function cabecalho(id, refs){
	const refsConcat = refs.join(', ')
	return `<div id='cabec'>
				<div>
					<p class='ref right'> ${refsConcat} </p>
				</div>
				<p class='right'>
					<span class="material-symbols-outlined" onclick="copyAll()">content_copy</span>
					<span class="material-symbols-outlined" onclick="shareConsulta('${id}', '${refsConcat}')">share</span>
				</p>
			</div>`
}
function item_add(r, t, u, c) {
	const align = calc_align()
	const text = `${t}  ${r}`
	return `<div class='item ${align}' id=${c} >
				<div>
					<p class='text ${align}' style="margin-bottom: 4px"> ${t} </p>
					<p class='ref ${align}' style="margin-top: 0"> ${r} </p>
				</div>
				<p class='${align}'>
					<span class="material-symbols-outlined" onclick="copy(this)">content_copy</span>
					<span class="material-symbols-outlined" onclick="window.open('${u}', '_Bland')">link</span>
					<span class="material-symbols-outlined" onclick="share('${text}')">share</span>
				</p>
			</div>`
}
function calc_align() {
	return document.querySelector('#content').childElementCount % 2 !== 1 ? 'right':'left'
}

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
    //let content = ''
	//let item = t.parentElement.parentElement.id.split('_')
    //if (item.length == 2){
    //  content = conteudo[item[0]][item[1]].join(' ')+' '+(lvs_orig[item[0]]) +' '+(parseInt(item[1])+1)
    //} else {
    let content = t.parentElement.parentElement.firstElementChild.innerText
	content = content.replace('\n', '')
    //}
    clipb(content)
}
function copyAll() {
	let content = ''
	const t = document.querySelector("#content").children
    for(i of t){
	    content += '\n\n'+i.firstElementChild.innerText.replace('\n', '')
	}
	clipb(content)
}

const share = async (text) => {
	const shareData = {
		title: "TextoBiblico",
		text: text
	}
	try {
	  await navigator.share(shareData);
	  console.log("Shared successfully")
	} catch (err) {
	  console.log(`Error: ${err}`)
	}
}
const shareConsulta = async (id, refs) => {
	const shareData = {
		title: "TextoBiblico",
		text: refs,
		url: `https://api-textobiblico.vercel.app/api/search/${id}`
	}
	try {
		await navigator.share(shareData);
		console.log("Shared Consulta successfully")
	} catch (err) {
		console.log(`Error: ${err}`)
	}
}
