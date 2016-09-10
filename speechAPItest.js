'use strict'

// [START app]
// [START import_libraries]
const google = require('googleapis')
const async = require('async')
const fs = require('fs')

// Get a reference to the speech service
let speech = google.speech('v1beta1').speech
// [END import_libraries]

// [START authenticating] Gets credentials to access the Cloud Speech API
function getAuthClient (cb) {
  // Acquire credentials
  google.auth.getApplicationDefault((err, authClient) => {
    if (err) {
      return cb(err)
    }

    // The createScopedRequired method returns true when running on GAE or a
    // local developer machine. In that case, the desired scopes must be passed
    // in manually. When the code is  running in GCE or a Managed VM, the scopes
    // are pulled from the GCE metadata server.
    // See https://cloud.google.com/compute/docs/authentication for more
    // information.
    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
      // Scopes can be specified either as an array or as a single,
      // space-delimited string.
      authClient = authClient.createScoped([
        'https://www.googleapis.com/auth/cloud-platform'
      ])
    }

    return cb(null, authClient)
  })
}
// [END authenticating]

// [START construct_request]
function prepareRequest (inputFile, cb) {
  // Reads the speech(.raw, LINEAR16 encdoed binary) file.
  fs.readFile(inputFile, (err, audioFile) => {
    if (err) {
      return cb(err)
    }
    console.log('Got audio file!')
    let encoded = new Buffer(audioFile).toString('base64')
    let payload = {
      config: {
        encoding: 'LINEAR16',
        sampleRate: 16000
      },
      audio: { content: encoded }
    }
    return cb(null, payload)
  })
}
// [END construct_request]

function main (inputFile, callback) {
  var requestPayload

  async.waterfall([
    function (cb) { prepareRequest(inputFile, cb) },
    function (payload, cb) {
      requestPayload = payload
      getAuthClient(cb)
    },
    // [START send_request]
    function sendRequest (authClient, cb) {
      console.log('Analyzing speech...')
      speech.syncrecognize({
        auth: authClient,
        resource: requestPayload
      }, function (err, result) {
        if (err) {
          return cb(err)
        }
        console.log('result:', JSON.stringify(result, null, 2))
        cb(null, result)
      })
    }
    // [END send_request]
  ], callback)
}

// [START run_application]
if (module === require.main) {
  if (process.argv.length < 3) {
    console.log('Usage: node recognize <inputFile>')
    process.exit()
  }
  var inputFile = process.argv[2]
  main(inputFile, console.log)
}
// [END run_application]
// [END app]

exports.main = main
