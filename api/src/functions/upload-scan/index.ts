import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import { gql } from 'graphql-request'
import { uploadFile } from '../../services/storage'
import { restAdapter } from '../../utils/middleware'
import { request } from '../../utils/gql'

const INSERT_NOTE = gql`
  mutation InsertNote($payload: notes_insert_input!) {
    insert_notes_one(object: $payload) {
      id
    }
  }
`

const insertNote = ({ noteId, image, experiment_id }) =>
  request(INSERT_NOTE, { payload: { id: noteId, image, experiment_id } })

export const uploadScan = restAdapter(async ({ body }) => {
  const { experiment_id, image_upload } = body.input.payload

  const noteId = uuidv4()

  const imageBuffer = Buffer.from(image_upload, 'base64')
  const imagePath = `experiments/${experiment_id}/notes/${noteId}-img`

  const image = await sharp(imageBuffer)
    .resize({
      width: 1024,
      height: 1024,
      fit: 'inside',
    })
    .jpeg({
      quality: 100,
      chromaSubsampling: '4:4:4',
    })
    .toBuffer()

  const imageUrl = await uploadFile(image, imagePath, {
    gzip: true,
    contentType: 'image/jpeg',
  })

  await insertNote({ noteId, image: imageUrl, experiment_id })

  return { data: { success: true } }
})
