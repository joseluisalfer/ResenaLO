/**
 * Performs a GET request to fetch data.
 * Returns the JSON object if the response is successful.
 */
export const getData = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Error fetching data");
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Performs a POST request sending a JSON object.
 * Handles responses that can be JSON, plain text, or empty.
 * Returns the parsed object or null if it's not valid JSON or if it's empty.
 */
export const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const textResponse = await response.text();

      if (textResponse) {
        try {
          // Tries to convert the response text into a JSON object
          const result = JSON.parse(textResponse);
          return result;
        } catch (jsonError) {
          // If the server responds successfully but it's not JSON (e.g., success string), returns null
          return null;
        }
      } else {
        // Successful response but empty body
        return null;
      }
    } else {
      const errorText = await response.text();
      throw new Error(`Request error: ${errorText}`);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Performs a PUT request to update existing data.
 * Returns the updated JSON object.
 */
export const updateData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error("Error updating data");
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Performs a DELETE request to remove resources.
 * Handles 204 (No Content) status and optional response bodies.
 */
export const deleteData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // 204 status indicates success with no content to return
    if (response.status === 204) {
      return { success: true };
    }

    if (response.ok) {
      try {
        return await response.json();
      } catch {
        // If there is no JSON in the successful response, confirms success manually
        return { success: true };
      }
    } else {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  } catch (error) {
    throw error;
  }
};
