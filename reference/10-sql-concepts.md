# 10 SQL concepts

## 1. SELECT

- picks whic columns comes back -not which rows
- Table -> Chosen columns

## 2. JOIN

- Lines up rows from two tables that share a key
- Table A -> Matched Key (Unique ID) <- Table B (Foreign Key)

## 3. WHERE

- Filters rows before anything gets grouped or counted
- All Rows -> Filted Rows

## 4. GROUP BY

- Collapses many rows into one per distinct value
- Rows -> Buckets

## 5. INDEX

- A pre-sorted shortcut so the engine doesnt read all 10M rows every time
- Like a book index
- Table -> Index (sorted subset)
- Faster read but slower writes
- Fill scan -> Direct Look up

## 6. TRANSACTIONS

- A single unit of work
- Every statement inside succeeds together or fails together
- Begin -> Do work -> Commit or Rollback

## 7. VIEW

- A query wearing a table's clothes - nothing is stored actually.
- It's just a stored query that you can query against.
- Use it to simplify complex queries or to provide a layer of abstraction over your database.

## 8. TRIGGER

- code that run itself the moment a row is touched
- Row Changes -> Fires Trigger -> Runs Automatically
- Example: Update last modified timestamp every time a row is updated

## 9. NORMALIZATION

- splits data apart so the same fact never lives in two places
- reduces redundancy and improves data integrity
- Avoids update/delete anomalies
- 1NF -> 2NF -> 3NF

## 10. DE-NORMALIZATION

- intentionally introduce redundancy to improve query performance
- Denormalization is a strategy that involves adding redundant data to a database schema to improve query performance.
- It is often used in data warehousing and data analytics scenarios where query speed is prioritized over data integrity.
- Denormalization is the opposite of normalization, which aims to reduce redundancy and improve data integrity.

## BONUS

## 11. CTE (Common Table Expressions)

- a temporary, named result you can reference later in the same query.
- Named Subquery -> CTE -> Better Readability, Modularity and Reusability -> Used like a table
- Good for breaking down complex logic into smaller, more manageable steps.
- Example:

```sql
WITH cte_name AS (
    SELECT column1, column2, ...
    FROM table_name
    WHERE condition
)
SELECT * FROM cte_name;
```

## 12. WINDOW FUNCTIONS

- Performs calculations across a set of table rows that are somehow related to the current row.
- "Window" = set of rows
- Similar to GROUP BY but instead of collapsing rows, it returns a value for each row
- OVER() clause defines the window
- PARTITION BY divides rows into partitions
- ORDER BY sorts rows within each partition
- Example:

```sql
SELECT
    column_name,
    AVG(value) OVER (PARTITION BY category) as avg_category_value
FROM
    table_name;
```

## 13. STORED PROCEDURE

- A precompiled collection of SQL statements stored in the database as a single unit.
- SQL Code -> Compiled Object -> Reusable -> Security & Performance
- Example:

```sql
CREATE PROCEDURE GetOrdersByCustomer
    @CustomerID INT
AS
BEGIN
    SELECT
        OrderID,
        OrderDate,
        TotalAmount
    FROM
        Orders
    WHERE
        CustomerID = @CustomerID;
END;
```
