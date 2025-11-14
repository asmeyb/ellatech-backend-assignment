import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

@Module({
  controllers: [HelloController],
  providers: [HelloService],
  exports: [HelloService],//exports services if needed in other modules
  imports: [], //import other modules if needed
})
export class HelloModule {}
