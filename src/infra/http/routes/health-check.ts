import { InvalidaFileSize } from '@/app/usecases/errors/invalid-file-size'
import type { FastifyInstance } from 'fastify'

export async function healthCheckRoute(server:FastifyInstance) {
  server.get(
    '/health',
    async (request, reply) => {
      await reply.status(200).send({ message: 'All good now Powered by AWS!' })
    }
  )
}
