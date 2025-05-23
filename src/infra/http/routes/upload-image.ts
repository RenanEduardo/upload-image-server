import { InvalidaFileSize } from '@/app/usecases/errors/invalid-file-size'
import { MissingFile } from '@/app/usecases/errors/missing-file'
import { uploadImage } from '@/app/usecases/upload-image'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        tags: ['upload'],
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({ url: z.string() }).describe('Image uploaded'),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: { fileSize: 1024 * 1024 * 3 }, // 3mb
      })
      if (!uploadedFile) {
        return reply.status(400).send(new MissingFile())
      }

      const result = await uploadImage({
        fileName: uploadedFile?.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      if (uploadedFile.file.truncated) {
        return reply.status(400).send(new InvalidaFileSize())
      }

      if (isRight(result)) {
        console.log(unwrapEither(result))
        return reply.status(201).send(unwrapEither(result))
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'InvalidFileFormat':
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}
