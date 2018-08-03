vocab trainer client

'vocab trainer client' is client project of vocab trainer project
it will run with 'vocab trainer server' project


Impeovements:
- when a word is carry list and the actual word is deleted, its id will remain carry object in database,
  also remove this unused wordId from the object.


  DEBUG INSTRUCTIONS:
  
  - send ajax requests with credentials = true
    in transporter.ts add options object in ajax calls with { withCredentials: true }

  - enable CORS requestes on server project in app.js