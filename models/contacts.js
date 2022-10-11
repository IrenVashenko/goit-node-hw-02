const fs = require('fs').promises;
const path = require('path');
const {nanoid} = require("nanoid");


const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async() => {
    const data = await fs.readFile(contactsPath, "utf-8");
    const dataPars = JSON.parse(data)
    return dataPars;
}

const getContactById = async(id) => {
    const contacts = await listContacts();
    const contactId = String(id)
    const contactsById = contacts.filter(contact => contact.id === contactId);
    return contactsById || null;
}

const addContact = async(data) => {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        ...data
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts; 
}

const removeContact = async(id) => {
   const contacts = await listContacts();
   const contactId = String(id)
   const index = contacts.findIndex(contact => contact.id === contactId);
   if(index === -1) {
    return null;
   };
   const [result] = contacts.splice(index, 1)
   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
   return result
}


const updateContact = async (contactId, body) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    console.log(index)
    if(index === -1) {
        return null;
    };
    contacts[index] = {...body, contactId};
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}

//module.exports = {
//     listContacts, 
//     getContactById,
//     addContact,
//     removeContact
// }