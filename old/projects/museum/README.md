# Museum Exhibition Visualization
This project plays around with the d3JS data-modeling JavaScript library; it represents all works in exhibitions for years 2000-2007 in the Princeton Art Museum.

## Usage
1. Go to your terminal and type in 
```git clone https://www.github.com/cjqian/exhibit-visualization.git```
2. Start the server
```python -m SimpleHTTPServer```
3. Go to `localhost:8000` in your browser.

To change data, edit the `flare.json` file.

## SQL Backend
There are the queries that I ran on the current `collections.sql` file to pull the data:

1. Get number of objects in exhibitions each year:
```
select exhibitions.begin_year, count(*) as freq from objects_exhibitions INNER JOIN objects ON objects_exhibitions.object_id = objects.id INNER JOIN exhibitions ON objects_exhibitions.exhibition_id = exhibitions.id group by begin_year having begin_year >= 2000;
```

2. Get titles of exhibitions within a certain year:
```
select exhibitions.exh_title, count(*), exhibitions.begin_year, exhibitions.id from objects_exhibitions INNER JOIN objects ON objects_exhibitions.object_id = objects.id INNER JOIN exhibitions ON objects_exhibitions.exhibition_id = exhibitions.id group by exh_title having begin_year=2011;
```

3. Get each object in the exhibitions:
```
select DISTINCT objects.title from objects_exhibitions INNER JOIN objects ON objects_exhibitions.object_id = objects.id INNER JOIN exhibitions ON objects_exhibitions.exhibition_id = 1462;
```


