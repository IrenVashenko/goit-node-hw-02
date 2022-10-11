const express = require('express')

const router = express.Router()
const Joi = require('joi');
const contacts = require("../../models/contacts");

const contactScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get('/', async (req, res, next) => {
  try {
    const contactAll = await contacts.listContacts();
    res.json({
      status: "success",
      code: 200,
      date: {
        result: contactAll
      }
    });
  } catch(error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const contactById = await contacts.getContactById(contactId);
    if(contactById.length === 0) {
      const error = new Error(`Not found the contact id=${contactId}`)
      error.status = 404;
      throw error;
    }
    res.json({
      state: "success",
      code: 200,
      date: {
        result: contactById
      }
    })
  }catch(error) {
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try{
    const {error} = contactScheme.validate(req.body);
    if(error) {
      error.state = 400;
      throw error;
    }
    const contactAdd = await contacts.addContact(req.body);
    res.status(201).json({
      status:"success",
      code: 201,
      data: {
        contactAdd
      }
    })
  } catch(error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try{
    const {contactId} = req.params;
    const contactRemove = await contacts.removeContact(contactId);
    if(!contactRemove) {
      const error = new Error(`Not found`)
      error.status = 404;
      throw error;
    }
    res.json({
      status: "error",
      code: 200,
      message: "contact deleted"
    });
  }catch(error){
    next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const {error} = contactScheme.validate(req.body);
    if(error) {
      error.status = 400;
      throw error;
    }
    const {contactId} = req.params;
    const updateID = await contacts.updateContact(contactId, req.body);
    if(!updateID){
      const err = new Error({"message": "Not found"});
      error.status = 404;
      throw error;
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        updateID
      }
        })
  } catch(error) {
    next(error)
  }
})


module.exports = router
