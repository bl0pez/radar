import requests
from PIL import Image
import io
import numpy as np
import cv2

def download_image(url):
    """Descargar la imagen desde la URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content))
    except requests.exceptions.RequestException as e:
        print(f"Error al descargar la imagen: {e}")
        return None

def analyze_image(image):
    """Analizar la imagen para detectar tormentas o patrones peligrosos."""
    # Convertir la imagen a un array de numpy
    img_array = np.array(image)

    # Verificar el número de canales
    if len(img_array.shape) == 3 and img_array.shape[2] == 3:
        # Convertir a escala de grises
        gray_image = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)
    else:
        # La imagen ya está en escala de grises
        gray_image = img_array

    # Detectar píxeles con valores altos
    high_values = np.where(gray_image > 200)  # Ajusta el umbral según los valores
    if len(high_values[0]) > 0:
        print("¡Posible tormenta detectada!")
        return True
    else:
        print("No se detectaron patrones peligrosos.")
        return False

def send_analysis_to_nestjs(result):
    """Enviar el resultado del análisis a un endpoint de NestJS."""
    nestjs_url = "http://localhost:3000/radar/result"  # Cambia esta URL según tu endpoint
    payload = {"threat_detected": result}
    try:
        response = requests.post(nestjs_url, json=payload)
        if response.status_code == 200:
            print("Resultado enviado correctamente a NestJS.")
        else:
            print(f"Error al enviar el resultado: {response.status_code} {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Error al conectar con NestJS: {e}")

def main():
    radar_url = "https://www2.contingencias.mendoza.gov.ar/radar/sur.gif"

    print("Descargando nueva imagen...")
    image = download_image(radar_url)
    if image:
        print("Analizando imagen...")
        is_threat = analyze_image(image)
        send_analysis_to_nestjs(is_threat)
    else:
        print("No se pudo descargar o analizar la imagen.")

if __name__ == "__main__":
    main()
