const API_URL = 'http://localhost:2018/api';

export async function fetchPeople () {
    const res = await fetch(`${API_URL}/people`);
    const data = await res.json();
    const people = data.map(({name, group}) => {return {name, group}});
    return people;
}

export async function deletePerson (name) {
    return await fetch(`${API_URL}/people/${name}`, { method: 'DELETE'});
}

export async function addPerson (name) {
    return await fetch(`${API_URL}/people/${name}`, { method: 'POST'});
}

export async function groupingPeople (num) {
    return await fetch(`${API_URL}/people/group/${num}`, { method: 'PUT'});
}