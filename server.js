import express from express
import {ENV} from "./utils/ENV.js"

const app = express()



app.listen(ENV.PORT , ()=>{
    console.log(`Listening on PORT ${ENV.PORT}`)
})


