import { Controller, Get } from '@nestjs/common';
import { RadarService } from './radar.service';

@Controller('radar')
export class RadarController {
  constructor(private readonly radarService: RadarService) {}

  @Get('analyze')
  async analyzeRadarImage() {
    await this.radarService.downloadAndAnalyzeImage();
    return { message: 'Análisis completado' };
  }
}
