import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { RadarService } from './radar.service';

@Controller('radar')
export class RadarController {

  private readonly logger = new Logger(RadarController.name);

  constructor(private readonly radarService: RadarService) {}

  @Get('analyze')
  async analyzeRadarImage() {
    await this.radarService.downloadAndAnalyzeImage();
    return { message: 'Análisis completado' };
  }

  @Post('result')
  async receiveRadarResult(@Body() body: { threat_detected: boolean }) {
    const { threat_detected } = body;

    if (threat_detected) {
      this.logger.warn('¡Se ha detectado una amenaza en el radar!');
    } else {
      this.logger.log('No se detectaron amenazas en el radar.');
    }

    return { message: 'Resultado recibido correctamente', status: 'success' };
  }
}
