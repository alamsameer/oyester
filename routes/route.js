const express = require("express");
const router = express.Router();
const Task = require("../modal/task_modal")
const register=require("../auth/register")
const login=require("../auth/login")
const passport = require('passport')
require("../auth/passport")






/**
* @swagger
* components:
 *   securitySchemes:
 *     bearerAuth:            # arbitrary name for the security scheme
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT  
 *   schemas:
 *     task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the Task
 *         task:
 *           type: string
 *           description: The task to do
 *         status:
 *           type: boolean
 *           description: status of task
 *     addtask:
 *       type: object
 *       properties:
 *         task:
 *           type: string
 *           description: The task to do
 *         status:
 *           type: boolean
 *           description: status of task
 *     userauth:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The task to do
 *         password:
 *           type: string
 *           description: status of task
 */

 /**
  * @swagger
  * tags:
  *   name: Tasks
  *   description: The Tasks managing API
  */

 /**
 * @swagger
 * /register:
 *   post:

 *     summary: register yourself
 *     tags: [Task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/userauth'
 *     responses:
 *       200:
 *         description: you have been registered
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userauth'
 *       500:
 *         description: some server error
 */
 
router.post("/register",register)

 /**
 * @swagger
 * /login:
 *   post:

 *     summary: login  yourself
 *     tags: [Task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/userauth'
 *     responses:
 *       200:
 *         description: you have been loged in
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userauth'
 *       500:
 *         description: some server error
 */
 
  router.post("/login",login)
/**
 * @swagger
 * /:
 *   get:
 *     security:
 *       - bearerAuth: []   
 *     summary: Returns the list of all the Tasks
 *     responses:
 *       200:
 *         description: The list of the tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/task'
*/
router.get("/",async (req, res) => {
    console.log("get me all");
    const AllTask = await Task.find({})
    res.send(AllTask)
})

/**
 * @swagger
 * /task:
 *   post:
 *     security:
 *       - bearerAuth: [] 
 *     summary: Create a new Task
 *     tags: [Task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/addtask'
 *     responses:
 *       200:
 *         description: The task has been updted
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/task'
 *       500:
 *         description: some server error
 */
router.post("/task",passport.authenticate('jwt',{session: false}), async (req, res) => {
    try {
        const { task, status } = req.body
        const addTask = await Task.create({ task, status })
        res.send(addTask)
    }
    catch (e) {
        res.status(500)
    }
})

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: update task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/addtask' 
 *     responses:
 *       200:
 *         description: The task has been updted
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/task'
 *       404:
 *         description: The Task was not found
 */
router.put("/task/:id",passport.authenticate('jwt',{session: false}), async (req, res) => {
    try {
        const id = req.params.id
        const { task, status } = req.body
        const updateTask = await Task.updateOne({ id }, { task, status })
        const AllTask = await Task.find({})
        res.send(AllTask)
    }
    catch {
        res.send(404)
    }

})
/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id 
 *     responses:
 *       200:
 *         description: The task has been deleted
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/task'
 *       500:
 *         description: The task was not found to delete
 */
router.delete("/task/:id",passport.authenticate('jwt',{session: false}), async (req, res) => {
    try{
        const id = req.query.id
        const deleteTask = await Task.deleteOne({ id })
        res.send(200)

    } 
    catch(err){
        res.send(500)
    }
})

module.exports = router