// Función para hacer una petición GET
export const getData = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error al obtener los datos');
    }
  } catch (error) {
    console.log('Error en GET:', error);
    throw error;
  }
};

export const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Convertimos el objeto en JSON
    });

    // Verificar si la respuesta es exitosa
    if (response.ok) {
      const textResponse = await response.text(); // Leer como texto

      console.log('Respuesta del servidor:', textResponse); // Imprimir lo que devuelve el servidor

      // Si la respuesta no está vacía, intentamos convertirla en JSON
      if (textResponse) {
        try {
          const result = JSON.parse(textResponse); // Intentamos convertir el texto en JSON
          return result; // Devolvemos el resultado JSON
        } catch (jsonError) {
          console.log('Error al analizar JSON:', jsonError);
          console.log('Respuesta no es JSON válido:', textResponse);
          return null; // Si no es JSON válido, devolvemos null
        }
      } else {
        console.log('Respuesta vacía del servidor');
        return null; // Si la respuesta está vacía, devolvemos null
      }
    } else {
      // Si la respuesta no es exitosa, leer el cuerpo del error como texto
      const errorText = await response.text();
      console.log('Error en la solicitud:', errorText); // Depuración
      throw new Error(`Error en la solicitud: ${errorText}`);
    }
  } catch (error) {
    console.log('Error en POST:', error);
    throw error;
  }
};


// Función para hacer una petición PUT (actualización de datos)
export const updateData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Convertimos el objeto en JSON
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error('Error al actualizar los datos');
    }
  } catch (error) {
    console.log('Error en PUT:', error);
    throw error;
  }
};

// Función para hacer una petición DELETE
export const deleteData = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error('Error al eliminar los datos');
    }
  } catch (error) {
    console.log('Error en DELETE:', error);
    throw error;
  }
};
