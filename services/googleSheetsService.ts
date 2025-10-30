import { GoogleSheetRow } from '../types';

// IMPORTANTE: Reemplaza esta URL con la URL de tu propia aplicación web
// que obtuviste al implementar el Google Apps Script.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwgH77Ncyle1iJtOBm2VWr1eX6OomolOO2XiCcMKb_MEDOxnPdqCt_gB3DtLooKuUNr/exec';

/**
 * Guarda los resultados de la entrevista enviando los datos a un endpoint de Google Apps Script.
 * @param data Los datos a guardar.
 * @returns Una promesa que se resuelve a un objeto indicando el éxito y un mensaje de error opcional.
 */
export const saveInterviewResults = async (data: GoogleSheetRow): Promise<{ success: boolean; message?: string }> => {
  console.log("Enviando datos a Google Sheets:", data);
  
  if (GOOGLE_SCRIPT_URL.includes('xxxxxxxxxxxxxxxxxxxxxxxxxxxx')) {
    console.error("Error: La URL de Google Apps Script no ha sido configurada.");
    alert("Error de configuración: La URL para guardar los datos no es válida. Revisa el archivo services/googleSheetsService.ts.");
    return { success: false, message: "URL de guardado no configurada." };
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      body: JSON.stringify(data),
      redirect: 'follow'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fallo al enviar datos a Google Sheets. Status HTTP:", response.status, errorText);
      return { success: false, message: `Error del servidor (HTTP ${response.status})` };
    }

    const result = await response.json();

    if (result && result.status === 'success') {
      console.log("Datos guardados exitosamente, confirmado por el servidor.");
      return { success: true };
    } else {
      const errorMessage = result.message || 'Error desconocido del script.';
      const errorDetails = result.details || '';
      console.error("El script de Google respondió con un error:", errorMessage, errorDetails);
      // Combinar mensaje y detalles si existen
      const fullError = errorDetails ? `${errorMessage}\nError: ${errorDetails}`: errorMessage;
      return { success: false, message: `El script de Google respondió con un error:\n${fullError}` };
    }
  } catch (error) {
    console.error("Error de red o de parsing al enviar datos a Google Sheets:", error);
    return { success: false, message: "No se pudo conectar con el servidor de guardado. Revisa tu conexión a internet." };
  }
};