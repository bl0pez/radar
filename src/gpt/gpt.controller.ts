import { Controller, Get } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Get()
  async analyzeImage(): Promise<{ msg: string }> {
    return this.gptService.analyzeImage();
  }

}
