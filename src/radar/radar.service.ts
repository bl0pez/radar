import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Jimp } from 'jimp';
import { exec } from 'child_process';

@Injectable()
export class RadarService {
    private readonly logger = new Logger(RadarService.name);

    private radarUrl = 'https://www2.contingencias.mendoza.gov.ar/radar/sur.gif';

    async downloadAndAnalyzeImage(): Promise<void> {
        try {
            // Descargar la imagen desde la URL
            const response = await axios.get(this.radarUrl, {
                responseType: 'arraybuffer',
            });
            const imageBuffer = Buffer.from(response.data);

            // Cargar la imagen con Jimp
            const image = await Jimp.read(imageBuffer);

            // Convertir a escala de grises
            image.greyscale();

            // Detectar píxeles con valores altos (indicativo de tormentas)
            let hasThreat = false;
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (
                x,
                y,
                idx
            ) {
                const pixelValue = this.bitmap.data[idx]; // Valor de grises
                if (pixelValue > 200) {
                    hasThreat = true;
                }
            });

            if (hasThreat) {
                this.logger.warn('¡Posible tormenta detectada!');
            } else {
                this.logger.log('No se detectaron patrones peligrosos.');
            }
        } catch (error) {
            this.logger.error('Error al analizar la imagen:', error.message);
        }
    }

    analyzeWithPython() {

        const scriptPath = 'C:\\Users\\blope\\OneDrive\\Escritorio\\radar\\src\\helpers\\script.py';

        exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                this.logger.error(`Error al ejecutar el script: ${error.message}`);
                return;
            }
            if (stderr) {
                this.logger.warn(`Advertencia: ${stderr}`);
            }
            this.logger.log(`Resultado del script: ${stdout}`);
        });
    }

    @Cron('0 */6 * * * *')
    async analyzeRadarImagePeriodically() {
        this.logger.log('Ejecutando análisis de radar...');
        await this.downloadAndAnalyzeImage();
    }

    @Cron('0 */6 * * * *')
    async executePythonAnalysis() {
        this.logger.log('Ejecutando análisis con script Python...');
        this.analyzeWithPython();
    }
}