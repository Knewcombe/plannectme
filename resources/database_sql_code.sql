/*
	PlanectMeApp database code
*/
CREATE DATABASE planect_me_app;

CREATE TABLE planect_me_app.user_profile
(
	profile_id INT NOT NULL AUTO_INCREMENT,
	country VARCHAR(255) NOT NULL,
	gender VARCHAR(255) NOT NULL,
	allow_rating BOOLEAN NOT NULL,
	visable_rating BOOLEAN NOT NULL,
	hidden BOOLEAN NOT NULL,
	CHECK(gender in ('M', 'F')),
	PRIMARY KEY (profile_id)
);

CREATE TABLE planect_me_app.user_account
(
	user_id INT NOT NULL AUTO_INCREMENT,
	profile_id INT NOT NULL,
	user_email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	date_of_birth DATE NOT NULL,
	PRIMARY KEY (user_id),
	FOREIGN KEY (profile_id) REFERENCES planect_me_app.user_profile (profile_id)
);

CREATE TABLE planect_me_app.profile_rating
(
	profile_id INT NOT NULL,
	rate_profile_id INT NOT NULL,
	rate_amount INT NOT NULL,
	FOREIGN KEY (profile_id) REFERENCES planect_me_app.user_profile (profile_id),
	FOREIGN KEY (rate_profile_id) REFERENCES planect_me_app.user_profile (profile_id),
	PRIMARY KEY (profile_id, rate_profile_id)
);

CREATE TABLE planect_me_app.profile_pic
(
	picture_id INT NOT NULL AUTO_INCREMENT,
	profile_id INT NOT NULL,
	image_location VARCHAR(255) NOT NULL,
	default_picture BOOLEAN NOT NULL,
	FOREIGN KEY (profile_id) REFERENCES planect_me_app.user_profile (profile_id),
	PRIMARY KEY (picture_id)
);

CREATE TABLE planect_me_app.favourite_profile
(
	profile_id INT NOT NULL,
	fav_profile_id INT NOT NULL,
	FOREIGN KEY (profile_id) REFERENCES planect_me_app.user_profile (profile_id),
	FOREIGN KEY (fav_profile_id) REFERENCES planect_me_app.user_profile (profile_id)
)
