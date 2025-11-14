import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
    getHello(): string 
    {
        return 'Hello World! from HelloService NestJS';
    }
    getHelloWithName(name: string): string 
    {
        return `Hello, ${name}! Welcome to NestJS.`;
    }
}
