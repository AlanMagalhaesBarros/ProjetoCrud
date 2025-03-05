
'use strict'
require('dotenv').config();

const APPLICATION_ID = process.env.APPLICATION_ID;
const REST_API_KEY = process.env.REST_API_KEY;
const SERVER_URL = process.env.SERVER_URL;

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

// CRUD functions using Back4App

const createClient = async (client) => {
    const response = await fetch(`${SERVER_URL}/classes/Client`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': APPLICATION_ID,
            'X-Parse-REST-API-Key': REST_API_KEY
        },
        body: JSON.stringify(client)
    });
    return response.json();
}

const readClients = async () => {
    const response = await fetch(`${SERVER_URL}/classes/Client`, {
        method: 'GET',
        headers: {
            'X-Parse-Application-Id': APPLICATION_ID,
            'X-Parse-REST-API-Key': REST_API_KEY
        }
    });
    const data = await response.json();
    return data.results;
}

const updateClient = async (id, client) => {
    const response = await fetch(`${SERVER_URL}/classes/Client/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': APPLICATION_ID,
            'X-Parse-REST-API-Key': REST_API_KEY
        },
        body: JSON.stringify(client)
    });
    return response.json();
}

const deleteClient = async (id) => {
    const response = await fetch(`${SERVER_URL}/classes/Client/${id}`, {
        method: 'DELETE',
        headers: {
            'X-Parse-Application-Id': APPLICATION_ID,
            'X-Parse-REST-API-Key': REST_API_KEY
        }
    });
    return response.json();
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const isValidFields = () => document.getElementById('form').reportValidity();

const saveClient = async () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nomeCliente').value,
            email: document.getElementById('seuEmail').value,
            fone: document.getElementById('fone').value,
            cidade: document.getElementById('rCidade').value
        }

        const index = document.getElementById('nomeCliente').dataset.index
        if (index === 'new') {
            await createClient(client)
        } else {
            await updateClient(index, client)
        }
        closeModal()
        updateTable()
    }
}

const createRow = (client) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.fone}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${client.objectId}">Editar</button>
            <button type="button" class="button red" id="delete-${client.objectId}">Excluir</button>
        </td>
    `
    document.querySelector('#tableCliente>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableCliente>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = async () => {
    const clients = await readClients()
    clearTable()
    clients.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nomeCliente').value = client.nome
    document.getElementById('seuEmail').value = client.email
    document.getElementById('fone').value = client.fone
    document.getElementById('rCidade').value = client.cidade
    document.getElementById('nomeCliente').dataset.index = client.objectId
}

const editClient = async (id) => {
    const clients = await readClients()
    const client = clients.find(client => client.objectId === id)
    fillFields(client)
    openModal()
}

const editDelete = async (event) => {
    if (event.target.type == 'button') {
        const [action, id] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(id)
        } else if (action == 'delete') {
            const response = confirm(`Deseja realmente excluir o cliente?`)
            if (response) {
                await deleteClient(id)
                updateTable()
            }
        }
    }
}

updateTable()

// Event listeners

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salva')
    .addEventListener('click', saveClient)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

document.querySelector('#tableCliente>tbody')
    .addEventListener('click', editDelete)