import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import morgan from 'morgan'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './utils/http-exception-filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true })

  const config = app.get(ConfigService)

  // cors configuration
  app.enableCors({
    origin: [config.get('ui.baseUrl')],
    credentials: true,
  })

  // morgan http logger
  if (config.get('morgan')) {
    app.use(morgan(config.get('morgan')))
  }

  // class interceptor and validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  // swagger configuration
  const options = new DocumentBuilder()
    .setTitle('MHP Challenge API')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
    },
  })

  app.useGlobalFilters(new HttpExceptionFilter())

  const port = process.env.PORT || 3000
  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`)
}

bootstrap().catch((error) => console.error(error))
