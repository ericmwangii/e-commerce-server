CREATE TABLE button_click (
	id serial PRIMARY KEY,
	button_id VARCHAR(90),
	created_date TIMESTAMP NOT NULL DEFAULT now(),
  clicks integer
);


-- docker exec -it dbcontainername bash