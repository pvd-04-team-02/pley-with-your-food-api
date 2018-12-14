// scaffold.js, by Shawn

///////////////////
//               //
// Instructions  //
//               //
///////////////////

/*
//What It Does//

Allows you to scaffold a resource from the command line, creating a new model
in models/, a new route handler in routes/, an updated version of server.js, and
new curl scripts in scripts/<<resource name>>.

//To Use//

(1) Place scaffold.js in the root of your project directory.

(2) Run 'npm install pluralize --save' in the root of your project

(3) Run scaffold.js at the command line from the root of your project

(4) You can destroy a scaffoled resource
using 'node scaffold destroy <<resource name>>'

(5) You can generate a new scaffold
using 'node scaffold generate <<insert stuff here>>'
('node scaffold g <<insert stuff here>>' also works)

(6) After 'node scaffold', include the name of the resource you want to
scaffold. The name should be singular and lowercase.

(7) After the resource name, include the names and types of any fields
in the format '<<field name>>:<<field type>>'

Ex.:

To scaffold a 'person' with 'name' and 'height' fields, run:

node scaffold generate person name:String height:Number

To scaffold a 'dog' with 'name' and 'breed' fields, run:

node scaffold generate dog name:String breed:String

//Notes//

(1) It will automatically capitalize and pluralize the resource name in the
right places; pluralization will be "smart" if you run
"npm install pluralize --save" (e.g., it will automatically make "person" into
"people" in the right places); if you don't, it defaults to a "dumb"
pluralization that just adds an "s" to the end (e.g., it will pluralize "person"
to persons")

(2) When updating server.js, it looks for the lines "// require route files" and
"// register route files" to know where to insert new routes -- these comments
are part of the default GA express-api template

(3) The routes created by the scaffold default to requiring a valid token.
(And the curl scripts are set up expecting a valid token too.)

(4) Any fields created by scaffolding default to "required" in the model

(5) The curl script variable names default to capitalized versions of whatever
you named the fields. So if your resource has a "height" field, the curl script
expects you to enter HEIGHT=<<whatever>> when you run create.sh or update.sh
from the command line. Similarly, a "dateOfBirth" field would lead the curl
script to expect DATEOFBIRTH=<<whatever>>
*/

const fs = require('fs')

// gets the route/model name from command line
const name = process.argv[3]
const capName = name.replace(/^\w/, l => l.toUpperCase())
let names = ''

try {
  const pluralize = require('pluralize')
  names = pluralize(name)
} catch (err) {
  names = name + 's'
}

// defines file paths
const modelPath = `./app/models/${name}.js`
const routePath = `./app/routes/${name}_routes.js`
const curlPath = `./scripts/${names}`

// writeModel() creates a ${name}.js file in the model folder
const writeModel = () => {
  const parsedArgs = []
  for (let i = 4; i < process.argv.length; i++) {
    const colonSpot = process.argv[i].indexOf(':')
    const fieldName = process.argv[i].slice(0, colonSpot)
    const fieldType = process.argv[i].slice(colonSpot + 1)
    parsedArgs.push([fieldName, fieldType])
  }
  let modelMeat = ''
  for (let i = 0; i < parsedArgs.length; i++) {
    modelMeat += `${parsedArgs[i][0]}: {
    type: ${parsedArgs[i][1]},
    required: true
  },\n  `
  }
  const modelData = `const mongoose = require('mongoose')

const ${name}Schema = new mongoose.Schema({
  ${modelMeat}owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('${capName}', ${name}Schema)
`

  fs.writeFile(modelPath, modelData, (err) => {
    if (err) throw err
  })
}

// writeRoutes() creates a ${name}_routes.js file in the routes folder
const writeRoutes = () => {
  const routeData = `const express = require('express')
const passport = require('passport')

const ${capName} = require('../models/${name}')

const handle = require('../../lib/error_handler')
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/${names}', requireToken, (req, res) => {
  ${capName}.find()
    .then(${names} => {
      return ${names}.map(${name} => ${name}.toObject())
    })
    .then(${names} => res.status(200).json({ ${names}: ${names} }))
    .catch(err => handle(err, res))
})

router.get('/${names}/:id', requireToken, (req, res) => {
  ${capName}.findById(req.params.id)
    .then(handle404)
    .then(${name} => res.status(200).json({ ${name}: ${name}.toObject() }))
    .catch(err => handle(err, res))
})

router.post('/${names}', requireToken, (req, res) => {
  req.body.${name}.owner = req.user.id

  ${capName}.create(req.body.${name})
    .then(${name} => {
      res.status(201).json({ ${name}: ${name}.toObject() })
    })
    .catch(err => handle(err, res))
})

router.patch('/${names}/:id', requireToken, (req, res) => {
  delete req.body.${name}.owner

  ${capName}.findById(req.params.id)
    .then(handle404)
    .then(${name} => {
      requireOwnership(req, ${name})

      Object.keys(req.body.${name}).forEach(key => {
        if (req.body.${name}[key] === '') {
          delete req.body.${name}[key]
        }
      })

      return ${name}.update(req.body.${name})
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

router.delete('/${names}/:id', requireToken, (req, res) => {
  ${capName}.findById(req.params.id)
    .then(handle404)
    .then(${name} => {
      requireOwnership(req, ${name})
      ${name}.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

module.exports = router
`
  fs.writeFile(routePath, routeData, (err) => {
    if (err) throw err
  })
}

