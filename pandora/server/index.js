const express = require('express')
const next = require('next')

const port = process.env.PORT || 3001
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()