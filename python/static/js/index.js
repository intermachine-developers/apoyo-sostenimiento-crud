//formulario
const From = document.getElementById('apoyo-form')

//dom form values
let OID = document.getElementById('oID')

let fullname = document.getElementById('fullname')
let email = document.getElementById('email')
let phone = document.getElementById('phone')
let type_doc = document.getElementById('type_doc')
let num_doc = document.getElementById('num_doc')
let ficha = document.getElementById('ficha')

// render data
const dataAprendices = document.getElementById('aprendices')

let id = null

// functions
async function render_data() {
  await fetch('/apoyos')
    .then(res => res.json())
    .then(data => {
      dataAprendices.innerHTML = ''
      data.map((Data, i) => {
          dataAprendices.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${Data.fullname}</td>
          <td>${Data.email}</td>
          <td>${Data.phone}</td>
          <td>${Data.type_doc}</td>
          <td>${Data.num_doc}</td>
          <td>
            ${Data.ficha} 
            <button onclick="delete_data('${Data._id.$oid}');" class="red white-text btn">
              <i class="material-icons">delete</i>
            </button> 
            <button class="blue darken-1 btn" onclick="edit_data('${Data._id.$oid}');">
              <i class="material-icons">edit</i> 
            </button>
          </td>
        </tr>
      `
      })
    })
    .catch(err => console.log(err))
}

const delete_data = id => {
  if (confirm('Are you sure you want to delete it?')) {
    fetch(`/apoyos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data =>
        M.toast({
          html: data.messsage,
          classes: 'red white-text rounded',
          inDuration: 2000,
        }),
      )
      .catch(err => console.log(err))
  } else {
    M.toast({ html: 'lo siento no eliminaste los datos', inDuration: 2000 })
  }
  render_data()
}

const edit_data = id => {
  fetch(`/apoyos/${id}`)
    .then(res => res.json())
    .then(data => {
      OID.value = data._id.$oid
      fullname.value = data.fullname
      email.value = data.email
      phone.value = data.phone
      type_doc.value = data.type_doc
      num_doc.value = data.num_doc
      ficha.value = data.ficha
    })
}

//events
document.addEventListener('DOMContentLoaded', function() {
  let elems = document.querySelectorAll('select')
  M.FormSelect.init(elems, { classes: 'options' })
})

From.addEventListener('submit', e => {
  id = OID.value
  if (id == 0) {
    fetch('/apoyos', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        fullname: fullname.value,
        email: email.value,
        phone: Number(phone.value),
        type_doc: type_doc.value,
        num_doc: Number(num_doc.value),
        ficha: Number(ficha.value),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data =>
        M.toast({
          html: data.messsage,
          classes: 'green darken-4 rounded',
          inDuration: 2000,
        }),
      )
      .catch(err => console.error(err))
  } else {
    fetch(`/apoyos/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({
        fullname: fullname.value,
        email: email.value,
        phone: Number(phone.value),
        type_doc: type_doc.value,
        num_doc: Number(num_doc.value),
        ficha: Number(ficha.value),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data =>
        M.toast({
          html: data.messsage,
          classes: 'blue darken-1 rounded',
          inDuration: 2000,
        }),
      )
      .catch(err => console.error(err))
  }

  e.preventDefault()
  From.reset()
  render_data()
})


//start render data
render_data()