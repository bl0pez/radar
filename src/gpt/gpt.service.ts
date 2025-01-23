import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { OpenAI } from 'openai';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GptService {

    constructor(private readonly httpService: HttpService) {}
    
    private openAi = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    async analyzeImage(): Promise<{ msg: string }> {
        return this.imageToText();
    }

    private async imageToText(): Promise<any> {
        const response = await this.openAi.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "eres un experto en meteorología y vas a analizar la siguiente imagen y me responderás de la siguiente manera: si hay alguna tormenta en la zona o tiene indicadores de que se pueda formar una. dame la respuesta en texto con una breve descripción si hay algún peligro en la zona"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": "https://www2.contingencias.mendoza.gov.ar/radar/sur.gif",
                            },
                        },
                    ],
                }
            ],
            max_tokens: 100,
        });

        return { msg: response.choices[0].message.content };
    }
}