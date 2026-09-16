# Student Result Management System

A simple, beginner-friendly web app for managing student records and their course results. It is built with plain HTML, CSS, and JavaScript, and data is stored in the browser using `localStorage` so it remains available after refresh.

## Features

- Add new students with their name and matric number
- Select a student from a dropdown list
- Add one or more course results per student
- Automatically calculate grades based on score:
  - A: 70+
  - B: 60-69
  - C: 50-59
  - D: 45-49
  - E: 40-44
  - F: below 40
- View total and average score for the selected student
- Delete a student and all their results
- No framework or backend required

## Project Structure

- `index.html` — main user interface
- `style.css` — styling for the layout and forms
- `script.js` — application logic and data handling
- `NWUpic.jpeg` — app logo image

## How to Run

1. Open the project folder.
2. Double-click `index.html` in a browser, or serve the folder using a local web server.
3. Start adding students and their results.

Example local server command:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## How It Works

The app stores student data in an array and saves it to `localStorage` under a key named `srs_data_v1`. When the page loads, it reads that saved data, rebuilds the student dropdown, and displays the selected student's results and summary statistics.

## Notes

- This project is intentionally simple and designed for learning.
- It works entirely in the browser and does not connect to a database or server.
- Input validation is included for required fields and score ranges.

## Author

Aminu Shehu
