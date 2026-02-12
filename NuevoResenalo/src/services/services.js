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

// Función para hacer una petición POST
export const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Convertimos el objeto en JSON
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error('Error al enviar los datos');
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
