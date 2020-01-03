import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
import { S3 } from 'aws-sdk'
import Formidable from 'formidable'
import fs  from 'fs'
const path = require('path');

export Profiles, { schema } from './model'

const s3 = new S3({ apiVersion: '2006-03-01' });

const router = new Router()
const { name, image, address } = schema.tree

const isProfileSigned = () => (req, res, next) => {

  let stringBody = JSON.stringify(req.body.data)
  console.log(stringBody)
  // keccak256 hash string body
  // ecrecover address with signature and hash
  // verify body address matches sig


  req.body = req.body.data
  next()
}

/**
 * @api {post} /profiles Create profiles
 * @apiName CreateProfiles
 * @apiGroup Profiles
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Profiles's name.
 * @apiParam image Profiles's image.
 * @apiParam address Profiles's address.
 * @apiSuccess {Object} profiles Profiles's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Profiles not found.
 * @apiError 401 user access only.
 */
router.post('/',
  isProfileSigned(),
  body({ name, image, address }),
  create)

const upload = (req, res) => {
  const form = new Formidable();
  form.uploadDir = process.env.UPLOAD_DIR
  console.log(req.headers)
 
  form.parse(req, (err, fields, files) => {
    console.log(fields)
    
    if (!fields.name || !fields.address) {
      console.log("NEED NAME AND ADDRESS")
      res.status(404).send("Error - need name and address")
    }
    if (!files.picture) {
      console.log("NEED pic")
      res.status(404).send("Error - need picture")
    }

    let newpath = path.format({
      dir: process.env.UPLOAD_DIR,
      base: fields.address,
    });
    process.env.UPLOAD_DIR

    fs.renameSync(files.picture.path, newpath)

    res.send("got it");
  });

  //res.status(200).send("FCK")
}

router.post('/upload',
  upload)


/**
 * @api {get} /profiles Retrieve profiles
 * @apiName RetrieveProfiles
 * @apiGroup Profiles
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of profiles.
 * @apiSuccess {Object[]} rows List of profiles.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /profiles/:id Retrieve profiles
 * @apiName RetrieveProfiles
 * @apiGroup Profiles
 * @apiSuccess {Object} profiles Profiles's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Profiles not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /profiles/:id Update profiles
 * @apiName UpdateProfiles
 * @apiGroup Profiles
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Profiles's name.
 * @apiParam image Profiles's image.
 * @apiParam address Profiles's address.
 * @apiSuccess {Object} profiles Profiles's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Profiles not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  body({ name, image, address }),
  update)

/**
 * @api {delete} /profiles/:id Delete profiles
 * @apiName DeleteProfiles
 * @apiGroup Profiles
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Profiles not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  destroy)

export default router