// writeServer() adds your new routes to the server file if they're not already included
const writeServer = () => {
  const serverFile = fs.readFileSync('server.js').toString().split('\n')
  const requireLineNumber = serverFile.indexOf('// require route files') + 1
  if (serverFile.indexOf(`const ${name}Routes = require('./app/routes/${name}_routes')`) === -1) {
    serverFile.splice(requireLineNumber, 0, `const ${name}Routes = require('./app/routes/${name}_routes')`)
  }
  const useLineNumber = serverFile.indexOf('// register route files') + 1
  if (serverFile.indexOf(`app.use(${name}Routes)`) === -1) {
    serverFile.splice(useLineNumber, 0, `app.use(${name}Routes)`)
  }
  const newServerFile = serverFile.join('\n')
  fs.writeFile('server.js', newServerFile, function (err) {
    if (err) return console.log(err)
  })
}

// writeCurlScripts() adds new curl scripts to scripts/${names}
const writeCurlScripts = () => {
  let curlMeat = ''
  for (let i = 4; i < process.argv.length; i++) {
    const colonSpot = process.argv[i].indexOf(':')
    const fieldName = process.argv[i].slice(0, colonSpot)
    curlMeat += `"${fieldName}":"'"\$\{${fieldName.toUpperCase()}\}"'"`
    if (i !== process.argv.length - 1) {
      curlMeat += ',\n      '
    }
  }
  const create = `#!/bin/bash

API="http://localhost:4741"
URL_PATH="/${names}"

curl "\${API}\${URL_PATH}" \\
  --include \\
  --request POST \\
  --header "Content-Type: application/json" \\
  --header "Authorization: Bearer \${TOKEN}" \\
  --data '{
    "${name}": {
      ${curlMeat}
    }
  }'

echo
`

  const destroy = `#!/bin/bash

API="http://localhost:4741"
URL_PATH="/${names}"

curl "\${API}\${URL_PATH}/\${ID}" \\
  --include \\
  --request DELETE \\
  --header "Authorization: Bearer \${TOKEN}"

echo
`

  const index = `#!/bin/sh

API="http://localhost:4741"
URL_PATH="/${names}"

curl "\${API}\${URL_PATH}" \\
  --include \\
  --request GET \\
  --header "Authorization: Bearer \${TOKEN}"

echo
`

  const show = `#!/bin/sh

API="http://localhost:4741"
URL_PATH="/${names}"

curl "\${API}\${URL_PATH}/\${ID}" \\
  --include \\
  --request GET \\
  --header "Authorization: Bearer \${TOKEN}"

echo
`

  const update = `#!/bin/bash

API="http://localhost:4741"
URL_PATH="/${names}"

curl "\${API}\${URL_PATH}/\${ID}" \\
  --include \\
  --request PATCH \\
  --header "Content-Type: application/json" \\
  --header "Authorization: Bearer \${TOKEN}" \\
  --data '{
    "${name}": {
      ${curlMeat}
    }
  }'

echo
`
// see if the scripts/${name} directory exists before creating curl script files;
// if it doesn't exist, make it
  try {
    fs.accessSync(curlPath)
  }
  catch (err) {
    err.code === 'ENOENT' ? fs.mkdirSync(curlPath) : console.log(err)
  }
// create curl script files
  fs.writeFile(`${curlPath}/create.sh`, create, function (err) {
    if (err) return console.log(err)
  })
  fs.writeFile(`${curlPath}/destroy.sh`, destroy, function (err) {
    if (err) return console.log(err)
  })
  fs.writeFile(`${curlPath}/index.sh`, index, function (err) {
    if (err) return console.log(err)
  })
  fs.writeFile(`${curlPath}/show.sh`, show, function (err) {
    if (err) return console.log(err)
  })
  fs.writeFile(`${curlPath}/update.sh`, update, function (err) {
    if (err) return console.log(err)
  })
}

// generate() runs all the write functions
const generate = () => {
  writeModel()
  writeRoutes()
  writeServer()
  writeCurlScripts()
}

// destroy() removes all the files/changes created by generate()
const destroy = () => {
  // destroy the model
  try {
    fs.unlinkSync(modelPath)
  }
  catch (err) {
    if (err.code !== 'ENOENT') {
      console.log(err)
    }
  }
  // destroy the route
  try {
    fs.unlinkSync(routePath)
  }
  catch (err) {
    if (err.code !== 'ENOENT') {
      console.log(err)
    }
  }
  // remove resource from server.js
  const serverFile = fs.readFileSync('server.js').toString().split('\n')
  const requireLineNumber = serverFile.indexOf(`const ${name}Routes = require('./app/routes/${name}_routes')`)
  if (requireLineNumber !== -1) {
    serverFile.splice(requireLineNumber, 1)
  }
  const useLineNumber = serverFile.indexOf(`app.use(${name}Routes)`)
  if (useLineNumber !== -1) {
    serverFile.splice(useLineNumber, 1)
  }
  const newServerFile = serverFile.join('\n')
  fs.writeFile('server.js', newServerFile, function (err) {
    if (err) return console.log(err)
  })
  // destroy the curl scripts
  // courtesy of stack overflow
  // https://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty
  if (fs.existsSync(curlPath)) {
    fs.readdirSync(curlPath).forEach(function (file, index) {
      const curPath = curlPath + "/" + file
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(curlPath)
  }
}

// determineMode() checks to see whether it should generate or destroy
const determineMode = () => {
  const mode = process.argv[2]
  if (mode === 'generate' || mode === 'g') {
    generate()
  } else if (mode === 'destroy') {
    destroy()
  } else {
    console.error(`Error: ${process.argv[2]} is not a valid command; use 'generate' or 'destroy'`)
  }
}

determineMode()