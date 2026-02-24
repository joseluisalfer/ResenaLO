package principal.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a review entity in the application.
 * Each review contains information about the place, user, rating, images, and metadata.
 */
@Document(collection = "reviews")
public class Review {

	/** Unique identifier for the review. */
	@Id
	private String id;
	/** Title of the review. */
	private String title;
	/** Type/category of the place (e.g., restaurant, hotel). */
	private String type;
	/** Latitude coordinate of the place. */
	private double latitud;
	/** Longitude coordinate of the place. */
	private double longitud;
	/** List of image URLs associated with the review. */
	private List<String> imageUrls;
	/** Username of the user who created the review. */
	private String user;
	/** Current average rating of the review. */
	private double valoration;
	/** Initial rating given when the review was created. */
	private double valorationInitial;
	/** Description or content of the review. */
	private String description;
	/** Date when the review was created. */
	private Date date;

	/**
	 * Default constructor.
	 */
	public Review() {
	}

	/**
	 * Gets the unique identifier of the review.
	 * @return review ID
	 */
	public String getId() {
		return id;
	}

	/**
	 * Sets the unique identifier of the review.
	 * @param id review ID
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * Gets the title of the review.
	 * @return review title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * Sets the title of the review.
	 * @param title review title
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**
	 * Gets the list of image URLs associated with the review.
	 * @return list of image URLs
	 */
	public List<String> getImageUrls() {
		return imageUrls;
	}

	/**
	 * Sets the list of image URLs associated with the review.
	 * @param imageUrls list of image URLs
	 */
	public void setImageUrls(List<String> imageUrls) {
		this.imageUrls = imageUrls;
	}

	/**
	 * Gets the username of the user who created the review.
	 * @return username
	 */
	public String getUser() {
		return user;
	}

	/**
	 * Sets the username of the user who created the review.
	 * @param user username
	 */
	public void setUser(String user) {
		this.user = user;
	}

	/**
	 * Gets the current average rating of the review.
	 * @return average rating
	 */
	public double getValoration() {
		return valoration;
	}

	/**
	 * Sets the current average rating of the review.
	 * @param valoration average rating
	 */
	public void setValoration(double valoration) {
		this.valoration = valoration;
	}

	/**
	 * Gets the description or content of the review.
	 * @return review description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * Sets the description or content of the review.
	 * @param description review description
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * Gets the creation date of the review.
	 * @return creation date
	 */
	public Date getDate() {
		return date;
	}

	/**
	 * Sets the creation date of the review.
	 * @param date creation date
	 */
	public void setDate(Date date) {
		this.date = date;
	}

	/**
	 * Gets the type/category of the place.
	 * @return type/category
	 */
	public String getType() {
		return type;
	}

	/**
	 * Sets the type/category of the place.
	 * @param type type/category
	 */
	public void setType(String type) {
		this.type = type;
	}

	/**
	 * Gets the latitude coordinate of the place.
	 * @return latitude
	 */
	public double getLatitud() {
		return latitud;
	}

	/**
	 * Sets the latitude coordinate of the place.
	 * @param latitud latitude
	 */
	public void setLatitud(double latitud) {
		this.latitud = latitud;
	}

	/**
	 * Gets the longitude coordinate of the place.
	 * @return longitude
	 */
	public double getLongitud() {
		return longitud;
	}

	/**
	 * Sets the longitude coordinate of the place.
	 * @param longitud longitude
	 */
	public void setLongitud(double longitud) {
		this.longitud = longitud;
	}

	/**
	 * Gets the initial rating given when the review was created.
	 * @return initial rating
	 */
	public double getValorationInitial() {
		return valorationInitial;
	}

	/**
	 * Sets the initial rating given when the review was created.
	 * @param valorationInitial initial rating
	 */
	public void setValorationInitial(double valorationInitial) {
		this.valorationInitial = valorationInitial;
	}

}