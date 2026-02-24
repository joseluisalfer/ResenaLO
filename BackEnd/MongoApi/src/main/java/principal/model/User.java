package principal.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

	@Id
	private String id;
	private String user;
	private String name;
	private String password;
	private String email;
	private String image;
	private Date date;
	private List<String> followeds = new ArrayList<>();
	private List<String> followers = new ArrayList<>();
	private List<String> friends = new ArrayList<>();
	private int token;
	private boolean verified;
	private String description;
	private String theme;
	private String language;
	public User() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public List<String> getFolloweds() {
		return followeds;
	}

	public void setFolloweds(List<String> followeds) {
		this.followeds = followeds;
	}

	public List<String> getFollowers() {
		return followers;
	}

	public void setFollowers(List<String> followers) {
		this.followers = followers;
	}

	public List<String> getFriends() {
		return friends;
	}

	public void setFriends(List<String> friends) {
		this.friends = friends;
	}

	public int getToken() {
		return token;
	}

	public void setToken(int token) {
		this.token = token;
	}

	public boolean isVerified() {
		return verified;
	}

	public void setVerified(boolean verified) {
		this.verified = verified;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	/**
	 * Gets the description of the user.
	 * @return user description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * Sets the description of the user.
	 * @param description user description
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * Gets the theme preference of the user (e.g., "light" or "dark").
	 * @return theme preference
	 */
	public String getTheme() {
		return theme;
	}

	/**
	 * Sets the theme preference of the user.
	 * @param theme theme preference
	 */
	public void setTheme(String theme) {
		this.theme = theme;
	}

	/**
	 * Gets the language preference of the user (e.g., "en", "es").
	 * @return language preference
	 */
	public String getLanguage() {
		return language;
	}

	/**
	 * Sets the language preference of the user.
	 * @param language language preference
	 */
	public void setLanguage(String language) {
		this.language = language;
	}

}
