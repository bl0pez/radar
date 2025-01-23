import requests
from PIL import Image
import io
import numpy as np
import cv2
import time

def download_image(url):
    """Descargar imagen desde la URL."""
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
        # La imagen tiene 3 canales, convertir a escala de grises
        gray_image = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)
    else:
        # La imagen ya está en escala de grises
        gray_image = img_array

    # Extraer regiones con valores altos (indicativo de tormentas)
    high_values = np.where(gray_image > 200)  # Ajusta el umbral según la escala de colores
    if len(high_values[0]) > 0:
        print("¡Posible tormenta detectada!")
        return True
    else:
        print("No se detectaron patrones peligrosos.")
        return False

def main():
    url = "https://www2.contingencias.mendoza.gov.ar/radar/sur.gif"
    interval = 6 * 60  # Intervalo en segundos (6 minutos)

    while True:
        print("Descargando nueva imagen...")
        image = download_image(url)
        if image:
            print("Analizando imagen...")
            is_threat = analyze_image(image)
            if is_threat:
                print("ALERTA: Se detectó una posible tormenta.")
        else:
            print("No se pudo analizar la imagen.")

        print(f"Esperando {interval // 60} minutos para el próximo análisis...")
        time.sleep(interval)

if __name__ == "__main__":
    main()
