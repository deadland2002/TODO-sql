const express = require('express')
const cors = require('cors')
const JWT = require('jsonwebtoken')
const stream = require("stream");

const app = express()

const port = 3000
const secret = "0923u49082yeyn89y8"

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Todos',
    password: '2002',
    port: 5432,
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/SignIn', async (request, response) => {
    try {
        const {username, password} = request.body;

        const UserValidate = await pool.query(`SELECT * FROM public."UserCred" WHERE "UserName" = '${username}'`)
        console.log(UserValidate.rows[0]);
        const UserData = UserValidate.rows[0];

        if (UserData && password == UserData.Password) {
            const userTokenObj = {
                username: UserData.UserName,
                password: UserData.Password,
                date: Date.now()
            }
            console.log(userTokenObj);

            const token = await JWT.sign(userTokenObj, secret);
            return response.status(200).json({status: 200, token});
        }
        return response.status(200).json({status: 401, message: "username or password invalid"});
    } catch (err) {
        return response.status(200).json({status: 401, message: "internal server error"});
    }
})

app.get('/todos', async (request, response) => {
    const tokenGot = request.headers.authorization;
    console.log(request.headers.authorization);
    if (tokenGot) {
        try {
            const isVerified = JWT.verify(tokenGot, secret);
            if (isVerified && isVerified.username) {
                const todosRetrived = await pool.query(`SELECT * FROM public."TodosList" WHERE "UserName" = '${isVerified.username}'`)
                const rows_recieved = todosRetrived.rows;
                return response.status(200).json({status: 200, message: "success", todos: rows_recieved});
            } else {
                console.log(isVerified)
                return response.status(200).json({status: 401, message: "invalid token"});
            }
        } catch (err) {
            console.log(err)
            return response.status(200).json({status: 401, message: "invalid token"});
        }
    } else {
       return response.status(200).json({status: 401, message: "no token"});
    }

})







app.post('/Add', async (request, response) => {
    const {title , description} = request.body;
    const tokenGot = request.headers.authorization;
    console.log(request.headers.authorization);
    if (tokenGot && title && description) {
        try {
            const isVerified = JWT.verify(tokenGot, secret);
            if (isVerified && isVerified.username) {
                const queryStr = `INSERT INTO PUBLIC."TodosList" ("Id", "UserName", "Title", "Description")
                                         SELECT MAX("Id") + 1, '${isVerified.username}', '${title}', '${description}' FROM PUBLIC."TodosList";
                                        `
                console.log(queryStr);
                const todosRetrived = await pool.query(queryStr)
                const rows_recieved = todosRetrived.rows;
                return response.status(200).json({status: 200, message: "success", todos: rows_recieved});
            } else {
                console.log(isVerified)
                return response.status(200).json({status: 401, message: "invalid token"});
            }
        } catch (err) {
            console.log(err)
            return response.status(200).json({status: 401, message: "invalid token"});
        }
    } else {
        return response.status(200).json({status: 401, message: "no token"});
    }

})

app.post('/')

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
